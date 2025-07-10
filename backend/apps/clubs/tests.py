from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Team, Player

class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name="Test Team",
            coach_name="Test Coach",
            founded=2020
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, "Test Team")
        self.assertEqual(self.team.coach_name, "Test Coach")
        self.assertEqual(self.team.founded, 2020)
        self.assertTrue(self.team.is_active)

    def test_team_str_representation(self):
        self.assertEqual(str(self.team), "Test Team")

class PlayerModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name="Test Team",
            coach_name="Test Coach",
            founded=2020
        )
        self.player = Player.objects.create(
            name="Test Player",
            position="Forward",
            jersey_number=10,
            date_of_birth="1995-01-01",
            team=self.team
        )

    def test_player_creation(self):
        self.assertEqual(self.player.name, "Test Player")
        self.assertEqual(self.player.position, "Forward")
        self.assertEqual(self.player.jersey_number, 10)
        self.assertEqual(self.player.team, self.team)

    def test_player_str_representation(self):
        self.assertEqual(str(self.player), "Test Player (#10)")

class TeamAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        self.team = Team.objects.create(
            name="Test Team",
            coach_name="Test Coach",
            founded=2020
        )

    def test_get_teams_unauthorized(self):
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_teams_authorized(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_team(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = reverse('team-list')
        data = {
            'name': 'New Team',
            'coach_name': 'New Coach',
            'founded': 2023
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 2)

class PlayerAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        self.team = Team.objects.create(
            name="Test Team",
            coach_name="Test Coach",
            founded=2020
        )
        self.player = Player.objects.create(
            name="Test Player",
            position="Forward",
            jersey_number=10,
            date_of_birth="1995-01-01",
            team=self.team
        )

    def test_get_players_authorized(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = reverse('player-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_player(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = reverse('player-list')
        data = {
            'name': 'New Player',
            'position': 'Midfielder',
            'jersey_number': 7,
            'date_of_birth': '1996-01-01',
            'team': self.team.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Player.objects.count(), 2)
