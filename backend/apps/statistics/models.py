from django.db import models
from django.core.validators import MinValueValidator
from apps.clubs.models import Team
from apps.competition.models import Tournament

class Standing(models.Model):
    team = models.ForeignKey(
        Team, 
        on_delete=models.CASCADE, 
        related_name='standings',
        verbose_name="Equipo"
    )
    tournament = models.ForeignKey(
        Tournament, 
        on_delete=models.CASCADE, 
        related_name='standings',
        verbose_name="Torneo"
    )
    played = models.PositiveIntegerField(default=0, verbose_name="Partidos Jugados")
    won = models.PositiveIntegerField(default=0, verbose_name="Ganados")
    drawn = models.PositiveIntegerField(default=0, verbose_name="Empatados")
    lost = models.PositiveIntegerField(default=0, verbose_name="Perdidos")
    goals_for = models.PositiveIntegerField(default=0, verbose_name="Goles a Favor")
    goals_against = models.PositiveIntegerField(default=0, verbose_name="Goles en Contra")
    points = models.PositiveIntegerField(default=0, verbose_name="Puntos")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Posición"
        verbose_name_plural = "Tabla de Posiciones"
        ordering = ['-points', '-goals_for', 'goals_against']
        unique_together = ['team', 'tournament']

    def __str__(self):
        return f"{self.team.name} - {self.tournament.name}"

    @property
    def goal_difference(self):
        return self.goals_for - self.goals_against

    def update_stats(self):
        """Actualiza las estadísticas basadas en los partidos jugados"""
        from apps.matches.models import Match
        
        home_matches = Match.objects.filter(
            team_home=self.team,
            status='finished',
            stage__tournament=self.tournament
        )
        
        away_matches = Match.objects.filter(
            team_away=self.team,
            status='finished',
            stage__tournament=self.tournament
        )
        
        # Reset stats
        self.played = self.won = self.drawn = self.lost = 0
        self.goals_for = self.goals_against = self.points = 0
        
        # Calculate home matches
        for match in home_matches:
            self.played += 1
            self.goals_for += match.home_score or 0
            self.goals_against += match.away_score or 0
            
            if match.home_score > match.away_score:
                self.won += 1
                self.points += 3
            elif match.home_score == match.away_score:
                self.drawn += 1
                self.points += 1
            else:
                self.lost += 1
        
        # Calculate away matches
        for match in away_matches:
            self.played += 1
            self.goals_for += match.away_score or 0
            self.goals_against += match.home_score or 0
            
            if match.away_score > match.home_score:
                self.won += 1
                self.points += 3
            elif match.away_score == match.home_score:
                self.drawn += 1
                self.points += 1
            else:
                self.lost += 1
        
        self.save()
