from rest_framework import serializers
from board.models import Board
from column.api.serializers import ColumnSerializer

class BoardSerializer(serializers.ModelSerializer):
    column_set = ColumnSerializer(many=True)

    class Meta:
        model = Board
        fields = [
            "id", "title", "created_at",
            "last_modified", "owner",
            "column_set",
        ]