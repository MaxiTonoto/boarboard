from django.db import models, transaction
from django.db.models import F, Max
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

    def _handle_new_column(self):
        max_column = Column.objects.filter(
                board_id=self.board_id
            ).aggregate(max_column=Max("order"))["max_column"] or 0

        # add column to end pos if no order given
        # or given order is higher than current max order
        if (not self.order) or (self.order == 0) or (self.order > max_column):
            self.order = max_column + 1
        else:
            Column.objects.filter(
                board_id=self.board_id,
                order__gte=self.order
            ).update(order=F("order") + 1)

    def _handle_order_update(self, pre_update):
        # if column moved right
        if self.order > pre_update.order:
            max_order = Column.objects.filter(
                board_id=self.board_id
            ).exclude(pk=self.pk).aggregate(max_order=Max("order"))["max_order"] or 0

            if self.order > max_order:   # if new order is higher than max order
                Column.objects.filter(   # close gap created by moved col
                    board_id=self.board_id,
                    order__gt=pre_update.order
                ).exclude(pk=self.pk).update(order=F("order") - 1)
                self.order = max_order   # update order
                return

            Column.objects.filter(   # create gap for moved column
                board_id=self.board_id,
                order__gt=pre_update.order,
                order__lte=self.order,
            ).exclude(pk=self.pk).update(order=F("order") - 1)

        else:   # column moved left
            if self.order > 0:
                Column.objects.filter(
                    board_id=self.board_id,
                    order__gte=self.order,
                    order__lt=pre_update.order
                ).exclude(pk=self.pk).update(order=F("order") + 1)
            else:
                Column.objects.filter(   # make space for moved task
                    board_id=self.board_id,
                    order__lt=pre_update.order
                ).exclude(pk=self.pk).update(order=F("order") + 1)
                self.order = 1

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.pk:  # new column
                self._handle_new_column()
                return super().save(*args, **kwargs)

            else:  # updating a column
                # pre-update object, very good
                pre_update = Column.objects.get(pk=self.pk)

                # if order changed
                if self.order != pre_update.order:
                    self._handle_order_update(pre_update)
                    return super().save(*args, **kwargs)

            super().save(*args, **kwargs)
