from column.models import Column
from rest_framework import viewsets
from column.api.serializers import ColumnSerializer

class ColumnViewSet(viewsets.ModelViewSet):
    serializer_class = ColumnSerializer
    queryset = Column.objects.all()