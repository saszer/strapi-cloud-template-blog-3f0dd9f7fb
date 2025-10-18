'use strict';

/**
 * Newsletter Subscriber Routes
 * 
 * Custom routes for newsletter subscription system
 * @see https://embracingearth.space
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/newsletter-subscribers/subscribe',
      handler: 'newsletter-subscriber.subscribe',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/newsletter-subscribers/confirm/:id',
      handler: 'newsletter-subscriber.confirm',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/newsletter-subscribers/unsubscribe',
      handler: 'newsletter-subscriber.unsubscribe',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    }
  ]
};

