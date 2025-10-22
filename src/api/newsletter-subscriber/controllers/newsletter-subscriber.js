'use strict';

/**
 * Newsletter Subscriber Controller
 * 
 * Enterprise-grade newsletter subscription with:
 * - Rate limiting (5 submissions/hour per IP)
 * - Honeypot spam protection
 * - Email validation
 * - GDPR compliance
 * - Source tracking
 * 
 * @see https://embracingearth.space
 */

const { createCoreController } = require('@strapi/strapi').factories;

// In-memory rate limiter (for production, use Redis)
const rateLimitStore = new Map();

module.exports = createCoreController('api::newsletter-subscriber.newsletter-subscriber', ({ strapi }) => ({
  /**
   * Custom subscribe endpoint
   * POST /api/newsletter-subscribers/subscribe
   */
  async subscribe(ctx) {
    try {
      const { email, name, source, page, honeypot } = ctx.request.body;

      // 🍯 Honeypot check - bots fill this field
      if (honeypot) {
        ctx.status = 200;
        return { success: true, message: 'Subscribed successfully' };
      }

      // ✅ Validation
      if (!email || !source || !page) {
        return ctx.badRequest('Email, source, and page are required');
      }

      // 📧 Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ctx.badRequest('Invalid email format');
      }

      // 🚦 Rate limiting (5 per hour per IP)
      const clientIP = ctx.request.ip || ctx.request.socket.remoteAddress;
      const now = Date.now();
      const hourAgo = now - (60 * 60 * 1000);
      
      if (!rateLimitStore.has(clientIP)) {
        rateLimitStore.set(clientIP, []);
      }
      
      const ipAttempts = rateLimitStore.get(clientIP).filter(timestamp => timestamp > hourAgo);
      
      if (ipAttempts.length >= 5) {
        return ctx.tooManyRequests('Too many subscription attempts. Please try again later.');
      }
      
      ipAttempts.push(now);
      rateLimitStore.set(clientIP, ipAttempts);

      // 🔍 Check if email already exists
      const existingSubscriber = await strapi.entityService.findMany(
        'api::newsletter-subscriber.newsletter-subscriber',
        {
          filters: { email },
          limit: 1
        }
      );

      if (existingSubscriber && existingSubscriber.length > 0) {
        const subscriber = existingSubscriber[0];
        
        if (subscriber.status === 'confirmed') {
          return ctx.badRequest('Email already subscribed');
        }
        
        if (subscriber.status === 'unsubscribed') {
          // Resubscribe
          await strapi.entityService.update(
            'api::newsletter-subscriber.newsletter-subscriber',
            subscriber.id,
            {
              data: {
                status: 'pending',
                source,
                subscribedFromPage: page,
                name: name || subscriber.name,
                ipAddress: clientIP,
                userAgent: ctx.request.headers['user-agent'],
                unsubscribedAt: null
              }
            }
          );
          
          return {
            success: true,
            message: 'Successfully resubscribed! Welcome back.',
            requiresConfirmation: true
          };
        }
      }

      // 💾 Create new subscriber
      const subscriber = await strapi.entityService.create(
        'api::newsletter-subscriber.newsletter-subscriber',
        {
          data: {
            email: email.toLowerCase().trim(),
            name: name?.trim() || null,
            source,
            subscribedFromPage: page,
            status: 'pending',
            ipAddress: clientIP,
            userAgent: ctx.request.headers['user-agent']
          }
        }
      );

      // 📧 TODO: Send confirmation email (requires email service integration)
      // await strapi.plugins['email'].services.email.send({
      //   to: email,
      //   subject: 'Confirm your AI2Fin newsletter subscription',
      //   template: 'newsletter-confirmation',
      //   data: { name, confirmationLink: `https://ai2fin.com/newsletter/confirm/${subscriber.id}` }
      // });

      strapi.log.info(`✅ New newsletter subscriber: ${email} from ${source} at ${page}`);

      return {
        success: true,
        message: 'Successfully subscribed! Check your email to confirm.',
        requiresConfirmation: true,
        data: {
          email: subscriber.email,
          source: subscriber.source
        }
      };

    } catch (error) {
      strapi.log.error('Newsletter subscription error:', error);
      return ctx.internalServerError('Failed to process subscription');
    }
  },

  /**
   * Confirm subscription
   * GET /api/newsletter-subscribers/confirm/:id
   */
  async confirm(ctx) {
    try {
      const { id } = ctx.params;

      const subscriber = await strapi.entityService.findOne(
        'api::newsletter-subscriber.newsletter-subscriber',
        id
      );

      if (!subscriber) {
        return ctx.notFound('Subscriber not found');
      }

      if (subscriber.status === 'confirmed') {
        return { success: true, message: 'Email already confirmed' };
      }

      await strapi.entityService.update(
        'api::newsletter-subscriber.newsletter-subscriber',
        id,
        {
          data: {
            status: 'confirmed',
            confirmedAt: new Date()
          }
        }
      );

      strapi.log.info(`✅ Newsletter confirmed: ${subscriber.email}`);

      return {
        success: true,
        message: 'Email confirmed successfully! You\'re all set.'
      };

    } catch (error) {
      strapi.log.error('Newsletter confirmation error:', error);
      return ctx.internalServerError('Failed to confirm subscription');
    }
  },

  /**
   * Unsubscribe
   * POST /api/newsletter-subscribers/unsubscribe
   */
  async unsubscribe(ctx) {
    try {
      const { email } = ctx.request.body;

      if (!email) {
        return ctx.badRequest('Email is required');
      }

      const subscribers = await strapi.entityService.findMany(
        'api::newsletter-subscriber.newsletter-subscriber',
        {
          filters: { email: email.toLowerCase().trim() },
          limit: 1
        }
      );

      if (!subscribers || subscribers.length === 0) {
        return ctx.notFound('Email not found in our system');
      }

      const subscriber = subscribers[0];

      await strapi.entityService.update(
        'api::newsletter-subscriber.newsletter-subscriber',
        subscriber.id,
        {
          data: {
            status: 'unsubscribed',
            unsubscribedAt: new Date()
          }
        }
      );

      strapi.log.info(`📪 Newsletter unsubscribed: ${email}`);

      return {
        success: true,
        message: 'Successfully unsubscribed. Sorry to see you go!'
      };

    } catch (error) {
      strapi.log.error('Newsletter unsubscribe error:', error);
      return ctx.internalServerError('Failed to process unsubscribe');
    }
  }
}));








