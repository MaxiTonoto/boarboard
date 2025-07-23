from django.db import models
from django.db.models import F
from board.models import Board

# Create your models here.


class Column(models.Model):
    title = models.CharField(max_length=52)
    order = models.PositiveIntegerField()
    board_id = models.ForeignKey(
        Board, on_delete=models.CASCADE, related_name="columns"
    )

    class Meta:
        verbose_name = "Column"
        verbose_name_plural = "Columns"

    def __str__(self):
        return f"{self.board_id} - {self.order} - {self.title}"

    def save(self, *args, **kwargs):

        if not self.pk:  # new column
            # get column with max order
            max_column = (
                Column.objects.filter(board_id=self.board_id).order_by("-order").first()
            )
            # get max order, 0 if no other columns
            max_column_order = max_column.order if max_column else 0

            # add column to end pos if no order given
            # or given order is higher than current max order
            if (not self.order) or (self.order == 0) or (self.order > max_column_order):
                self.order = max_column_order + 1
            else:
                Column.objects.filter(
                    board_id=self.board_id, order__gte=self.order
                ).update(order=F("order") + 1)

        else:  # updating a column
            # pre-update object, very good
            pre_update = Column.objects.get(pk=self.pk)

            # if order changed
            if self.order != pre_update.order:
                # get column with max order
                max_column = (
                    Column.objects.filter(board_id=self.board_id)
                    .order_by("-order")
                    .exclude(pk=self.pk)
                    .first()
                )
                # get max order, 0 if no other columns
                max_column_order = max_column.order if max_column else 0

                if self.order > max_column_order:
                    self.order = max_column_order + 1
                else:
                    Column.objects.filter(
                        board_id=self.board_id, order__gte=self.order
                    ).exclude(pk=self.pk).update(order=F("order") + 1)

                # close gaps created by moved column

                # if column had another column next
                if Column.objects.filter(
                    board_id=self.board_id, order__gt=pre_update.order
                ).exists():
                    # close gap
                    Column.objects.filter(
                        board_id=self.board_id, order__gt=pre_update.order
                    ).exclude(pk=self.pk).update(order=F("order") - 1)

        super().save(*args, **kwargs)
