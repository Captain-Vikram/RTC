chrome.runtime.onMessage.addListener((message) => {
    if (message.action !== "streamData") return;
  
    const video = document.getElementById('preview');
    const blob = new Blob([message.frame], { type: 'image/jpeg' });
    video.src = URL.createObjectURL(blob);
  });
  