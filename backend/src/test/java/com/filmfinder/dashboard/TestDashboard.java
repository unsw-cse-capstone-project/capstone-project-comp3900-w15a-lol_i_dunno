package com.filmfinder.dashboard;

import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class TestDashboard {
    @Test
    public void testNormal() {
        try {
            Dashboard d = new Dashboard(100);
            System.out.println(d);
        } catch (Exception e) {
            assertTrue(false);
        }
    }
}