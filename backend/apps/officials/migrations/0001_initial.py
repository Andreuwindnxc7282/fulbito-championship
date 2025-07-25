# Generated by Django 4.2.7 on 2025-07-10 05:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Referee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50, verbose_name='Nombre')),
                ('last_name', models.CharField(max_length=50, verbose_name='Apellido')),
                ('category', models.CharField(choices=[('regional', 'Regional'), ('nacional', 'Nacional'), ('internacional', 'Internacional')], default='regional', max_length=20, verbose_name='Categoría')),
                ('license_number', models.CharField(max_length=20, unique=True, verbose_name='Número de Licencia')),
                ('phone', models.CharField(blank=True, max_length=15, verbose_name='Teléfono')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='Email')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='Activo')),
            ],
            options={
                'verbose_name': 'Árbitro',
                'verbose_name_plural': 'Árbitros',
                'ordering': ['last_name', 'first_name'],
            },
        ),
    ]
