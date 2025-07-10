from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import StandingEntry
from apps.competition.models import Tournament, Stage, Group
from apps.clubs.models import Team

class StandingEntryModelTest(TestCase):
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
        self.team = Team.objects.create(
            name="Test Team",
            coach_name="Test Coach",
            founded=2020
        )
        self.standing = StandingEntry.objects.create(
            team=self.team,
            group=self.group,
            matches_played=10,
            wins=6,
            draws=2,
            losses=2,
            goals_for=20,
            goals_against=10
        )

    def test_standing_creation(self):
        self.assertEqual(self.standing.team, self.team)
        self.assertEqual(self.standing.group, self.group)
        self.assertEqual(self.standing.matches_played, 10)
        self.assertEqual(self.standing.wins, 6)

    def test_points_calculation(self):
        expected_points = (6 * 3) + (2 * 1)  # 6 wins * 3 + 2 draws * 1
        self.assertEqual(self.standing.points, expected_points)

    def test_goal_difference_calculation(self):
        expected_goal_diff = 20 - 10
        self.assertEqual(self.standing.goal_difference, expected_goal_diff)

    def test_standing_str_representation(self):
        self.assertEqual(str(self.standing), "Test Team - Group A")

class StandingAPITest(APITestCase):
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
        self.team = Team.objects.create(
            name="Test Team",
            coach_name="Test Coach",
            founded=2020
        )
        self.standing = StandingEntry.objects.create(
            team=self.team,
            group=self.group,
            matches_played=10,
            wins=6,
            draws=2,
            losses=2,
            goals_for=20,
            goals_against=10
        )

    def test_get_standings_public(self):
        url = reverse('public-standings', kwargs={'tournament_id': self.tournament.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_standings_authorized(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        url = reverse('standingentry-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
