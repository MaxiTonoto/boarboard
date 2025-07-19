from rest_framework import viewsets
from board.api.serializers import BoardSerializer
from board.models import Board

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    queryset = Board.objects.all()