// service worker that manages badge of current state

function updateBadge(enabled) {
  chrome.action.setBadgeText({ text: enabled ? "ON" : "OFF" });
  chrome.action.setBadgeBackgroundColor({
    color: enabled ? "#4a6cf7" : "#555",
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get({ enabled: true }, (state) => {
    chrome.storage.local.set(state);
    updateBadge(state.enabled);
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    updateBadge(changes.enabled.newValue);
  }
});

chrome.storage.local.get({ enabled: true }, (state) => {
  updateBadge(state.enabled);
});
