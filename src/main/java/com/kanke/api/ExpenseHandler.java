package com.kanke.api;

import java.util.List;

/**
 * Created by kishaku on 21/11/2015.
 */
public interface ExpenseHandler {

    public Expense addExpense(Expense newExp);

    public Expense getExpense(int expensesId);

    public List<Expense> getExpenses();

    public void deleteExpense(int expensesId);

    public Expense updateExpense(Expense expense);

}