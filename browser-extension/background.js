chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startCapture") {
        // Open dashboard tab first
        chrome.tabs.create({ url: "http://localhost:8000/web-ui" }, (dashboardTab) => {
            // Then start capture
            chrome.tabCapture.capture({ video: true }, (stream) => {
                const processor = new MediaProcessor(stream, dashboardTab.id);
                processor.start();
            });
        });
    }
});
  
  class MediaProcessor {
    constructor(stream) {
      this.stream = stream;
      this.interval = null;
      this.video = document.createElement('video');
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  
    start() {
      this.video.srcObject = this.stream;
      this.video.play();
      
      this.interval = setInterval(() => {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.ctx.drawImage(this.video, 0, 0);
        
        this.canvas.toBlob(blob => {
          blob.arrayBuffer().then(buffer => {
            chrome.runtime.sendMessage({
              action: "streamData",
              frame: buffer
            });
          });
        }, 'image/jpeg', 0.8);
      }, 200); // 5 FPS
    }
  }