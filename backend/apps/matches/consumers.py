import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Match, MatchEvent
from django.utils import timezone

class MatchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.match_id = self.scope['url_route']['kwargs']['match_id']
        self.match_group_name = f'match_{self.match_id}'

        # Join match group
        await self.channel_layer.group_add(
            self.match_group_name,
            self.channel_name
        )

        await self.accept()
        
        # Send initial match data
        match_data = await self.get_match_data()
        await self.send(text_data=json.dumps(match_data))

    async def disconnect(self, close_code):
        # Leave match group
        await self.channel_layer.group_discard(
            self.match_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Receive message from WebSocket.
        Only staff users can update match data.
        """
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')
        
        if action == 'update_score':
            # Check if user is staff (would require authentication)
            home_score = text_data_json.get('home_score')
            away_score = text_data_json.get('away_score')
            
            # Update match score
            await self.update_match_score(home_score, away_score)
            
            # Send updated data to group
            match_data = await self.get_match_data()
            await self.channel_layer.group_send(
                self.match_group_name,
                {
                    'type': 'match_update',
                    'data': match_data
                }
            )
        
        elif action == 'add_event':
            # Add new match event
            event_type = text_data_json.get('event_type')
            player_id = text_data_json.get('player_id')
            minute = text_data_json.get('minute')
            description = text_data_json.get('description', '')
            
            await self.add_match_event(event_type, player_id, minute, description)
            
            # Send updated data to group
            match_data = await self.get_match_data()
            await self.channel_layer.group_send(
                self.match_group_name,
                {
                    'type': 'match_update',
                    'data': match_data
                }
            )
        
        elif action == 'change_status':
            # Change match status
            status = text_data_json.get('status')
            await self.update_match_status(status)
            
            # Send updated data to group
            match_data = await self.get_match_data()
            await self.channel_layer.group_send(
                self.match_group_name,
                {
                    'type': 'match_update',
                    'data': match_data
                }
            )

    async def match_update(self, event):
        """
        Receive message from match group and send to WebSocket
        """
        data = event['data']
        await self.send(text_data=json.dumps(data))

    @database_sync_to_async
    def get_match_data(self):
        """Get match data including events"""
        try:
            match = Match.objects.get(id=self.match_id)
            events = MatchEvent.objects.filter(match=match).order_by('minute')
            
            events_data = []
            for event in events:
                events_data.append({
                    'id': event.id,
                    'player_name': f"{event.player.first_name} {event.player.last_name}",
                    'team_name': event.player.team.name,
                    'minute': event.minute,
                    'event_type': event.get_event_type_display(),
                    'description': event.description
                })
            
            return {
                'id': match.id,
                'home_team': match.team_home.name,
                'away_team': match.team_away.name,
                'home_score': match.home_score,
                'away_score': match.away_score,
                'status': match.status,
                'venue': match.venue.name,
                'datetime': match.datetime.isoformat(),
                'referee': match.referee.full_name if match.referee else None,
                'events': events_data,
                'last_updated': timezone.now().isoformat()
            }
        except Match.DoesNotExist:
            return {'error': 'Match not found'}

    @database_sync_to_async
    def update_match_score(self, home_score, away_score):
        """Update match score"""
        try:
            match = Match.objects.get(id=self.match_id)
            match.home_score = home_score
            match.away_score = away_score
            match.save()
            return True
        except Match.DoesNotExist:
            return False

    @database_sync_to_async
    def add_match_event(self, event_type, player_id, minute, description):
        """Add new match event"""
        from apps.clubs.models import Player
        
        try:
            match = Match.objects.get(id=self.match_id)
            player = Player.objects.get(id=player_id)
            
            MatchEvent.objects.create(
                match=match,
                player=player,
                minute=minute,
                event_type=event_type,
                description=description
            )
            return True
        except (Match.DoesNotExist, Player.DoesNotExist):
            return False

    @database_sync_to_async
    def update_match_status(self, status):
        """Update match status"""
        try:
            match = Match.objects.get(id=self.match_id)
            match.status = status
            match.save()
            
            # If match is finished, update standings
            if status == 'finished':
                from apps.statistics.models import Standing
                
                tournament = match.stage.tournament
                
                # Get or create standings for both teams
                home_standing, _ = Standing.objects.get_or_create(
                    team=match.team_home,
                    tournament=tournament
                )
                away_standing, _ = Standing.objects.get_or_create(
                    team=match.team_away,
                    tournament=tournament
                )
                
                # Update statistics
                home_standing.update_stats()
                away_standing.update_stats()
            
            return True
        except Match.DoesNotExist:
            return False
