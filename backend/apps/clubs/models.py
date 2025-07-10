from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.competition.models import Group

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Nombre del Equipo")
    logo = models.ImageField(upload_to='team_logos/', blank=True, null=True, verbose_name="Logo")
    coach_name = models.CharField(max_length=100, verbose_name="Nombre del Entrenador")
    founded = models.PositiveIntegerField(
        validators=[MinValueValidator(1800), MaxValueValidator(2025)],
        verbose_name="Año de Fundación"
    )
    description = models.TextField(blank=True, verbose_name="Descripción")
    group = models.ForeignKey(
        Group, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='teams',
        verbose_name="Grupo"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Equipo"
        verbose_name_plural = "Equipos"
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def total_players(self):
        return self.players.filter(is_active=True).count()

class Player(models.Model):
    POSITION_CHOICES = [
        ('GK', 'Portero'),
        ('DEF', 'Defensor'),
        ('MID', 'Mediocampista'),
        ('FWD', 'Delantero'),
    ]

    first_name = models.CharField(max_length=50, verbose_name="Nombre")
    last_name = models.CharField(max_length=50, verbose_name="Apellido")
    birth_date = models.DateField(verbose_name="Fecha de Nacimiento")
    position = models.CharField(
        max_length=3, 
        choices=POSITION_CHOICES, 
        verbose_name="Posición"
    )
    jersey_number = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(99)],
        verbose_name="Número de Camiseta"
    )
    team = models.ForeignKey(
        Team, 
        on_delete=models.CASCADE, 
        related_name='players',
        verbose_name="Equipo"
    )
    photo = models.ImageField(upload_to='player_photos/', blank=True, null=True, verbose_name="Foto")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Jugador"
        verbose_name_plural = "Jugadores"
        ordering = ['team', 'jersey_number']
        unique_together = ['team', 'jersey_number']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.team.name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def age(self):
        from datetime import date
        today = date.today()
        return today.year - self.birth_date.year - ((today.month, today.day) < (self.birth_date.month, self.birth_date.day))
