'use strict';

/**
 * Newsletter Subscriber Service
 * 
 * Business logic for newsletter management
 * @see https://embracingearth.space
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::newsletter-subscriber.newsletter-subscriber', ({ strapi }) => ({
  /**
   * Get subscriber statistics
   */
  async getStats() {
    const total = await strapi.entityService.count('api::newsletter-subscriber.newsletter-subscriber');
    
    const confirmed = await strapi.entityService.count('api::newsletter-subscriber.newsletter-subscriber', {
      filters: { status: 'confirmed' }
    });
    
    const pending = await strapi.entityService.count('api::newsletter-subscriber.newsletter-subscriber', {
      filters: { status: 'pending' }
    });

    const unsubscribed = await strapi.entityService.count('api::newsletter-subscriber.newsletter-subscriber', {
      filters: { status: 'unsubscribed' }
    });

    return {
      total,
      confirmed,
      pending,
      unsubscribed,
      conversionRate: total > 0 ? ((confirmed / total) * 100).toFixed(2) : 0
    };
  },

  /**
   * Get subscribers by source
   */
  async getBySource(source) {
    return await strapi.entityService.findMany('api::newsletter-subscriber.newsletter-subscriber', {
      filters: { source },
      sort: { createdAt: 'desc' }
    });
  },

  /**
   * Export subscribers (for email service integration)
   */
  async exportConfirmed() {
    const subscribers = await strapi.entityService.findMany('api::newsletter-subscriber.newsletter-subscriber', {
      filters: { status: 'confirmed' },
      fields: ['email', 'name', 'source', 'subscribedFromPage'],
      sort: { createdAt: 'desc' }
    });

    return subscribers;
  }
}));

