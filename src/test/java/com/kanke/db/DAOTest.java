package com.kanke.db;

import com.kanke.api.Expense;
import com.kanke.api.ExpenseHandler;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.Serializable;
import java.util.Calendar;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.*;

/**
 * Created by kishaku on 24/11/2015.
 */

@RunWith(MockitoJUnitRunner.class)
public class DAOTest {

    @Mock
    private ExpenseHandler expenseHandler;

    @Mock
    private SessionFactory factory;

    @Mock
    Session session;

    @Mock
    Transaction transaction;

    @Mock
    Expense expense;

    @Mock
    Serializable serializable;

    @Spy
    @InjectMocks
    private DAO dao;

    int expensesId = 1;

    @Mock
    Query query;

    @Mock
    List<Expense> list;

    Calendar date;


    @After
    public void validate() {
        validateMockitoUsage();
    }

    @Before
    public void setup() {

        when(factory.openSession()).thenReturn(session);
        when(session.beginTransaction()).thenReturn(transaction);

        expense.setDate(date);
        expense.setAmount(10.00);
        expense.setExpenseId(1);
        expense.setReason("test");

    }

    @Test
    public void shouldAddExpense() {

        when(session.save(expense)).thenReturn(serializable);
        when(session.getTransaction()).thenReturn(transaction);
        transaction.commit();

        assertNotNull(dao.addExpense(expense));
        verify(dao, atLeastOnce()).addExpense(expense);

    }

    @Test
    public void shouldCancelExpense() {

        Expense expense1 = (Expense) session.load(Expense.class, expense.getExpenseId());
        session.delete(expense1);
        transaction.commit();
        session.close();
        dao.cancelExpense(expensesId);
        verify(dao, atLeastOnce()).cancelExpense(expensesId);

    }

    @Test
    public void shouldGetExpenses() {

        String hql = "from Expense";
        when(session.createQuery(hql)).thenReturn(query);
        when(query.list()).thenReturn(list);

        assertEquals(list, dao.getExpenses());
        verify(dao, atLeastOnce()).getExpenses();

    }
}
