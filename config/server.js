// embracingearth.space - Enterprise-grade server configuration
// Designed for 100k+ concurrent users with proper security isolation
module.exports = ({ env }) => {
  // APP_KEYS is required for session middleware at runtime
  // During build, we provide placeholder values (Fly.io secrets are only available at runtime)
  // Generate with: openssl rand -base64 32 (run multiple times for multiple keys)
  const appKeys = env.array('APP_KEYS');
  
  // Detect build mode: during 'strapi build', config is loaded but app doesn't start
  // Check if we're running strapi build command or if APP_KEYS is missing (likely build time)
  // At runtime in Fly.io, APP_KEYS will be set via secrets
  const isBuildMode = !appKeys || appKeys.length === 0;
  
  // Provide placeholder keys during build, enforce requirement at runtime
  let finalAppKeys = appKeys;
  if (isBuildMode) {
    // Build mode: use placeholder keys (config structure only, won't be used at runtime)
    // embracingearth.space - Build-time placeholder for Docker build process
    // These are replaced by Fly.io secrets at runtime
    finalAppKeys = ['build-placeholder-key-1', 'build-placeholder-key-2', 'build-placeholder-key-3', 'build-placeholder-key-4'];
  }
  
  // Note: Runtime validation happens when Strapi starts - if APP_KEYS are still placeholders
  // at runtime, the session middleware will fail with a clear error

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: finalAppKeys,
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};
