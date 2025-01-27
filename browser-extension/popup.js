document.getElementById('startCapture').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "startCapture" });
});