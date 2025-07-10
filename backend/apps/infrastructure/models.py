from django.db import models
from django.core.validators import MinValueValidator

class Venue(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre de la Cancha")
    address = models.CharField(max_length=200, verbose_name="Dirección")
    city = models.CharField(max_length=100, verbose_name="Ciudad")
    capacity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name="Capacidad"
    )
    field_type = models.CharField(
        max_length=50, 
        choices=[
            ('grass', 'Césped Natural'),
            ('artificial', 'Césped Artificial'),
            ('concrete', 'Concreto'),
        ],
        default='artificial',
        verbose_name="Tipo de Cancha"
    )
    has_lighting = models.BooleanField(default=True, verbose_name="Tiene Iluminación")
    has_changing_rooms = models.BooleanField(default=True, verbose_name="Tiene Vestuarios")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, verbose_name="Activa")

    class Meta:
        verbose_name = "Cancha"
        verbose_name_plural = "Canchas"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.city}"
