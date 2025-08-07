/* eslint-disable no-console */

import { NextRequest, NextResponse } from 'next/server';

import { AdminConfigResult } from '@/lib/admin.types';
import { getAuthInfoFromCookie } from '@/lib/auth';
import { getConfig } from '@/lib/config';
import { getStaticConfig } from '@/lib/static-config';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const staticConfig = getStaticConfig();
  const storageType = staticConfig.STORAGE_TYPE;

  // localstorage 模式：返回基于静态配置的管理员配置
  if (storageType === 'localstorage') {
    const authInfo = getAuthInfoFromCookie(request);
    if (!authInfo || !authInfo.password || authInfo.password !== staticConfig.PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 为 localstorage 模式创建基本配置
    const basicConfig = {
      SiteConfig: {
        SiteName: staticConfig.SITE_NAME,
        Announcement: staticConfig.ANNOUNCEMENT,
        SearchDownstreamMaxPage: staticConfig.SEARCH_MAX_PAGE,
        SiteInterfaceCacheTime: staticConfig.CACHE_TIME,
        ImageProxy: staticConfig.IMAGE_PROXY,
        DoubanProxy: staticConfig.DOUBAN_PROXY,
        DisableYellowFilter: staticConfig.DISABLE_YELLOW_FILTER,
      },
      UserConfig: {
        AllowRegister: staticConfig.ENABLE_REGISTER,
        Users: [], // localstorage 模式不支持多用户
      },
      SourceConfig: [], // localstorage 模式使用默认视频源
      CustomCategories: [], // 使用默认分类
    };

    const result: AdminConfigResult = {
      Role: 'owner', // localstorage 模式下都是 owner
      Config: basicConfig,
    };

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }

  const authInfo = getAuthInfoFromCookie(request);
  if (!authInfo || !authInfo.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const username = authInfo.username;

  try {
    const config = await getConfig();
    const result: AdminConfigResult = {
      Role: 'owner',
      Config: config,
    };
    if (username === staticConfig.USERNAME) {
      result.Role = 'owner';
    } else {
      const user = config.UserConfig.Users.find((u) => u.username === username);
      if (user && user.role === 'admin') {
        result.Role = 'admin';
      } else {
        return NextResponse.json(
          { error: '你是管理员吗你就访问？' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store', // 管理员配置不缓存
      },
    });
  } catch (error) {
    console.error('获取管理员配置失败:', error);
    return NextResponse.json(
      {
        error: '获取管理员配置失败',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
