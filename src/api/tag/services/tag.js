/**
 * tag service
 * embracingearth.space - Enterprise-grade scalable service architecture
 */

'use strict';

/**
 * tag service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tag.tag');

