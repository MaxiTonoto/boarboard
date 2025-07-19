from django.db import models
from django.contrib.auth.models import User
from column.models import Column

# Create your models here.

class Task(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(max_length=1024)
    order = models.PositiveIntegerField()
    column_id = models.ForeignKey(Column,
        on_delete=models.CASCADE, related_name="task_set")
    owner = models.ForeignKey(User, 
        on_delete=models.CASCADE, related_name="task_owner")