from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Tournament, Stage, Group
from apps.clubs.models import Team

class TournamentModelTest(TestCase):
    def setUp(self):
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            season_year=2024,
            start_date="2024-01-01",
            end_date="2024-12-31"
        )

    def test_tournament_creation(self):
        self.assertEqual(self.tournament.name, "Test Tournament")
        self.assertEqual(self.tournament.season_year, 2024)
        self.assertTrue(self.tournament.is_active)

    def test_tournament_str_representation(self):
        self.assertEqual(str(self.tournament), "Test Tournament (2024)")

class StageModelTest(TestCase):
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

    def test_stage_creation(self):
        self.assertEqual(self.stage.name, "Test Stage")
        self.assertEqual(self.stage.tournament, self.tournament)
        self.assertEqual(self.stage.order, 1)

    def test_stage_str_representation(self):
        self.assertEqual(str(self.stage), "Test Stage - Test Tournament (2024)")

class GroupModelTest(TestCase):
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
        self.group = Group.objects.create(
            name="Group A",
            stage=self.stage
        )

    def test_group_creation(self):
        self.assertEqual(self.group.name, "Group A")
        self.assertEqual(self.group.stage, self.stage)

    def test_group_str_representation(self):
        self.assertEqual(str(self.group), "Group A - Test Stage")

class TournamentAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            season_year=2024,
            start_date="2024-01-01",
            end_date="2024-12-31"
        )

    def test_get_tournaments_unauthorized(self):
        url = reverse('tournament-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_tournaments_authorized(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = reverse('tournament-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_tournament(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = reverse('tournament-list')
        data = {
            'name': 'New Tournament',
            'season_year': 2025,
            'start_date': '2025-01-01',
            'end_date': '2025-12-31'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tournament.objects.count(), 2)
