from rest_framework import serializers
from board.models import Board
from column.api.serializers import ColumnSerializer
from column.models import Column

class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, required=False)
    columnsPreset = serializers.IntegerField(min_value=0, max_value=2, write_only=True, required=False)

    class Meta:
        model = Board
        fields = [
            "id", "title", "created_at",
            "last_modified", "owner",
            "columns", "columnsPreset",
        ]

        read_only_fields = ("owner", "created_at", "last_modified")

    def create(self, validated_data):
        columns_preset = validated_data.pop("columnsPreset", 0) 

        new_board = super().create(validated_data)
        
        if columns_preset == 1:
            Column.objects.create(title="Pending", order=1, board=new_board)
            Column.objects.create(title="In Progress", order=2, board=new_board)
            Column.objects.create(title="Done", order=3, board=new_board)
        elif columns_preset == 2:
            Column.objects.create(title="Not Done", order=1, board=new_board)
            Column.objects.create(title="Done", order=2, board=new_board)
            
        return new_board