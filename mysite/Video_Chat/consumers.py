from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'test-Room'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        print('Disconnect!')
        
    async def receive(self, text_data):
        receive_dict = json.loads(text_data)
        message = receive_dict['message']
        action = receive_dict['action']
        
        if action in ['new-offer', 'new-answer']:
            receiver_channel_name = message.get('receiver_channel_name', None)
    
            if receiver_channel_name:
                message['receiver_channel_name'] = self.channel_name
                
                await self.channel_layer.send(
                    receiver_channel_name,
                    {
                        'type': 'send.sdp',
                        'receive_dict': receive_dict
                    }
                )
            
            return
        
        message['receiver_channel_name'] = self.channel_name
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send.sdp',
                'receive_dict': receive_dict
            }
        )
        
    async def send_sdp(self, event):
        receive_dict = event['receive_dict']

        await self.send(text_data=json.dumps(receive_dict))
