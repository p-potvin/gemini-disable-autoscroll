// content script that runs in isolated world

// reads enabled state from storage and injects the scroll-blocking script
// into the page's main world so it can override Element.prototype methods

function injectBlocker(enabled) {
  // if there's a previous version, remove it
  const old = document.getElementById("gsc-inject");
  if (old) old.remove();

  const script = document.createElement("script");
  script.id = "gsc-inject";
  script.dataset.enabled = JSON.stringify(enabled);
  script.src = chrome.runtime.getURL("inject.js");
  (document.head || document.documentElement).appendChild(script);
}

function applySettings(state) {
  injectBlocker(state.enabled);
}

// init
chrome.storage.local.get(applySettings);

// changes from storage
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    applySettings({ enabled: changes.enabled.newValue });
  }
});
