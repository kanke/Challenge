package com.kanke.api;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Calendar;
import java.util.GregorianCalendar;

import static junit.framework.Assert.*;
import static org.mockito.Mockito.validateMockitoUsage;

/**
 * Created by kishaku on 24/11/2015.
 */

@RunWith(MockitoJUnitRunner.class)
public class ExpenseTest {

    protected int expensesId = 1;

    protected String reason = "reason";

    protected double amount = 10.00;

    protected double vatAmount = 10.00;

    protected Calendar date = new GregorianCalendar(2013, 8, 31);


    @After
    public void validate() {
        validateMockitoUsage();
    }

    @Before
    public void setup() {

    }

    @Test
    public void shouldReturnAmount() {
        Expense expense = new Expense();
        expense.setAmount(this.amount);
        assertTrue(expense.getAmount() == amount);
        assertEquals(this.amount, expense.getAmount());
    }

    @Test
    public void shouldReturnNotAmount() {
        Expense expense = new Expense();
        expense.setAmount(3.00);
        assertFalse(expense.getAmount() == amount);
        assertNotSame(this.amount, expense.getAmount());
    }

    @Test
    public void shouldReturnReason() {
        Expense expense = new Expense();
        expense.setReason(this.reason);
        assertTrue(expense.getReason() == reason);
        assertEquals(this.reason, expense.getReason());
    }

    @Test
    public void shouldReturnNotReason() {
        Expense expense = new Expense();
        expense.setReason("false");
        assertFalse(expense.getReason().equals(reason));
        assertNotSame(this.reason, expense.getReason());
    }

    @Test
    public void shouldReturnExpenseId() {
        Expense expense = new Expense();
        expense.setExpenseId(this.expensesId);
        assertTrue(expense.getExpenseId() == expensesId);
        assertEquals(this.expensesId, expense.getExpenseId());
    }

    @Test
    public void shouldNotReturnExpenseId() {
        Expense expense = new Expense();
        expense.setExpenseId(9);
        assertFalse(expense.getExpenseId() == expensesId);
        assertNotSame(this.expensesId, expense.getExpenseId());
    }

//    @Test
//    public void shouldReturnVATAmount() {
//        Expense expense = new Expense();
//        expense.setVatAmount(10.00);
//        assertTrue(expense.getVatAmount() == vatAmount);
//        assertEquals(this.vatAmount, expense.getAmount());
//    }

    @Test
    public void shouldNotReturnVATAmount() {
        Expense expense = new Expense();
        expense.setVatAmount(1.00);
        assertFalse(expense.getVatAmount() == vatAmount);
        assertNotSame(this.vatAmount, expense.getVatAmount());
    }

    @Test
    public void shouldReturnDate() {
        Expense expense = new Expense();
        expense.setDate(this.date);
        assertTrue(expense.getDate() == date);
        assertEquals(this.date, expense.getDate());
    }

    @Test
    public void shouldNotReturnDate() {
        Expense expense = new Expense();
        expense.setDate(new GregorianCalendar(2012, 9, 31));
        assertFalse(expense.getDate() == date);
        assertNotSame(this.date, expense.getDate());
    }


}
