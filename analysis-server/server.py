import asyncio
import websockets
import cv2
import numpy as np
from processors.emotion_analyzer import EmotionAnalyzer
from processors.video_recorder import VideoRecorder

class AnalysisServer:
    def __init__(self):
        self.analyzer = EmotionAnalyzer()
        self.recorder = VideoRecorder()
        self.active_connections = set()

    async def handle_connection(self, websocket, path):
        if path == '/processor':
            async for message in websocket:
                if message == 'STOP_CAPTURE':
                    self.recorder.release()
                    await self.broadcast('CAPTURE_STOPPED')
                else:
                    frame = cv2.imdecode(np.frombuffer(message, np.uint8), cv2.IMREAD_COLOR)
                    analyzed_frame = self.analyzer.process(frame)
                    self.recorder.record(analyzed_frame)
                    
                    # Send back to browser extension
                    _, jpeg = cv2.imencode('.jpg', analyzed_frame)
                    await websocket.send(jpeg.tobytes())

        elif path == '/dashboard':
            self.active_connections.add(websocket)
            try:
                await websocket.wait_closed()
            finally:
                self.active_connections.remove(websocket)

    async def broadcast(self, message):
        if self.active_connections:
            await asyncio.gather(*[
                client.send(message) 
                for client in self.active_connections
            ])

async def main():
    server = AnalysisServer()
    async with websockets.serve(server.handle_connection, "localhost", 8765):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
