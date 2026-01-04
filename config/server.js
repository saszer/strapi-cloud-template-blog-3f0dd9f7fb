// embracingearth.space - Enterprise-grade server configuration
// Designed for 100k+ concurrent users with proper security isolation
module.exports = ({ env }) => {
  // APP_KEYS is required for session middleware
  // Generate with: openssl rand -base64 32 (run multiple times for multiple keys)
  const appKeys = env.array('APP_KEYS');
  
  if (!appKeys || appKeys.length === 0) {
    throw new Error(
      'APP_KEYS environment variable is required. ' +
      'Set it in Fly.io secrets: fly secrets set APP_KEYS="key1,key2,key3,key4" ' +
      'Generate keys with: openssl rand -base64 32'
    );
  }

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: appKeys,
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};
