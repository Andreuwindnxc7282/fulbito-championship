from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import (
    CustomTokenObtainPairView, UserMeView, TopScorersView,
    UserViewSet, TournamentViewSet, StageViewSet, TeamViewSet,
    PlayerViewSet, VenueViewSet, RefereeViewSet, MatchViewSet,
    MatchEventViewSet, StandingViewSet, DashboardStatsView,
    public_standings, public_schedule, test_endpoint
)

# Router para los ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tournaments', TournamentViewSet)
router.register(r'stages', StageViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'players', PlayerViewSet)
router.register(r'venues', VenueViewSet)
router.register(r'referees', RefereeViewSet)
router.register(r'matches', MatchViewSet)
router.register(r'match-events', MatchEventViewSet)
router.register(r'standings', StandingViewSet)

urlpatterns = [
    # Rutas del router (CRUD completo)
    path('', include(router.urls)),
    
    # Autenticación JWT
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', UserMeView.as_view(), name='user_me'),
    
    # Rutas adicionales
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard/top-scorers/', TopScorersView.as_view(), name='top-scorers'),
    
    # ENDPOINTS PÚBLICOS REQUERIDOS
    path('test/', test_endpoint, name='test-endpoint'),
    path('public/standings/<int:tournament_id>/', public_standings, name='public-standings'),
    path('public/schedule/<int:stage_id>/', public_schedule, name='public-schedule'),
]
