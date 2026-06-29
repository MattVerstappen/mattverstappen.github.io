/**
 * mdr-icons.js
 * Custom inline-SVG icon set for matthewderekrall.com.
 *
 * Every icon is drawn on a 24x24 grid: stroke-width 1.7, round caps/joins,
 * fill none, stroke currentColor (so colour is controlled by CSS `color`).
 *
 * Usage:
 *   mdrIcon('trophy')        -> SVG string at 24px
 *   mdrIcon('trophy', 40)    -> SVG string at 40px
 *
 * Or declaratively in HTML (auto-hydrated on DOMContentLoaded):
 *   <span data-mdr-icon="trophy" data-mdr-size="28"></span>
 */
(function (global) {
  var W = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  var E = '</svg>';

  var MDR_ICONS = {
    // < / >  code tag
    code: W + '<polyline points="8 7 3 12 8 17"/><polyline points="16 7 21 12 16 17"/><line x1="13.5" y1="5" x2="10.5" y2="19"/>' + E,

    // controller body with d-pad (left) and two buttons (right)
    gamepad: W + '<rect x="2.5" y="8" width="19" height="9.5" rx="4"/><line x1="7" y1="11" x2="7" y2="14"/><line x1="5.5" y1="12.5" x2="8.5" y2="12.5"/><circle cx="15.6" cy="11.8" r="1"/><circle cx="17.9" cy="13.9" r="1"/>' + E,

    // wrench / tool
    tools: W + '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' + E,

    // 4-point sparkle
    spark: W + '<path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/>' + E,

    // trophy cup with two handles + base
    trophy: W + '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5H4.5a2.5 2.5 0 0 0 2.6 4"/><path d="M17 5h2.5a2.5 2.5 0 0 1-2.6 4"/><line x1="12" y1="14" x2="12" y2="17"/><path d="M8.5 20l.7-3h5.6l.7 3z"/>' + E,

    // medal: ribbon + disc + small star
    medal: W + '<path d="M8.5 3l2.2 5.5"/><path d="M15.5 3l-2.2 5.5"/><circle cx="12" cy="14.5" r="5.5"/><path d="M12 11.9l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2z"/>' + E,

    // document with text lines
    paper: W + '<path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z"/><polyline points="14 3 14 8 19 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="16.5" x2="15" y2="16.5"/>' + E,

    // newspaper / press
    press: W + '<path d="M4 6.5h12.5v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M16.5 9H19a1 1 0 0 1 1 1v8.5a2 2 0 0 1-2 2"/><line x1="7" y1="10" x2="13.5" y2="10"/><line x1="7" y1="13" x2="13.5" y2="13"/><line x1="7" y1="16" x2="11" y2="16"/>' + E,

    // playing card with diamond pip
    card: W + '<rect x="5.5" y="3" width="13" height="18" rx="2"/><path d="M12 8.5l2.2 3-2.2 3-2.2-3z"/>' + E,

    // map pin
    pin: W + '<path d="M12 21s6.5-5.8 6.5-10.5a6.5 6.5 0 0 0-13 0C5.5 15.2 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.3"/>' + E,

    // simplified globe
    globe: W + '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><ellipse cx="12" cy="12" rx="4" ry="9"/>' + E,

    'arrow-right': W + '<line x1="4" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>' + E,

    'arrow-down': W + '<line x1="12" y1="4" x2="12" y2="19"/><polyline points="6 13 12 19 18 13"/>' + E
  };

  function mdrIcon(name, size) {
    if (size === undefined) size = 24;
    var svg = MDR_ICONS[name];
    if (!svg) return '';
    return svg.replace('width="24"', 'width="' + size + '"').replace('height="24"', 'height="' + size + '"');
  }

  // Hydrate any <element data-mdr-icon="name" data-mdr-size="28"> in the DOM.
  function hydrateIcons(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-mdr-icon]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var size = parseInt(el.getAttribute('data-mdr-size') || '24', 10);
      el.innerHTML = mdrIcon(el.getAttribute('data-mdr-icon'), size);
    }
  }

  // Expose globally for inline use (projects.js, etc.)
  global.MDR_ICONS = MDR_ICONS;
  global.mdrIcon = mdrIcon;
  global.hydrateIcons = hydrateIcons;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { hydrateIcons(); });
    } else {
      hydrateIcons();
    }
  }

  if (typeof module !== 'undefined') module.exports = { mdrIcon: mdrIcon, MDR_ICONS: MDR_ICONS, hydrateIcons: hydrateIcons };
})(typeof window !== 'undefined' ? window : this);
