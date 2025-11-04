const request = require('supertest');
const express = require('express');

// Mock the connection module before requiring app
jest.mock('../models/connection', () => {});

describe('Express Application', () => {
  let app;

  beforeEach(() => {
    // Clear module cache to get a fresh app instance
    jest.resetModules();
    app = require('../app');
  });

  describe('1. Application initialization, middleware and routes', () => {
    test('should be an Express application', () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    test('should have cors middleware registered', () => {
      const corsMiddleware = app._router.stack.find(
        layer => layer.name === 'corsMiddleware'
      );
      expect(corsMiddleware).toBeDefined();
    });

    test('should have json parser middleware registered', () => {
      const jsonParser = app._router.stack.find(
        layer => layer.name === 'jsonParser'
      );
      expect(jsonParser).toBeDefined();
    });

    test('should have urlencoded parser middleware registered', () => {
      const urlencodedParser = app._router.stack.find(
        layer => layer.name === 'urlencodedParser'
      );
      expect(urlencodedParser).toBeDefined();
    });

    test('should have cookie parser middleware registered', () => {
      const cookieParser = app._router.stack.find(
        layer => layer.name === 'cookieParser'
      );
      expect(cookieParser).toBeDefined();
    });

    test('should have static file middleware registered', () => {
      const serveStatic = app._router.stack.find(
        layer => layer.name === 'serveStatic'
      );
      expect(serveStatic).toBeDefined();
    });

    test('should have base route "/" registered', () => {
      const baseRoute = app._router.stack.find(
        layer => layer.regexp && layer.regexp.test('/') && layer.route
      );
      expect(baseRoute).toBeDefined();
    });

    test('should have "/users" route registered', () => {
      const usersRoute = app._router.stack.find(
        layer => layer.regexp && layer.regexp.test('/users')
      );
      expect(usersRoute).toBeDefined();
    });

    test('should have 404 error handler', () => {
      const errorHandlers = app._router.stack.filter(
        layer => layer.name === '<anonymous>' && layer.handle.length === 3
      );
      expect(errorHandlers.length).toBeGreaterThan(0);
    });

    test('should have global error handler', () => {
      const errorHandlers = app._router.stack.filter(
        layer => layer.name === '<anonymous>' && layer.handle.length === 4
      );
      expect(errorHandlers.length).toBeGreaterThan(0);
    });

    test('should have view engine set to jade', () => {
      expect(app.get('view engine')).toBe('jade');
    });
  });

  describe('5. Base route ("/") returns expected response', () => {
    test('GET / should return 200 status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });

    test('GET / should return the expected message', async () => {
      const response = await request(app).get('/');
      expect(response.text).toBe('respond with a resource');
    });

    test('GET / should have text/html content type', async () => {
      const response = await request(app).get('/');
      expect(response.type).toBe('text/html');
    });
  });

  describe('Error handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
    });
  });
});
