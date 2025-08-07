from rest_framework import serializers
from column.models import Column
from task.api.serializers import TaskSerializer

class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ["id", "title", "order", "tasks", "board",]