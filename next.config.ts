import originalExport from './next.config.original'
import type { NextConfig } from 'next'

// 仅在 EdgeOne 平台注入其专用图片加载器，其他平台（Vercel、本地）使用 Next.js 默认加载器
const isEdgeOne = process.env.EDGEONE_PLATFORM === 'true'

let config: NextConfig;
if (typeof originalExport === 'function') {
  // Function-style config: (phase, context) => NextConfig
  // Wrap it to inject images config after resolution
  const origFn = originalExport as any;
  config = ((...args: any[]) => {
    const resolved = origFn(...args);
    if (resolved && typeof resolved.then === 'function') {
      return (resolved as Promise<NextConfig>).then((c: any) => {
        if (isEdgeOne) {
          c.images = { ...c.images, loader: 'custom', loaderFile: './.edgeone/image-loader.mjs' };
        }
        return c;
      });
    }
    if (isEdgeOne) {
      (resolved as any).images = { ...(resolved as any).images, loader: 'custom', loaderFile: './.edgeone/image-loader.mjs' };
    }
    return resolved;
  }) as any;
} else {
  config = { ...(originalExport as any) };
  if (isEdgeOne) {
    config.images = { ...config.images, loader: 'custom', loaderFile: './.edgeone/image-loader.mjs' };
  }
}

export default config;
