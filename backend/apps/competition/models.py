from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Tournament(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nombre del Torneo")
    season_year = models.PositiveIntegerField(
        validators=[MinValueValidator(2020), MaxValueValidator(2030)],
        verbose_name="Año de Temporada"
    )
    description = models.TextField(blank=True, verbose_name="Descripción")
    start_date = models.DateField(verbose_name="Fecha de Inicio")
    end_date = models.DateField(verbose_name="Fecha de Fin")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Torneo"
        verbose_name_plural = "Torneos"
        ordering = ['-season_year', 'name']

    def __str__(self):
        return f"{self.name} {self.season_year}"

class Stage(models.Model):
    STAGE_CHOICES = [
        ('group', 'Fase de Grupos'),
        ('round16', 'Octavos de Final'),
        ('quarter', 'Cuartos de Final'),
        ('semi', 'Semifinales'),
        ('final', 'Final'),
    ]
    
    name = models.CharField(max_length=100, verbose_name="Nombre de la Fase")
    stage_type = models.CharField(max_length=20, choices=STAGE_CHOICES, default='group')
    order = models.PositiveIntegerField(verbose_name="Orden")
    tournament = models.ForeignKey(
        Tournament, 
        on_delete=models.CASCADE, 
        related_name='stages',
        verbose_name="Torneo"
    )
    start_date = models.DateField(verbose_name="Fecha de Inicio")
    end_date = models.DateField(verbose_name="Fecha de Fin")
    is_completed = models.BooleanField(default=False, verbose_name="Completada")

    class Meta:
        verbose_name = "Fase"
        verbose_name_plural = "Fases"
        ordering = ['tournament', 'order']
        unique_together = ['tournament', 'order']

    def __str__(self):
        return f"{self.tournament.name} - {self.name}"

class Group(models.Model):
    name = models.CharField(max_length=50, verbose_name="Nombre del Grupo")
    stage = models.ForeignKey(
        Stage, 
        on_delete=models.CASCADE, 
        related_name='groups',
        verbose_name="Fase"
    )
    max_teams = models.PositiveIntegerField(default=6, verbose_name="Máximo de Equipos")

    class Meta:
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"
        ordering = ['stage', 'name']
        unique_together = ['stage', 'name']

    def __str__(self):
        return f"{self.stage.name} - {self.name}"
