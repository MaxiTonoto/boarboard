from django.test import TestCase
from django.contrib.auth.models import User
from column.models import Column
from task.models import Task
from board.models import Board

class TaskModelSingleColumnTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="pass")
        self.board = Board.objects.create(title="TestBoard", owner=self.user)
        self.column = Column.objects.create(title="To Do", order=1, board=self.board)

    def test_create_task_with_auto_order(self):
        task1 = Task.objects.create(title="Task 1", description="desc", order=1, column=self.column, owner=self.user)
        task2 = Task(title="Task 2", description="desc", column=self.column, owner=self.user)
        task2.save()

        task1.refresh_from_db()
        task2.refresh_from_db()
        self.assertEqual(task1.order, 1)
        self.assertEqual(task2.order, 2)

    def test_task_move_down_in_same_column(self):
        tasks = [
            Task(title=f"Task {i}", description="desc", order=i, column=self.column, owner=self.user)
            for i in range(1, 5)
        ]
        Task.objects.bulk_create(tasks)

        tasks = {task.title: task for task in Task.objects.filter(column=self.column)}
    
        tasks["Task 1"].order = 3
        tasks["Task 1"].save()

        for task in tasks.values():
            task.refresh_from_db()

        self.assertEqual(tasks["Task 1"].order, 2)
        self.assertEqual(tasks["Task 2"].order, 1)
        self.assertEqual(tasks["Task 3"].order, 3)  
        self.assertEqual(tasks["Task 4"].order, 4)  
    
    def test_task_move_down_past_bottom_in_same_column(self):
        tasks = [
            Task(title=f"Task {i}", description="desc", order=i, column=self.column, owner=self.user)
            for i in range(1, 5)
        ]
        Task.objects.bulk_create(tasks)

        tasks = {task.title: task for task in Task.objects.filter(column=self.column)}
    
        tasks["Task 1"].order = 100000
        tasks["Task 1"].save()

        for task in tasks.values():
            task.refresh_from_db()

        self.assertEqual(tasks["Task 1"].order, 2)
        self.assertEqual(tasks["Task 2"].order, 1)
        self.assertEqual(tasks["Task 3"].order, 3)  
        self.assertEqual(tasks["Task 4"].order, 4)  

    def test_task_move_up_in_same_column(self):
        tasks = [
            Task(title=f"Task {i}", description="desc", order=i, column=self.column, owner=self.user)
            for i in range(1, 6)
        ]
        Task.objects.bulk_create(tasks)

        tasks = {task.title: task for task in Task.objects.filter(column=self.column)}
    
        tasks["Task 4"].order = 2
        tasks["Task 4"].save()

        for task in tasks.values():
            task.refresh_from_db()

        self.assertEqual(tasks["Task 1"].order, 1)
        self.assertEqual(tasks["Task 2"].order, 3)
        self.assertEqual(tasks["Task 3"].order, 4)  
        self.assertEqual(tasks["Task 4"].order, 2)  
        self.assertEqual(tasks["Task 5"].order, 5)  

    def test_order_shifts_on_insertion(self):
        Task.objects.create(title="Task 1", description="desc", order=1, column=self.column, owner=self.user)
        Task.objects.create(title="Task 2", description="desc", order=2, column=self.column, owner=self.user)

        new_task = Task(title="Task Inserted", description="desc", order=1, column=self.column, owner=self.user)
        new_task.save()

        orders = list(Task.objects.order_by("order").values_list("title", flat=True))
        self.assertEqual(orders, ["Task Inserted", "Task 1", "Task 2"])

class TaskModelChangeColumnTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="pass")
        self.board = Board.objects.create(title="TestBoard", owner=self.user)
        self.column1 = Column.objects.create(title="Pending", order=1, board=self.board)
        self.column2 = Column.objects.create(title="Done", order=2, board=self.board)

        for i in range(1, 6):
            Task.objects.create(
                title=f"Pending Task {i}", description=f"{i*15212}",
                order=i, column=self.column1, owner=self.user
            )
        for i in range(1, 6):
            Task.objects.create(
                title=f"Done Task {i}", description=f"{i*31232}",
                order=i, column=self.column2, owner=self.user
            )

    def test_change_column_beyond_bottom_order(self):
        task1 = Task.objects.get(title="Pending Task 1")
        task1.order = 100
        task1.column = self.column2
        task1.save()
        task1.refresh_from_db()

        self.assertNotEqual(task1.order, 100)
        self.assertEqual(task1.column, self.column2)
        self.assertIn(task1, self.column2.task_set.all())

    def test_change_column_to_occupied(self):
        task3 = Task.objects.get(title="Pending Task 3")
        task3.column = self.column2

        task3.save()
        task3.refresh_from_db()

        self.assertEqual(task3.order, 3)
        self.assertEqual(task3.column, self.column2)
        self.assertIn(task3, self.column2.task_set.all())

    def test_moved_task_gap_filled(self):
        initial_column1_count = Task.objects.filter(column=self.column1).count()
        initial_column2_count = Task.objects.filter(column=self.column2).count()
        task2 = Task.objects.get(title="Done Task 2")
        task2.column = self.column1

        task2.save()
        task2.refresh_from_db()
        self.column1.refresh_from_db()
        self.column2.refresh_from_db()

        tasks_in_column1 = Task.objects.filter(column=self.column1).count()
        tasks_in_column2 = Task.objects.filter(column=self.column2).count()
        self.assertEqual(tasks_in_column1, initial_column1_count + 1)
        self.assertEqual(tasks_in_column2, initial_column2_count - 1)