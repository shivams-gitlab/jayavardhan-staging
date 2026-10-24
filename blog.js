/**
 * js/blog.js
 * ----------------------------------------------------------------------
 * Powers two things from a single data source (data/posts.json, the file
 * Decap CMS edits at /admin):
 *   1. The "Latest Blog Posts" preview on the Home page (#home-blog-preview)
 *      — shows the 3 most recent posts only.
 *   2. The full Blog index page (#blog-grid) — shows every post, plus a
 *      client-side search box and tag filter (no server/database needed;
 *      it just hides/shows the already-rendered cards).
 *
 * This script safely does nothing on pages that have neither container,
 * so it's harmless to include everywhere via a single <script> tag.
 *
 * Why there's static fallback HTML already sitting in blog.html/index.html:
 *   fetch() cannot load a local JSON file when a page is opened directly
 *   from disk (file://...) — browsers block this for security reasons.
 *   It works fine once the site is served over http(s), which includes
 *   local dev servers (e.g. `npx serve`) and any real deployment.
 *   Rather than show a blank page in the file:// case, those pages ship
 *   with the current 3 posts already written out by hand in the HTML.
 *   This script simply overwrites that fallback the moment the fetch
 *   succeeds, so visitors on a real server never see stale content.
 * ----------------------------------------------------------------------
 */
(function () {
  var DATA_URL = 'data/posts.json'; // js/blog.js only runs on root-level pages (index.html, blog.html)

  // Builds the URL to an individual post's page. blog/post.html is a single
  // generic template — which post it shows is decided entirely by the
  // ?slug=... query string, so adding a new post never requires a new file.
  function postUrl(post) {
    // Path depends on whether the current page lives at the site root or inside /blog/
    var base = window.location.pathname.indexOf('/blog/') !== -1 ? '' : 'blog/';
    return base + 'post.html?slug=' + encodeURIComponent(post.slug);
  }

  // Renders one post as a clickable card. Used for both the homepage
  // preview and the full blog grid — same markup, same CSS classes.
  function cardHTML(post) {
    var url = postUrl(post);
    // Strip leading '../' or '/' to normalize the image path to "images/filename.ext"
    var cleanImage = post.image ? post.image.replace(/^(\.\.\/|\/)/, '') : '';

    // If blog.js runs on a page inside /blog/, step out using '../', otherwise use path directly
    var isInBlogDir = window.location.pathname.indexOf('/blog/') !== -1;
    var imageSrc = (isInBlogDir ? '../' : '') + cleanImage;
    return (
      '<a class="blog-card" href="' + url + '" data-title="' + post.title.toLowerCase() +
      '" data-tag="' + post.tag.toLowerCase() + '" data-excerpt="' + post.excerpt.toLowerCase() + '">' +
        '<div class="blog-card-img"><img src="' + imageSrc + '" alt="" loading="lazy"></div>' +
        '<div class="blog-card-body">' +
          '<div class="blog-card-tag">' + post.tag + '</div>' +
          '<h3>' + post.title + '</h3>' +
          '<p>' + post.excerpt + '</p>' +
          '<div class="blog-card-date">' + post.date_display + '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function init(posts) {
    // --- Home page preview: latest 3 posts only ---
    var homeGrid = document.getElementById('home-blog-preview');
    if (homeGrid) {
      var latest = posts.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 3);
      homeGrid.innerHTML = latest.map(cardHTML).join('');
    }

    // --- Blog index page: every post, plus search + tag filter ---
    var grid = document.getElementById('blog-grid');
    if (!grid) return; // not on the blog index page — nothing more to do

    var sorted = posts.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    grid.innerHTML = sorted.map(cardHTML).join('');

    var input = document.getElementById('blog-search-input');
    var empty = document.getElementById('blog-empty');
    var tagBtns = document.querySelectorAll('.blog-tag-btn');
    var activeTag = 'all';

    // Filtering is done entirely client-side by toggling display:none on
    // cards already in the DOM — no re-fetching, no server round trip.
    // Each card's data-title/data-tag/data-excerpt attributes (set in
    // cardHTML above) are what gets matched against the search box.
    function applyFilter() {
      var q = (input && input.value || '').trim().toLowerCase();
      var cards = grid.querySelectorAll('.blog-card');
      var visibleCount = 0;
      cards.forEach(function (card) {
        var matchesTag = activeTag === 'all' || card.dataset.tag === activeTag;
        var matchesQuery = !q ||
          card.dataset.title.indexOf(q) !== -1 ||
          card.dataset.excerpt.indexOf(q) !== -1 ||
          card.dataset.tag.indexOf(q) !== -1;
        var show = matchesTag && matchesQuery;
        card.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });
      // Show the "no posts match" message only when a search/filter has
      // hidden every card — never on first load.
      if (empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (input) input.addEventListener('input', applyFilter);
    tagBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tagBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        activeTag = btn.dataset.tag;
        applyFilter();
      });
    });
  }

  // Kick things off: fetch the CMS-editable data file and render.
  // On failure (see the file:// note in the docblock above), the static
  // fallback markup already in the HTML simply stays on screen.
  fetch(DATA_URL)
    .then(function (res) { return res.json(); })
    .then(function (data) { init(data.posts || []); })
    .catch(function (err) {
      console.error('Could not load blog posts from data/posts.json:', err);
    });
})();
