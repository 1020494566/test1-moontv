/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import { getConfig } from '@/lib/config';
import { getStaticConfig } from '@/lib/static-config';

import { GlobalErrorIndicator } from '../components/GlobalErrorIndicator';
import { SiteProvider } from '../components/SiteProvider';
import { ThemeProvider } from '../components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

// 动态生成 metadata，支持配置更新后的标题变化
export async function generateMetadata(): Promise<Metadata> {
  const staticConfig = getStaticConfig();
  let siteName = staticConfig.SITE_NAME;

  if (staticConfig.STORAGE_TYPE !== 'd1' && staticConfig.STORAGE_TYPE !== 'upstash') {
    try {
      const config = await getConfig();
      siteName = config.SiteConfig.SiteName;
    } catch (error) {
      console.warn('Failed to load dynamic config, using static config:', error);
    }
  }

  return {
    title: siteName,
    description: '影视聚合',
    manifest: '/manifest.json',
  };
}

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staticConfig = getStaticConfig();
  let siteName = staticConfig.SITE_NAME;
  let announcement = staticConfig.ANNOUNCEMENT;
  let enableRegister = staticConfig.ENABLE_REGISTER;
  let imageProxy = staticConfig.IMAGE_PROXY;
  let doubanProxy = staticConfig.DOUBAN_PROXY;
  let disableYellowFilter = staticConfig.DISABLE_YELLOW_FILTER;
  let customCategories: Array<{ name: string; type: 'movie' | 'tv'; query: string }> = [];
  if (staticConfig.STORAGE_TYPE !== 'd1' && staticConfig.STORAGE_TYPE !== 'upstash') {
    try {
      const config = await getConfig();
      siteName = config.SiteConfig.SiteName;
      announcement = config.SiteConfig.Announcement;
      enableRegister = config.UserConfig.AllowRegister;
      imageProxy = config.SiteConfig.ImageProxy;
      doubanProxy = config.SiteConfig.DoubanProxy;
      disableYellowFilter = config.SiteConfig.DisableYellowFilter;
      customCategories = config.CustomCategories.filter(
        (category) => !category.disabled
      ).map((category) => ({
        name: category.name || '',
        type: category.type,
        query: category.query,
      }));
    } catch (error) {
      console.warn('Failed to load dynamic config, using static config:', error);
    }
  }

  // 将运行时配置注入到全局 window 对象，供客户端在运行时读取
  const runtimeConfig = {
    STORAGE_TYPE: staticConfig.STORAGE_TYPE,
    ENABLE_REGISTER: enableRegister,
    IMAGE_PROXY: imageProxy,
    DOUBAN_PROXY: doubanProxy,
    DISABLE_YELLOW_FILTER: disableYellowFilter,
    CUSTOM_CATEGORIES: customCategories,
  };

  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, viewport-fit=cover'
        />
        {/* 将配置序列化后直接写入脚本，浏览器端可通过 window.RUNTIME_CONFIG 获取 */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.RUNTIME_CONFIG = ${JSON.stringify(runtimeConfig)};`,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-200`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SiteProvider siteName={siteName} announcement={announcement}>
            {children}
            <GlobalErrorIndicator />
          </SiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
