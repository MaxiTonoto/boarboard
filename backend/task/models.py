from django.db import models
from django.contrib.auth.models import User
from column.models import Column
from django.db.models import F, Q


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

    def save(self, *args, **kwargs):
        if not self.pk:  # new item
            max_order = (
                Task.objects.filter(column=self.column)
                .order_by("-order")
                .exclude(order=self.order)
                .first()
            )
            if not self.order or self.order == 0:  # place at the end
                self.order = max_order.order + 1 if max_order else 1
                super().save(*args, **kwargs)
                return

            else:  # create gap for incoming task
                if Task.objects.filter(column=self.column, order=self.order).exists():
                    Task.objects.filter(
                        column=self.column,
                        order__gte=self.order
                    ).update(order=F("order") + 1)
                else:
                    self.order = max_order.order + 1 if max_order else 1
                super().save(*args, **kwargs)
                return

        pre_update = Task.objects.get(pk=self.pk)

        if self.column == pre_update.column:  # updates on same column
            if self.order > pre_update.order:

                # check it didn't go past the max order
                max_task = (
                    Task.objects.filter(column=self.column)
                    .order_by("-order")
                    .exclude(pk=self.pk)
                    .first()
                )
                max_order = max_task.order if max_task else 0  # in case it's empty
                if self.order >= max_order:
                    self.order = max_order + 1

                Task.objects.filter(column=self.column, order__gte=self.order).update(
                    order=F("order") + 1
                )

                super().save(*args, **kwargs)

                Task.objects.filter(
                    column=self.column, order__gt=pre_update.order
                ).update(order=F("order") - 1)

            elif pre_update.order > self.order:
                Task.objects.filter(column=self.column, order__gte=self.order).update(
                    order=F("order") + 1
                )

                super().save(*args, **kwargs)

                Task.objects.filter(
                    column=self.column, order__gt=pre_update.order
                ).update(order=F("order") - 1)
            return

        else:  # updates on column change
            new_pos_has_task = (
                Task.objects.filter(order=self.order, column=self.column)
                .exclude(pk=self.pk)
                .exists()
            )

            if new_pos_has_task:
                # make space for incoming task
                Task.objects.filter(column=self.column, order__gte=self.order).exclude(
                    pk=self.pk
                ).update(order=F("order") + 1)
            else:
                # place new task on new column's max order
                max_task = (
                    Task.objects.filter(column=self.column)
                    .order_by("-order")
                    .exclude(pk=self.pk)
                    .first()
                )
                max_order = max_task.order if max_task else 0  # in case it's empty
                if self.order >= max_order:
                    self.order = max_order + 1

            # move task before making further changes
            super().save(*args, **kwargs)

            # close gap if moved task left one
            if Task.objects.filter(
                column=pre_update.column, order__gte=pre_update.order + 1
            ).exists():
                Task.objects.filter(
                    column=pre_update.column, order__gt=pre_update.order
                ).update(order=F("order") + 1)
            return

        super().save(*args, **kwargs)
