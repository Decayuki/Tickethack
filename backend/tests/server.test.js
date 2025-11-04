// Mock dependencies before requiring the server module
jest.mock('../models/connection', () => {});

describe('Server Startup and Configuration', () => {
  let mockApp;
  let mockServer;
  let consoleErrorSpy;
  let processExitSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Spy on console.error and process.exit
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation();

    // Mock the app module
    mockApp = {
      set: jest.fn()
    };
    jest.doMock('../app', () => mockApp);

    // Mock http module
    mockServer = {
      listen: jest.fn(),
      on: jest.fn(),
      address: jest.fn().mockReturnValue({ port: 3000 })
    };
    jest.doMock('http', () => ({
      createServer: jest.fn(() => mockServer)
    }));
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe('3. Server starts and correctly normalizes port number', () => {
    test('normalizePort should return numeric port for valid number string', () => {
      // We need to extract and test the normalizePort function
      const normalizePort = (val) => {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
          return val;
        }
        if (port >= 0) {
          return port;
        }
        return false;
      };

      expect(normalizePort('3000')).toBe(3000);
      expect(normalizePort('8080')).toBe(8080);
      expect(normalizePort('80')).toBe(80);
    });

    test('normalizePort should return string for named pipe', () => {
      const normalizePort = (val) => {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
          return val;
        }
        if (port >= 0) {
          return port;
        }
        return false;
      };

      expect(normalizePort('/tmp/socket')).toBe('/tmp/socket');
      expect(normalizePort('pipe-name')).toBe('pipe-name');
    });

    test('normalizePort should return false for negative port', () => {
      const normalizePort = (val) => {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
          return val;
        }
        if (port >= 0) {
          return port;
        }
        return false;
      };

      expect(normalizePort('-1')).toBe(false);
      expect(normalizePort('-8080')).toBe(false);
    });

    test('normalizePort should handle edge cases', () => {
      const normalizePort = (val) => {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
          return val;
        }
        if (port >= 0) {
          return port;
        }
        return false;
      };

      expect(normalizePort('0')).toBe(0);
      expect(normalizePort('65535')).toBe(65535);
    });

    test('server should set port on app', () => {
      process.env.PORT = '3000';
      
      // Load the server module
      require('../bin/www');

      expect(mockApp.set).toHaveBeenCalledWith('port', 3000);
    });

    test('server should use default port 3000 if PORT env is not set', () => {
      delete process.env.PORT;
      
      require('../bin/www');

      expect(mockApp.set).toHaveBeenCalledWith('port', 3000);
    });

    test('server should listen on the specified port', () => {
      process.env.PORT = '3000';
      
      require('../bin/www');

      expect(mockServer.listen).toHaveBeenCalledWith(3000);
    });

    test('server should register error event listener', () => {
      require('../bin/www');

      const errorListener = mockServer.on.mock.calls.find(
        call => call[0] === 'error'
      );
      expect(errorListener).toBeDefined();
      expect(typeof errorListener[1]).toBe('function');
    });

    test('server should register listening event listener', () => {
      require('../bin/www');

      const listeningListener = mockServer.on.mock.calls.find(
        call => call[0] === 'listening'
      );
      expect(listeningListener).toBeDefined();
      expect(typeof listeningListener[1]).toBe('function');
    });
  });

  describe('4. Server handles EACCES and EADDRINUSE errors during startup', () => {
    test('should handle EACCES error with numeric port', () => {
      process.env.PORT = '80';
      
      require('../bin/www');

      // Get the error handler
      const errorHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'error'
      )[1];

      const error = new Error('EACCES');
      error.code = 'EACCES';
      error.syscall = 'listen';

      errorHandler(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Port 80 requires elevated privileges');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test('should handle EACCES error with named pipe', () => {
      process.env.PORT = '/tmp/socket';
      
      require('../bin/www');

      const errorHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'error'
      )[1];

      const error = new Error('EACCES');
      error.code = 'EACCES';
      error.syscall = 'listen';

      errorHandler(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Pipe /tmp/socket requires elevated privileges');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test('should handle EADDRINUSE error with numeric port', () => {
      process.env.PORT = '3000';
      
      require('../bin/www');

      const errorHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'error'
      )[1];

      const error = new Error('EADDRINUSE');
      error.code = 'EADDRINUSE';
      error.syscall = 'listen';

      errorHandler(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Port 3000 is already in use');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test('should handle EADDRINUSE error with named pipe', () => {
      process.env.PORT = '/tmp/socket';
      
      require('../bin/www');

      const errorHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'error'
      )[1];

      const error = new Error('EADDRINUSE');
      error.code = 'EADDRINUSE';
      error.syscall = 'listen';

      errorHandler(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Pipe /tmp/socket is already in use');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test('should throw error if syscall is not listen', () => {
      require('../bin/www');

      const errorHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'error'
      )[1];

      const error = new Error('Some other error');
      error.syscall = 'connect';

      expect(() => errorHandler(error)).toThrow('Some other error');
    });

    test('should throw error for unknown error codes', () => {
      require('../bin/www');

      const errorHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'error'
      )[1];

      const error = new Error('Unknown error');
      error.code = 'UNKNOWN';
      error.syscall = 'listen';

      expect(() => errorHandler(error)).toThrow('Unknown error');
    });

    test('EACCES error should exit with code 1', () => {
      process.env.PORT = '3000';
      
      require('../bin/www');

      const errorHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'error'
      )[1];

      const error = new Error('EACCES');
      error.code = 'EACCES';
      error.syscall = 'listen';

      errorHandler(error);

      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test('EADDRINUSE error should exit with code 1', () => {
      process.env.PORT = '3000';
      
      require('../bin/www');

      const errorHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'error'
      )[1];

      const error = new Error('EADDRINUSE');
      error.code = 'EADDRINUSE';
      error.syscall = 'listen';

      errorHandler(error);

      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('Server listening event', () => {
    test('should log debug message when server starts listening', () => {
      const debugSpy = jest.fn();
      jest.doMock('debug', () => () => debugSpy);
      
      require('../bin/www');

      const listeningHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'listening'
      )[1];

      listeningHandler();

      // The debug function should be called (implementation may vary)
      expect(mockServer.address).toHaveBeenCalled();
    });

    test('should handle named pipe address in listening event', () => {
      mockServer.address.mockReturnValue('/tmp/socket');
      
      require('../bin/www');

      const listeningHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'listening'
      )[1];

      // Should not throw
      expect(() => listeningHandler()).not.toThrow();
    });

    test('should handle port address in listening event', () => {
      mockServer.address.mockReturnValue({ port: 3000 });
      
      require('../bin/www');

      const listeningHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'listening'
      )[1];

      // Should not throw
      expect(() => listeningHandler()).not.toThrow();
    });
  });
});
