from django.db import models, transaction
from django.contrib.auth.models import User
from column.models import Column
from django.db.models import F, Q, Max


class Task(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(max_length=1024)
    order = models.PositiveIntegerField()
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name="tasks")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="task_owner")

    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"

    def __str__(self, *args, **kwargs):
        return f"{self.order} - {self.title}"

    def delete(self, *args, **kwargs):
        column = self.column
        order = self.order
        super().delete(*args, **kwargs)
        Task.objects.filter(column=column, order__gt=order).update(order=F("order") - 1)

    # helper method
    def get_max_order(self, column, exc_pk=None):
        queryset = Task.objects.filter(column=column)
        if exc_pk:
            queryset = queryset.exclude(pk=exc_pk)
        return queryset.aggregate(max_order=Max("order"))["max_order"] or 0

    def _handle_new_task(self):
        max_order = self.get_max_order(column=self.column)

        # if empty/invalid order, place task at end
        if not self.order or self.order <= 0:
            self.order = max_order + 1

        else:
            # create gap for incoming task  
            if Task.objects.filter(column=self.column, order=self.order).exists():
                Task.objects.filter(
                    column=self.column, order__gte=self.order
                ).update(order=F("order") + 1)

            # if given order is higher than max order
            elif self.order > max_order:
                self.order = max_order + 1
        
    def _handle_same_column_update(self, pre_update):
        # task moved down or no order given
        if self.order > pre_update.order:       
            max_order = self.get_max_order(column=self.column, exc_pk=self.pk)
            if self.order > max_order:
                Task.objects.filter(   # close gap created by moved task
                    column=self.column,
                    order__gt=pre_update.order
                ).exclude(pk=self.pk).update(order=F("order") - 1)
                self.order = max_order
                return

            Task.objects.filter(   # make space for moved task
                column=self.column,
                order__gt=pre_update.order,
                order__lte=self.order,
            ).exclude(pk=self.pk).update(order=F("order") - 1)

        else:   # task moved up
            if self.order > 0:
                Task.objects.filter(   # make space for moved task
                    column=self.column,
                    order__gte=self.order,
                    order__lt=pre_update.order,
                ).exclude(pk=self.pk).update(order=F("order") + 1)
            else:
                Task.objects.filter(   # make space for moved task
                    column=self.column,
                    order__lt=pre_update.order
                ).exclude(pk=self.pk).update(order=F("order") + 1)
                self.order = 1

    def _handle_column_update(self, pre_update):
        max_order = self.get_max_order(column=self.column, exc_pk=self.pk)

        # give order automatically
        if not self.order or self.order > max_order:
            self.order = max_order + 1

        # if order is given
        else:
            # make space for incoming task
            Task.objects.filter(
                column=self.column,
                order__gte=self.order
            ).exclude(pk=self.pk).update(order=F("order") + 1)

        # Close gap left on previous column
        Task.objects.filter(
            column=pre_update.column,
            order__gt=pre_update.order
        ).update(order=F("order") - 1)

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.pk:
                self._handle_new_task()
                return super().save(*args, **kwargs)

            pre_update = Task.objects.get(pk=self.pk)

            if self.column == pre_update.column:  # updates on same column
                self._handle_same_column_update(pre_update)
                return super().save(*args, **kwargs)

            else:  # on column change
                self._handle_column_update(pre_update)
                return super().save(*args, **kwargs)

            return super().save(*args, **kwargs)