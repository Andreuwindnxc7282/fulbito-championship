from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.clubs.models import Team, Player
from apps.infrastructure.models import Venue
from apps.officials.models import Referee
from apps.competition.models import Stage

class Match(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Programado'),
        ('live', 'En Vivo'),
        ('finished', 'Finalizado'),
        ('suspended', 'Suspendido'),
        ('cancelled', 'Cancelado'),
    ]

    datetime = models.DateTimeField(verbose_name="Fecha y Hora")
    team_home = models.ForeignKey(
        Team, 
        on_delete=models.CASCADE, 
        related_name='home_matches',
        verbose_name="Equipo Local"
    )
    team_away = models.ForeignKey(
        Team, 
        on_delete=models.CASCADE, 
        related_name='away_matches',
        verbose_name="Equipo Visitante"
    )
    venue = models.ForeignKey(
        Venue, 
        on_delete=models.CASCADE, 
        related_name='matches',
        verbose_name="Cancha"
    )
    referee = models.ForeignKey(
        Referee, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='matches',
        verbose_name="Árbitro"
    )
    stage = models.ForeignKey(
        Stage, 
        on_delete=models.CASCADE, 
        related_name='matches',
        verbose_name="Fase"
    )
    home_score = models.PositiveIntegerField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(0)],
        verbose_name="Goles Local"
    )
    away_score = models.PositiveIntegerField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(0)],
        verbose_name="Goles Visitante"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='scheduled',
        verbose_name="Estado"
    )
    match_duration = models.PositiveIntegerField(
        default=90, 
        verbose_name="Duración (minutos)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Partido"
        verbose_name_plural = "Partidos"
        ordering = ['-datetime']

    def __str__(self):
        return f"{self.team_home.name} vs {self.team_away.name} - {self.datetime.strftime('%d/%m/%Y %H:%M')}"

    @property
    def is_finished(self):
        return self.status == 'finished'

    @property
    def result(self):
        if self.home_score is not None and self.away_score is not None:
            return f"{self.home_score} - {self.away_score}"
        return "Sin resultado"

class MatchEvent(models.Model):
    EVENT_CHOICES = [
        ('goal', 'Gol'),
        ('yellow_card', 'Tarjeta Amarilla'),
        ('red_card', 'Tarjeta Roja'),
        ('substitution', 'Sustitución'),
        ('penalty', 'Penal'),
        ('own_goal', 'Autogol'),
    ]

    match = models.ForeignKey(
        Match, 
        on_delete=models.CASCADE, 
        related_name='events',
        verbose_name="Partido"
    )
    player = models.ForeignKey(
        Player, 
        on_delete=models.CASCADE, 
        related_name='match_events',
        verbose_name="Jugador"
    )
    minute = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(120)],
        verbose_name="Minuto"
    )
    event_type = models.CharField(
        max_length=20, 
        choices=EVENT_CHOICES,
        verbose_name="Tipo de Evento"
    )
    description = models.TextField(blank=True, verbose_name="Descripción")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Evento del Partido"
        verbose_name_plural = "Eventos del Partido"
        ordering = ['match', 'minute']

    def __str__(self):
        return f"{self.match} - {self.get_event_type_display()} - Min {self.minute}"
