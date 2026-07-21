import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '蒲华堂 | 五行康养·戏曲疗愈',
    template: '%s | 蒲华堂',
  },
  description: '输入生辰，开启专属康养方案。融合五行养生、蒲剧戏曲、节气智慧，传承东方康养之道。',
  keywords: ['蒲华堂', '五行康养', '戏曲疗愈', '蒲剧', '节气养生', '八字排盘'],
  authors: [{ name: '蒲华堂' }],
  openGraph: {
    title: '蒲华堂 | 五行康养·戏曲疗愈',
    description: '输入生辰，开启专属康养方案。融合五行养生、蒲剧戏曲、节气智慧。',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#F5F0E8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-[family-name:var(--font-sans)] text-[var(--foreground)] bg-[var(--background)]">
        <div className="relative z-[1] min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
