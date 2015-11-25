package com.kanke.service;

import com.kanke.api.Expense;
import com.kanke.api.ExpenseHandler;
import com.kanke.db.DAO;
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

import static org.mockito.Mockito.validateMockitoUsage;

/**
 * Created by kishaku on 24/11/2015.
 */
@RunWith(MockitoJUnitRunner.class)
public class ExpenseHandlerImplTest {


    @Spy
    @InjectMocks
    private ExpenseHandlerImpl expenseHandlerImpl;

    @Mock
    Expense addExpense;

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

    @After
    public void validate() {
        validateMockitoUsage();
    }

    @Before
    public void setup() {


    }

    /*
      public Expense addExpense(Expense newExp) {
            DAO.instance().addExpense(newExp);
            return newExp;

        }
     */

    @Spy
    @InjectMocks
    DAO daoObject;

    @Mock
    DAO dao;

    @Test
    public void shouldAddExpense() {

    }

    @Test
    public void shouldGetExpenses() {



    }

}
