const rateLimit = require('express-rate-limit');

// In development, skip rate limiting so developers don't get blocked or slowed down
const isDev = process.env.NODE_ENV === 'development';

// General API rate limiter - applies to all API routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  skip: () => isDev,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  skip: () => isDev,
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Strict rate limiter for user registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  skip: () => isDev,
  message: {
    error: 'Too many registration attempts, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many registration attempts, please try again later.',
      retryAfter: '1 hour'
    });
  }
});

// Moderate rate limiter for user management endpoints
const userManagementLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  skip: () => isDev,
  message: {
    error: 'Too many user management requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many user management requests, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Rate limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  skip: () => isDev,
  message: {
    error: 'Too many file uploads, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many file uploads, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Rate limiter for search endpoints
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  skip: () => isDev,
  message: {
    error: 'Too many search requests, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many search requests, please try again later.',
      retryAfter: '1 minute'
    });
  }
});

// Rate limiter for order operations
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  skip: () => isDev,
  message: {
    error: 'Too many order operations, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many order operations, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  registerLimiter,
  userManagementLimiter,
  uploadLimiter,
  searchLimiter,
  orderLimiter
};
