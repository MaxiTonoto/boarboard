from rest_framework import serializers
from board.models import Board
from column.api.serializers import ColumnSerializer

class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, required=True)

    class Meta:
        model = Board
        fields = [
            "id", "title", "created_at",
            "last_modified", "owner_id",
            "columns",
        ]