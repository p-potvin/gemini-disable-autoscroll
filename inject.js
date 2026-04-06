// injected into the page's main world to override scroll methods

(function () {
  const scriptTag = document.getElementById("gsc-inject");
  if (!scriptTag) return;

  let enabled;
  try {
    enabled = JSON.parse(scriptTag.dataset.enabled);
  } catch {
    return;
  }

  // save originals
  if (!window.__gscOriginals) {
    window.__gscOriginals = {
      scrollIntoView: Element.prototype.scrollIntoView,
      scrollTo_win: window.scrollTo,
      scroll_el: Element.prototype.scroll,
      scrollTo_el: Element.prototype.scrollTo,
      scroll_win: window.scroll,
    };
  }

  const orig = window.__gscOriginals;

  if (enabled) {
    Element.prototype.scrollIntoView = function () {};
    Element.prototype.scroll = function () {};
    Element.prototype.scrollTo = function () {};
    window.scrollTo = function () {};
    window.scroll = function () {};
  } else {
    Element.prototype.scrollIntoView = orig.scrollIntoView;
    Element.prototype.scroll = orig.scroll_el;
    Element.prototype.scrollTo = orig.scrollTo_el;
    window.scrollTo = orig.scrollTo_win;
    window.scroll = orig.scroll_win;
  }

  // scroll to bottom button
  const BTN_ID = "gsc-scroll-btn";

  if (!enabled) {
    const existing = document.getElementById(BTN_ID);
    if (existing) existing.remove();
    return;
  }

  const btn = document.createElement("button");
  btn.id = BTN_ID;
  btn.textContent = "🡻"; // taken from https://emojidb.org/down-arrow-emojis
  btn.title = "Scroll to bottom";

  Object.assign(btn.style, {
    position: "fixed",
    bottom: "90px",
    right: "24px",
    zIndex: "99999",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "#001b87",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s",
    opacity: "0.8",
  });

  btn.addEventListener("mouseenter", () => {
    btn.style.opacity = "0.5";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.opacity = "0.8";
  });
  btn.addEventListener("click", () => {
    const scroller = document.querySelector(
      '[data-test-id="chat-history-container"]',
    );
    if (scroller) {
      orig.scroll_el.call(scroller, {
        top: scroller.scrollHeight,
        behavior: "smooth",
      });
    } else {
      orig.scrollTo_win.call(window, {
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  });

  document.body.appendChild(btn);
})();
