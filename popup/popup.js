function init() {
  chrome.storage.local.get((state) => {
    const el = document.getElementById("enabled");
    el.checked = state.enabled;

    el.addEventListener("change", () => {
      chrome.storage.local.set({ enabled: el.checked });
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
