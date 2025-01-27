import cv2
import datetime

class VideoRecorder:
    def __init__(self):
        self.writer = None
        self.is_recording = False
    
    def record(self, frame):
        if self.writer is None:
            self.initialize_writer(frame)
        self.writer.write(frame)
    
        self.is_recording = True

    def initialize_writer(self, frame):
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        self.writer = cv2.VideoWriter(
            f"output_{timestamp}.mp4",
            cv2.VideoWriter_fourcc(*'mp4v'),
            20.0,
            (frame.shape[1], frame.shape[0])
        )
    
    def release(self):
        if self.writer:
            self.writer.release()