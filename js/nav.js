/**
 * js/nav.js
 * ----------------------------------------------------------------------
 * Included on every page. Handles the mobile hamburger menu only —
 * on desktop widths the nav links are always visible (see the
 * @media (max-width: 820px) rules in css/style.css) and this script
 * has nothing to do.
 *
 * How it works:
 *   - .nav-toggle is the hamburger button (☰), only shown below 820px.
 *   - .nav-links is the <ul> of nav links, hidden by default below 820px.
 *   - Clicking the button toggles an "is-open" class on .nav-links,
 *     which the CSS uses to show/hide the mobile menu as a dropdown.
 *   - aria-expanded is kept in sync for screen readers.
 * ----------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  // Guard: if a page is ever missing the nav markup, don't throw.
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    links.classList.toggle('is-open');
    var expanded = links.classList.contains('is-open');
    toggle.setAttribute('aria-expanded', expanded);
  });
});
