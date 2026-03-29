/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['bolhatech-design-system'],
  // pg usa módulos nativos do Node.js — não deve ser empacotado pelo webpack
  serverExternalPackages: ['pg', 'pg-native'],
};

export default nextConfig;
