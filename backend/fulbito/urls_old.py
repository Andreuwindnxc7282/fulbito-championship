from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from apps.matches.views import PublicStandingsView, PublicScheduleView

# Schema view for API documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Fulbito Championship API",
        default_version='v1',
        description="API para la gestión de campeonatos de fulbito",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@fulbito.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'tournaments', TournamentViewSet)
router.register(r'stages', StageViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'players', PlayerViewSet)
router.register(r'venues', VenueViewSet)
router.register(r'matches', MatchViewSet)
router.register(r'match-events', MatchEventViewSet)
router.register(r'referees', RefereeViewSet)
router.register(r'standings', StandingViewSet)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Authentication
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API Routes
    path('api/', include(router.urls)),
    path('api/', include('apps.api.urls')),
    
    # Public endpoints
    path('api/public/standings/<int:tournament_id>/', PublicStandingsView.as_view(), name='public-standings'),
    path('api/public/schedule/<int:stage_id>/', PublicScheduleView.as_view(), name='public-schedule'),
    
    # API Auth (for browsable API)
    path('api-auth/', include('rest_framework.urls')),
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
