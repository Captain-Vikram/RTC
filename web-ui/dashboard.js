class Dashboard {
    constructor() {
        this.ws = null;
        this.preview = document.getElementById('preview');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        
        // Initialize WebSocket connection
        this.initializeConnection();
        
        // Set up button handlers
        this.startBtn.addEventListener('click', () => this.startCapture());
        this.stopBtn.addEventListener('click', () => this.stopCapture());
    }

    initializeConnection() {
        this.ws = new WebSocket('ws://localhost:8765/dashboard');
        
        this.ws.onopen = () => {
            this.startBtn.disabled = false;
            console.log('Connected to analysis server');
        };

        this.ws.onmessage = (event) => {
            if (event.data === 'CAPTURE_STOPPED') {
                this.handleCaptureStop();
                return;
            }
            
            this.preview.style.display = 'block';
            const blob = new Blob([event.data], { type: 'image/jpeg' });
            this.preview.src = URL.createObjectURL(blob);
        };
    }

    startCapture() {
        this.ws.send('START_CAPTURE');
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
    }

    stopCapture() {
        this.ws.send('STOP_CAPTURE');
    }

    handleCaptureStop() {
        this.preview.style.display = 'none';
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        URL.revokeObjectURL(this.preview.src);
    }
}

// Initialize dashboard when page loads
window.addEventListener('load', () => new Dashboard());
