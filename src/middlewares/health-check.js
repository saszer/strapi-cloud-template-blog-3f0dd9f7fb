'use strict';

/**
 * Health Check Middleware
 * embracingearth.space - Enterprise-grade health monitoring for Fly.io
 * Lightweight endpoint that doesn't require database connection
 */

module.exports = () => {
  return async (ctx, next) => {
    // Only handle /_health endpoint
    if (ctx.path === '/_health' && ctx.method === 'GET') {
      try {
        // Basic health check - just verify server is responding
        // For more comprehensive check, test database connection
        ctx.status = 200;
        ctx.body = {
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        };
        return;
      } catch (error) {
        ctx.status = 503;
        ctx.body = {
          status: 'error',
          message: 'Service unavailable',
        };
        return;
      }
    }
    
    // Continue to next middleware for other routes
    await next();
  };
};
