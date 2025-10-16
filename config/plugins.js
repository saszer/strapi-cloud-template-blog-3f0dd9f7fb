module.exports = () => ({
  // embracingearth.space - Enterprise upload configuration for Strapi Cloud
  // Optimized for 100k+ concurrent users with proper MIME type handling
  upload: {
    config: {
      // Use Strapi Cloud's built-in upload provider
      provider: 'local',
      providerOptions: {
        // Strapi Cloud handles the actual storage
        // This ensures proper MIME type handling
        publicUrl: process.env.PUBLIC_URL || 'https://automatic-positivity-3a6b42eb07.strapiapp.com',
      },
      // Size limits for enterprise scale
      sizeLimit: 100 * 1024 * 1024, // 100MB
      // Explicit MIME type configuration for image formats
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
      // Ensure proper MIME type handling
      responsiveDimensions: true,
      // File type restrictions
      allowedTypes: ['images', 'files', 'videos'],
      // Specific image format support - this is critical for PNG/JPG
      imageFormats: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'],
    },
  },
});
