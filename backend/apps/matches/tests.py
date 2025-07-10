from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from apps.competition.models import Tournament, Stage
from apps.clubs.models import Team
from apps.infrastructure.models import Venue
from apps.officials.models import Referee
from .models import Match, MatchEvent

class MatchModelTest(TestCase):
    def setUp(self):
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            season_year=2024,
            start_date="2024-01-01",
            end_date="2024-12-31"
        )
        self.stage = Stage.objects.create(
            name="Test Stage",
            tournament=self.tournament,
            order=1,
            start_date="2024-01-01",
            end_date="2024-06-30"
        )
        self.team1 = Team.objects.create(
            name="Team 1",
            coach_name="Coach 1",
            founded=2000
        )
        self.team2 = Team.objects.create(
            name="Team 2",
            coach_name="Coach 2",
            founded=2001
        )
        self.venue = Venue.objects.create(
            name="Test Venue",
            address="Test Address",
            city="Test City",
            capacity=100
        )

    def test_match_creation(self):
        match = Match.objects.create(
            datetime="2024-01-15 18:00:00",
            team_home=self.team1,
            team_away=self.team2,
            venue=self.venue,
            stage=self.stage
        )
        self.assertEqual(str(match), f"{self.team1.name} vs {self.team2.name} - 15/01/2024 18:00")

class MatchAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create test data
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            season_year=2024,
            start_date="2024-01-01",
            end_date="2024-12-31"
        )
        self.stage = Stage.objects.create(
            name="Test Stage",
            tournament=self.tournament,
            order=1,
            start_date="2024-01-01",
            end_date="2024-06-30"
        )

    def test_get_matches(self):
        url = reverse('match-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
