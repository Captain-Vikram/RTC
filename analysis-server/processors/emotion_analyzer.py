from deepface import DeepFace
import cv2

class EmotionAnalyzer:
    def process(self, frame):
        try:
            analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            emotion = analysis[0]['dominant_emotion']
            return self.add_overlay(frame, emotion)
        except Exception as e:
            print(f"Analysis error: {e}")
            return frame

    def add_overlay(self, frame, emotion):
        cv2.putText(frame, f"Emotion: {emotion}", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        return frame
