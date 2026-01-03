'use strict';
const bootstrap = require("./bootstrap");

module.exports = {
  /**
   * Register custom routes and middleware
   * embracingearth.space - Enterprise-grade health check for Fly.io monitoring
   */
  register({ strapi }) {
    // Health check is handled by custom middleware
    // See src/middlewares/health-check.js
    // embracingearth.space - Enterprise-grade health monitoring
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap,
};
