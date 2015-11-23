package com.kanke.rest;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;

/**
 * Created by kishaku on 21/11/2015.
 */
public class ExpenseExceptionMapper implements ExceptionMapper<Exception> {

    public Response toResponse(Exception arg0) {
        return Response.status(100).build();
    }
}
