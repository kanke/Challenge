package com.kanke.rest;

import com.kanke.api.Expense;
import com.kanke.service.ExpenseHandlerImpl;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Created by kishaku on 21/11/2015.
 */
@Path("/")
public class ExpenseController {


    @GET
    @Path("/{expensesId}")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getExpense(
            @PathParam(value = "expensesId") int expensesId) {
        Expense exp = new ExpenseHandlerImpl().getExpense(expensesId);
        if (exp != null) {
            return Response.ok().entity(exp).build();
        } else {
            return Response.status(404).build();
        }
    }


    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response getExpenses() {
        final List<Expense> exp = new ExpenseHandlerImpl().getExpenses();
        if (exp != null) {
            return Response.ok().entity(exp).build();
        } else {
            return Response.status(404).build();
        }
    }


    @POST
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveExpense(Expense expense) {
        Expense exp = new ExpenseHandlerImpl().addExpense(expense);
        if (exp != null) {
            return Response.status(201).entity(exp).build();
        } else {
            return Response.status(404).build();
        }
    }


    @DELETE
    @Path("/{expensesId}")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response cancelTicket(@PathParam(value = "expensesId") int expensesId) {
        new ExpenseHandlerImpl().deleteExpense(expensesId);
        return Response.ok().build();
    }

}
