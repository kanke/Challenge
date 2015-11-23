package com.kanke.service;

import com.kanke.api.Expense;
import com.kanke.api.ExpenseHandler;
import com.kanke.db.DAO;

import java.util.List;

/**
 * Created by kishaku on 21/11/2015.
 */
public class ExpenseHandlerImpl implements ExpenseHandler {


    public Expense addExpense(Expense newExp) {
       // Expense exp = DAO.instance().getExpense();
      //  if (exp == null) {
            DAO.instance().addExpense(newExp);
            return newExp;
       // }
       // return exp;
    }
    public Expense getExpense(int expensesId) {
        return DAO.instance().getExpense(expensesId);
    }

    public List<Expense> getExpenses() {
        return DAO.instance().getExpenses();
    }

    public void deleteExpense(int expensesId) {
        DAO.instance().cancelExpense(expensesId);
    }

    public Expense updateExpense(Expense expense) {

       DAO.instance().updateExpense(expense);
        return expense;
    }
}
