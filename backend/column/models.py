from django.db import models
from board.models import Board

# Create your models here.

class Column(models.Model):
    title = models.CharField(max_length=52)
    order = models.PositiveIntegerField()
    board_id = models.ForeignKey(Board,
        on_delete=models.CASCADE, related_name="column_set")