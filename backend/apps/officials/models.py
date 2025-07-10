from django.db import models

class Referee(models.Model):
    CATEGORY_CHOICES = [
        ('regional', 'Regional'),
        ('nacional', 'Nacional'),
        ('internacional', 'Internacional'),
    ]

    first_name = models.CharField(max_length=50, verbose_name="Nombre")
    last_name = models.CharField(max_length=50, verbose_name="Apellido")
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES, 
        default='regional',
        verbose_name="Categoría"
    )
    license_number = models.CharField(max_length=20, unique=True, verbose_name="Número de Licencia")
    phone = models.CharField(max_length=15, blank=True, verbose_name="Teléfono")
    email = models.EmailField(blank=True, verbose_name="Email")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Árbitro"
        verbose_name_plural = "Árbitros"
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
