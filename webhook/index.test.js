const { handler } = require('./index');

// Mock the googleapis
jest.mock('googleapis', () => ({
  google: {
    calendar: jest.fn().mockReturnValue({
      events: {
        insert: jest.fn().mockResolvedValue({})
      }
    })
  }
}));

// Mock all utility functions
jest.mock('./utils', () => ({
  getUserByTelegramId: jest.fn(),
  sendTelegramMessage: jest.fn(),
  generateAuthUrl: jest.fn(),
  getOAuthClient: jest.fn(),
  fetchImageFromMessage: jest.fn(),
  notifyDeniz: jest.fn()
}));

// Mock OpenAI functions
jest.mock('./openai-text', () => ({
  openAIProcessText: jest.fn()
}));

jest.mock('./openai-image', () => ({
  openAIProcessImage: jest.fn()
}));

const {
  getUserByTelegramId,
  sendTelegramMessage,
  generateAuthUrl,
  getOAuthClient,
  fetchImageFromMessage,
  notifyDeniz
} = require('./utils');

const { openAIProcessText } = require('./openai-text');
const { openAIProcessImage } = require('./openai-image');

describe('Webhook Handler', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset environment variables
    process.env = {};
    
    // Setup default mock implementations
    getOAuthClient.mockReturnValue({
      setCredentials: jest.fn()
    });

    // Setup default Promise resolutions for async functions
    sendTelegramMessage.mockResolvedValue();
    notifyDeniz.mockResolvedValue();
  });

  it('should handle text message successfully', async () => {
    // Mock user data
    const mockUser = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    };
    getUserByTelegramId.mockResolvedValue(mockUser);

    // Mock OpenAI response
    const mockEventData = {
      parsed: true,
      events: [{
        start: { dateTime: '2024-03-20T10:00:00' },
        end: { dateTime: '2024-03-20T11:00:00' },
        summary: 'Test Event'
      }],
      report: 'Event created successfully!'
    };
    openAIProcessText.mockResolvedValue(mockEventData);

    // Mock Telegram incoming message
    const event = {
      body: JSON.stringify({
        message: {
          chat: { id: '123456' },
          text: 'Schedule a meeting tomorrow at 10am'
        }
      })
    };

    const response = await handler(event);

    // Verify the response
    expect(response).toEqual({ statusCode: 200, body: 'OK' });

    // Verify function calls
    expect(getUserByTelegramId).toHaveBeenCalledWith('123456');
    expect(openAIProcessText).toHaveBeenCalledWith('Schedule a meeting tomorrow at 10am');
    expect(sendTelegramMessage).toHaveBeenCalledWith('123456', 'Event created successfully!');
  });

  it('should handle image message successfully', async () => {
    // Mock user data
    const mockUser = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    };
    getUserByTelegramId.mockResolvedValue(mockUser);

    // Mock image processing
    const mockBase64Image = 'base64-image-data';
    fetchImageFromMessage.mockResolvedValue(mockBase64Image);

    // Mock OpenAI response
    const mockEventData = {
      parsed: true,
      events: [{
        start: { dateTime: '2024-03-20T10:00:00' },
        end: { dateTime: '2024-03-20T11:00:00' },
        summary: 'Test Event from Image'
      }],
      report: 'Event created from image!'
    };
    openAIProcessImage.mockResolvedValue(mockEventData);

    // Mock Telegram incoming message with photo
    const event = {
      body: JSON.stringify({
        message: {
          chat: { id: '123456' },
          photo: [{ file_id: 'photo123' }]
        }
      })
    };

    const response = await handler(event);

    // Verify the response
    expect(response).toEqual({ statusCode: 200, body: 'OK' });

    // Verify function calls
    expect(getUserByTelegramId).toHaveBeenCalledWith('123456');
    expect(fetchImageFromMessage).toHaveBeenCalled();
    expect(openAIProcessImage).toHaveBeenCalledWith(mockBase64Image);
    expect(sendTelegramMessage).toHaveBeenCalledWith('123456', 'Event created from image!');
  });

  // it('should handle new user authentication', async () => {
  //   // Set environment to prod
  //   process.env.ENVIRONMENT = 'prod';

  //   // Mock no existing user
  //   getUserByTelegramId.mockResolvedValue(null);

  //   // Mock auth URL
  //   const mockAuthUrl = 'https://mock-auth-url';
  //   generateAuthUrl.mockReturnValue(mockAuthUrl);

  //   // Mock Telegram incoming message
  //   const event = {
  //     body: JSON.stringify({
  //       message: {
  //         chat: { id: '123456' },
  //         text: 'Hello'
  //       }
  //     })
  //   };

  //   try {
  //     const response = await handler(event);
  //     // Verify the response
  //     expect(response).toEqual({ statusCode: 200, body: 'Auth link sent' });

  //     // Verify function calls in order
  //     expect(getUserByTelegramId).toHaveBeenCalledWith('123456');
  //     expect(generateAuthUrl).toHaveBeenCalledWith('123456');
  //     expect(notifyDeniz).toHaveBeenCalledWith('new user!');
  //     expect(sendTelegramMessage).toHaveBeenCalledWith(
  //       '123456',
  //       expect.stringContaining('connect your Google account')
  //     );
  //   } catch (error) {
  //     console.error('Test failed with error:', {
  //       message: error.message,
  //       stack: error.stack,
  //       error: JSON.stringify(error, null, 2)
  //     });
  //     throw error; // Re-throw to make the test fail
  //   }
  // });

  it('should handle invalid_grant error', async () => {
    // Mock user data
    const mockUser = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    };
    getUserByTelegramId.mockResolvedValue(mockUser);

    // Mock OpenAI to throw invalid_grant error
    openAIProcessText.mockRejectedValue({
      response: {
        data: {
          error: 'invalid_grant'
        }
      }
    });

    // Mock auth URL
    const mockAuthUrl = 'https://mock-auth-url';
    generateAuthUrl.mockReturnValue(mockAuthUrl);

    // Mock Telegram incoming message
    const event = {
      body: JSON.stringify({
        message: {
          chat: { id: '123456' },
          text: 'Hello'
        }
      })
    };

    const response = await handler(event);

    // Verify the response
    expect(response).toEqual({ statusCode: 200, body: 'Auth link sent' });

    // Verify function calls
    expect(sendTelegramMessage).toHaveBeenCalledWith(
      '123456',
      expect.stringContaining('reconnect your Google account')
    );
  });
}); 