from rest_framework import serializers
from column.models import Column
from task.api.serializers import TaskSerializer

class ColumnSerializer(serializers.ModelSerializer):
    task_set = TaskSerializer(many=True, required=False)

    class Meta:
        model = Column
        fields = ["id", "title", "order", "task_set", "board_id",]