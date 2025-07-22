from django.test import TestCase
from django.contrib.auth.models import User
from column.models import Column
from task.models import Task
from board.models import Board


class ColumnModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user1", password="pass")
        self.board = Board.objects.create(title="TestBoard", owner=self.user)
        self.column1 = Column.objects.create(title="Pending", order=1, board=self.board)
        self.column2 = Column.objects.create(
            title="In Progress", order=2, board=self.board
        )
        self.column3 = Column.objects.create(title="Done", order=3, board=self.board)

    def test_append_column_no_order_conflict(self):
        initial_board_column_count = self.board.column_set.count()

        # create, save and load new column at last order
        column4 = Column(
            title="Discarded", order=initial_board_column_count + 1, board=self.board
        )
        column4.save()
        column4.refresh_from_db()
        self.board.refresh_from_db()

        # get new column count
        board_column_count = self.board.column_set.count()

        # assert new column is in board at all
        self.assertIn(column4, self.board.column_set.all())

        self.assertEqual(board_column_count, initial_board_column_count + 1)
        self.assertEqual(column4.order, initial_board_column_count + 1)

    def test_append_column_max_position(self):
        initial_board_column_count = self.board.column_set.count()

        column3 = Column.objects.get(title="Done")
        # create, save and load new column at last order
        column4 = Column(
            title="Discarded", order=initial_board_column_count, board=self.board
        )
        column4.save()
        column4.refresh_from_db()
        column3.refresh_from_db()
        self.board.refresh_from_db()

        # get new column count
        board_column_count = self.board.column_set.count()

        # assert new column is in board at all
        self.assertIn(column4, self.board.column_set.all())
        self.assertEqual(board_column_count, initial_board_column_count + 1)
        self.assertEqual(column4.order, initial_board_column_count)
        self.assertEqual(column4.order, 3)

        # assert last column was pushed further
        self.assertEqual(column3.order, 4)

    def test_append_column_empty_board(self):
        # create, save and load columnless board
        new_board = Board.objects.create(
            title="TestBoard 2: This time it's personal", 
            owner=self.user
        )
        new_board.save()
        new_board.refresh_from_db()

        # first column with order 0
        first_column = Column(title="1st col", board=new_board, order=0)

        # second column, with no order
        second_column = Column(title="2nd col", board=new_board)
        
        # third column, order past max
        third_column = Column(title="3rd col", board=new_board, order=100)

        first_column.save()
        second_column.save()
        third_column.save()

        first_column.refresh_from_db()
        second_column.refresh_from_db()
        third_column.refresh_from_db()

        self.assertEqual(first_column.order, 1)
        self.assertEqual(second_column.order, 2)
        self.assertEqual(third_column.order, 3)

    def test_change_column_order_higher(self):
        column4 = Column.objects.create(title="Discarded", board=self.board, order=4)
        column5 = Column.objects.create(title="Planned", board=self.board, order=5)

        column4.order = 2
        column4.save()
        self.column1.refresh_from_db()
        self.column2.refresh_from_db()
        self.column3.refresh_from_db()
        column4.refresh_from_db()
        
        self.assertEqual(column4.order, 2)
        self.assertEqual(self.column1.order, 1)
        self.assertNotEqual(self.column2.order, 2)
        self.assertNotEqual(self.column3.order, 3)
    
    def test_change_column_order_lower(self):
        column4 = Column.objects.create(title="Discarded", board=self.board, order=4)
        column5 = Column.objects.create(title="Planned", board=self.board, order=5)

        self.column2.order = 4
        self.column1.refresh_from_db()
        self.column2.refresh_from_db()
        self.column3.refresh_from_db()
        column4.refresh_from_db()
        column5.refresh_from_db()
        
        self.assertEqual(self.column2.order, 4)
        self.assertEqual(self.column1.order, 1)
