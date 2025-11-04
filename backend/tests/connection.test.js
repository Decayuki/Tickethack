const mongoose = require('mongoose');

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn()
}));

describe('MongoDB Connection', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Spy on console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Set up environment variable
    process.env.CONNECTION_STRING = 'mongodb://localhost:27017/test';
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('2. MongoDB connection function successfully connects to database', () => {
    test('should call mongoose.connect with correct connection string', () => {
      mongoose.connect.mockResolvedValue();
      
      require('../models/connection');

      expect(mongoose.connect).toHaveBeenCalledWith(
        process.env.CONNECTION_STRING,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      );
    });

    test('should call mongoose.connect exactly once', () => {
      mongoose.connect.mockResolvedValue();
      
      require('../models/connection');

      expect(mongoose.connect).toHaveBeenCalledTimes(1);
    });

    test('should log success message on successful connection', async () => {
      mongoose.connect.mockResolvedValue();
      
      require('../models/connection');

      // Wait for promise to resolve
      await new Promise(process.nextTick);

      expect(consoleLogSpy).toHaveBeenCalledWith('✅ MongoDB connected');
    });

    test('should log error message on connection failure', async () => {
      const mockError = new Error('Connection failed');
      mongoose.connect.mockRejectedValue(mockError);
      
      require('../models/connection');

      // Wait for promise to reject
      await new Promise(process.nextTick);

      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ MongoDB error:', mockError);
    });

    test('should handle missing connection string gracefully', () => {
      delete process.env.CONNECTION_STRING;
      mongoose.connect.mockResolvedValue();
      
      require('../models/connection');

      expect(mongoose.connect).toHaveBeenCalledWith(
        undefined,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      );
    });

    test('should use correct mongoose connection options', () => {
      mongoose.connect.mockResolvedValue();
      
      require('../models/connection');

      const callArgs = mongoose.connect.mock.calls[0];
      expect(callArgs[1]).toHaveProperty('useNewUrlParser', true);
      expect(callArgs[1]).toHaveProperty('useUnifiedTopology', true);
    });
  });
});
