import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 所有图片资源已下载到 public/images/ 目录，使用本地路径无需外部域名白名单
  // 如需恢复外部图片引用，请在此处添加 remotePatterns
};

export default nextConfig;
