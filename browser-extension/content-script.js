class FrameSender {
    constructor() {
      this.ws = new WebSocket("ws://localhost:8765/processor");
      this.interval = 5; // Send every 5th frame
      this.frameCounter = 0;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  
    async startCapture(streamId) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: 'tab',
              chromeMediaSourceId: streamId
            }
          }
        });
  
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
  
        video.addEventListener('playing', () => {
          this.canvas.width = video.videoWidth;
          this.canvas.height = video.videoHeight;
          this.captureFrame(video);
        });
      } catch (error) {
        console.error("Capture error:", error);
      }
    }
  
    captureFrame(video) {
      if (video.paused || video.ended) return;
      
      this.ctx.drawImage(video, 0, 0);
      if (this.frameCounter++ % this.interval === 0) {
        this.canvas.toBlob(blob => {
          const reader = new FileReader();
          reader.onload = () => this.ws.send(reader.result);
          reader.readAsArrayBuffer(blob);
        }, 'image/jpeg', 0.8);
      }
      
      requestAnimationFrame(() => this.captureFrame(video));
    }
  }
  
  // Initialize when message received
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "initCapture") {
      new FrameSender().startCapture(message.streamId);
    }
  });
  