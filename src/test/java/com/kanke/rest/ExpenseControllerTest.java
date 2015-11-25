package com.kanke.rest;

import com.kanke.api.Expense;
import com.kanke.api.ExpenseHandler;
import com.kanke.db.DAO;
import com.kanke.service.ExpenseHandlerImpl;
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

import javax.ws.rs.core.Response;
import java.io.Serializable;
import java.util.Calendar;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

/**
 * Created by kishaku on 24/11/2015.
 */


@RunWith(MockitoJUnitRunner.class)
public class ExpenseControllerTest {

    @Spy
    @InjectMocks
    ExpenseController expenseController;

    @Mock
    private ExpenseHandler expenseHandler;

    @Mock
    private SessionFactory factory;

    @Mock
    Session session;

    @Mock
    Transaction transaction;

    @Mock
    Serializable serializable;

    @Spy
    @InjectMocks
    private DAO dao;

    @Mock
    List<Expense> exp;

    @Mock
    Response response;

    @Mock
    Expense expense;

    @Mock
    Response.ResponseBuilder responseBuilder;

    @Mock
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
    public void shouldRespondWithExpense() {

        ExpenseHandlerImpl expenseHandler = mock(ExpenseHandlerImpl.class);

        when(expenseHandler.getExpenses()).thenReturn(exp);
        when(response.getStatus()).thenReturn(200);
        when(responseBuilder.build()).thenReturn(response);

        expenseController.getExpenses();

        assertEquals(200, response.getStatus());
        verify(expenseController, atLeastOnce()).getExpenses();
    }


    @Test
    public void shouldNotRespondWithExpense() {

        ExpenseHandlerImpl expenseHandler = mock(ExpenseHandlerImpl.class);

        when(expenseHandler.getExpenses()).thenReturn(null);
        when(response.getStatus()).thenReturn(404);
        when(responseBuilder.build()).thenReturn(response);

        expenseController.getExpenses();

        assertEquals(404, response.getStatus());
        verify(expenseController, atLeastOnce()).getExpenses();
    }


    @Test
    public void shouldRespondWithSaveExpense() {

        when(expenseHandler.addExpense(expense)).thenReturn(expense);
        when(response.getStatus()).thenReturn(201);
        when(responseBuilder.build()).thenReturn(response);

        expenseController.saveExpense(expense);

        assertEquals(201, response.getStatus());
        verify(expenseController, atLeastOnce()).saveExpense(expense);
    }


    @Test
    public void shouldNotRespondWithSaveExpense() {


        when(session.save(expense)).thenReturn(serializable);
        when(session.getTransaction()).thenReturn(transaction);
        transaction.commit();

        ExpenseHandlerImpl expenseHandler = mock(ExpenseHandlerImpl.class);

        when(expenseHandler.addExpense(expense)).thenReturn(null);
        when(response.getStatus()).thenReturn(404);
        when(responseBuilder.build()).thenReturn(response);

        expenseController.saveExpense(null);

        assertEquals(404, response.getStatus());
        verify(expenseController, atLeastOnce()).saveExpense(expense);
    }


    @Test
    public void shouldRespondWithDeletedExpense() {

        ExpenseHandlerImpl expenseHandler = mock(ExpenseHandlerImpl.class);

        expenseHandler.deleteExpense(expense.getExpenseId());
        when(response.getStatus()).thenReturn(200);
        when(responseBuilder.build()).thenReturn(response);

        expenseController.cancelExpense(expense.getExpenseId());

        assertEquals(200, response.getStatus());
        verify(expenseController, atLeastOnce()).cancelExpense(expense.getExpenseId());
    }


}
