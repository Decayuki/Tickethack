# Backend Unit Tests

This directory contains comprehensive unit tests for the Express application.

## Test Coverage

The test suite covers the following scenarios:

1. **Express Application Initialization** (`app.test.js`)
   - Application instance creation
   - Middleware registration (CORS, JSON parser, URL encoder, cookie parser, static files)
   - Route registration (base route, users route)
   - Error handlers (404 and global error handler)
   - View engine configuration

2. **MongoDB Connection** (`connection.test.js`)
   - Successful database connection
   - Connection failure handling
   - Error logging
   - Connection options validation

3. **Server Startup and Configuration** (`server.test.js`)
   - Port normalization (numeric ports, named pipes, negative values)
   - Server listening on specified port
   - Event listener registration
   - EACCES error handling (insufficient privileges)
   - EADDRINUSE error handling (port already in use)
   - Error handling for different syscalls and error codes

4. **Base Route Response** (`app.test.js`)
   - GET "/" returns 200 status
   - Response content validation
   - Content-Type header validation

## Installation

First, install the required dependencies:

```bash
npm install
```

This will install both production dependencies and dev dependencies (Jest and Supertest).

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (automatically re-runs on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

- `app.test.js` - Tests for Express app initialization, middleware, routes, and base route response
- `connection.test.js` - Tests for MongoDB connection functionality
- `server.test.js` - Tests for server startup, port normalization, and error handling

## Notes

- All tests use Jest mocking to avoid actual database connections and server startup
- Tests are isolated and can run independently
- The MongoDB connection module is mocked in all test files to prevent actual database connections during testing
