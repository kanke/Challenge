package com.kanke.api;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import static junit.framework.Assert.assertNotNull;
import static org.mockito.Mockito.*;

/**
 * Created by kishaku on 24/11/2015.
 */
@RunWith(MockitoJUnitRunner.class)
public class ObjectFactoryTest {

    @Spy
    @InjectMocks
    ObjectFactory objectFactory;

    @After
    public void validate() {
        validateMockitoUsage();
    }

    @Before
    public void setup() {

    }

    @Test
    public void shouldCreateExpense() {
        Expense expense = new Expense();
        objectFactory.createExpense();

        assertNotNull(expense);
        verify(objectFactory, atLeastOnce()).createExpense();

    }

}
