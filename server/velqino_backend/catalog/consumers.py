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

            # Send connection ack
            await self.send(text_data=json.dumps({
                'type': 'connected',
                'task_id': self.task_id,
                'status': 'listening'
            }))

        except Exception as e:
            print("[ERR] CONNECT ERROR:", str(e))

    async def disconnect(self, close_code):
        try:
            group_name = getattr(self, 'group_name', None)
            print(f"[WS] WebSocket DISCONNECT: {group_name} (code: {close_code})")

            # * Leave group
            if group_name:
                await self.channel_layer.group_discard(
                    group_name,
                    self.channel_name
                )

        except Exception as e:
            print("[ERR] DISCONNECT ERROR:", str(e))

    async def receive(self, text_data=None, bytes_data=None):
        """Handle client keep-alive pings"""
        try:
            if text_data:
                data = json.loads(text_data)
                if data.get('type') == 'ping':
                    await self.send(text_data=json.dumps({'type': 'pong'}))
        except Exception:
            pass

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