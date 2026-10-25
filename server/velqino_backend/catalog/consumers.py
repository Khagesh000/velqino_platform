from channels.generic.websocket import AsyncWebsocketConsumer
import json


class AIProgressConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        try:
            # * Get task_id from URL
            self.task_id = self.scope['url_route']['kwargs']['task_id']
            self.group_name = f'ai_task_{self.task_id}'

            print(f"[WS] WebSocket CONNECT: {self.group_name}")

            # * Join group
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )

            # * Accept connection
            await self.accept()

        except Exception as e:
            print("[ERR] CONNECT ERROR:", str(e))

    async def disconnect(self, close_code):
        try:
            print(f"[ERR] WebSocket DISCONNECT: {self.group_name}")

            # * Leave group
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

        except Exception as e:
            print("[ERR] DISCONNECT ERROR:", str(e))

    # [OK] THIS IS YOUR OLD METHOD (KEEP IT)
    async def send_progress(self, event):
        print("[SIGNAL] send_progress event:", event)

        progress = event.get('data', {}).get('progress', 0)
        message = event.get('data', {}).get('message', '')

        await self.send(text_data=json.dumps({
            'type': 'send_progress',
            'progress': progress,
            'message': message
        }))

        # [OK] Send ai_complete when 100%
        if progress == 100:
            await self.send(text_data=json.dumps({
                'type': 'ai_complete',
                'progress': 100,
                'message': 'Completed!'
            }))

    # [OK] THIS IS THE FIX (VERY IMPORTANT)
    async def ai_progress(self, event):
        print("[SIGNAL] ai_progress event:", event)

        await self.send(text_data=json.dumps({
            'type': 'ai_progress',
            'progress': event.get('data', {}).get('progress', 0),
            'message': event.get('data', {}).get('message', '')
        }))