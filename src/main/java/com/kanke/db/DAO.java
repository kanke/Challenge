package com.kanke.db;

import com.kanke.api.Expense;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;

import java.util.List;

/**
 * Created by kishaku on 21/11/2015.
 */
public class DAO {

    private static DAO instance;
    private SessionFactory factory;

    private DAO() {
        Configuration conf = new Configuration();
        conf.configure();
        ServiceRegistry registry = new ServiceRegistryBuilder().applySettings(
                conf.getProperties()).buildServiceRegistry();
        factory = conf.buildSessionFactory(registry);
        System.out.println("Creating factory");
    }

    public static synchronized DAO instance() {
        if (instance == null) {
            instance = new DAO();
        }
        return instance;
    }


    public Expense getExpense(int expensesId) {
        Session session = factory.openSession();
        String hql = "from Expense where expensesId = :expensesId";
        Query query = session.createQuery(hql);
        query.setParameter("expensesId", expensesId);
        List<Expense> list = query.list();
        return list.get(0);
    }

    public List<Expense> getExpenses() {
        Session session = factory.openSession();
        String hql = "from Expense";
        Query query = session.createQuery(hql);
        List<Expense> list = query.list();
        return list;
    }

    public Expense addExpense(Expense expense) {
        Session session = factory.openSession();
        System.out.println("DAO.addExpense()");
        session.beginTransaction();
        session.save(expense);
        session.getTransaction().commit();
        return expense;
    }

    public void cancelExpense(int expensesId) {
        System.out.println(expensesId);
        Session session = factory.openSession();
        Transaction trx = session.beginTransaction();
        Expense exp = (Expense) session.load(Expense.class, expensesId);
        session.delete(exp);
        trx.commit();
        session.close();
    }


    public Expense updateExpense(Expense expense) {
        Session session = factory.openSession();
        System.out.println("DAO.updateExpense()");
        session.beginTransaction();
        session.update(expense);
        session.getTransaction().commit();
        return expense;
    }
}
