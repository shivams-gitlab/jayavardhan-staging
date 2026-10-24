/**
 * js/horoscope.js
 * ----------------------------------------------------------------------
 * Powers the Monthly Horoscope page (horoscope.html).
 *
 * What it does:
 *   1. Fetches data/horoscope.json (the file Decap CMS edits at /admin).
 *   2. Sorts the 27 nakshatras by their "order" field (1–27), just in
 *      case they're ever saved out of order in the CMS.
 *   3. Builds the "Find Your Nakshatra" quick-jump button row.
 *   4. Builds the full list of nakshatra prediction cards.
 *   5. Replaces the page's static fallback HTML with this fresh content.
 *
 * Why there's static fallback HTML already sitting in horoscope.html:
 *   fetch() cannot load a local JSON file when the page is opened directly
 *   from disk (file://...) — browsers block this for security reasons.
 *   It works fine once the site is served over http(s), which includes
 *   local dev servers (e.g. `npx serve`) and any real deployment.
 *   Rather than show a blank page in the file:// case, horoscope.html
 *   ships with the current nakshatra data already written out by hand.
 *   This script simply overwrites that fallback the moment the fetch
 *   succeeds, so visitors on a real server never see stale content and
 *   visitors opening the file locally still see *something* correct
 *   (just not live-editable until served properly).
 * ----------------------------------------------------------------------
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    fetch('data/horoscope.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var jumpGrid = document.getElementById('nak-jump-grid');
        var list = document.getElementById('nak-list');
        var updated = document.getElementById('nak-updated');

        // Top banner: "Showing predictions for <Month Year>..."
        if (updated) {
          updated.innerHTML = 'Showing predictions for <strong>' + data.month_label +
            '</strong>. Date ranges below are placeholders — replace with the real nakshatra transit dates from your panchang/ephemeris each month.';
        }

        // Defensive sort: CMS list order should already be 1–27, but don't
        // rely on file order — sort explicitly by the "order" field.
        var sorted = data.nakshatras.slice().sort(function (a, b) { return a.order - b.order; });

        // "Find Your Nakshatra" pill buttons — one per nakshatra, each an
        // anchor link (#nak-<slug>) that jumps straight to its card below.
        // CSS gives .nak-row a scroll-margin-top so the sticky header
        // doesn't cover the target when the browser jumps to it.
        if (jumpGrid) {
          jumpGrid.innerHTML = sorted.map(function (n) {
            return '<a href="#nak-' + n.slug + '" class="nak-jump-btn">' + n.order + '. ' + n.name + '</a>';
          }).join('');
        }

        // Full nakshatra list: name + ruling planet chip, then a prominent
        // date-range line, then the 2–3 line prediction paragraph.
        if (list) {
          list.innerHTML = sorted.map(function (n) {
            return (
              '<div class="nak-row" id="nak-' + n.slug + '">' +
                '<div class="nak-row-head">' +
                  '<h3>' + n.order + '. ' + n.name + ' <span class="nak-ruler">' + n.ruler + '</span></h3>' +
                '</div>' +
                '<div class="nak-dates">' + n.date_range + '</div>' +
                '<p>' + n.prediction + '</p>' +
              '</div>'
            );
          }).join('');
        }
      })
      .catch(function (err) {
        // Fetch failed — most likely opened as a local file (see comment
        // above). The static fallback already in the HTML stays visible,
        // so this is just a console note for whoever's debugging, not a
        // user-facing error.
        console.error('Could not load horoscope data (this page needs to be served over http(s):// — try a local server or view it after deploying):', err);
      });
  });
})();
