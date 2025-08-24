const withNextIntl = require('next-intl/plugin')(
  // This is the default location for the i18n config
  './src/i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 con Botpress 3.2.0 no necesita configuraciones especiales
};

module.exports = withNextIntl(nextConfig);