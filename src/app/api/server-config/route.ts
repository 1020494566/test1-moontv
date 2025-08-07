/* eslint-disable no-console */

import { NextRequest, NextResponse } from 'next/server';

import { getConfig } from '@/lib/config';
import { getStaticConfig } from '@/lib/static-config';

export const runtime = 'experimental-edge';

export async function GET(request: NextRequest) {
  console.log('server-config called: ', request.url);

  const config = await getConfig();
  const result = {
    SiteName: config.SiteConfig.SiteName,
    StorageType: getStaticConfig().STORAGE_TYPE,
  };
  return NextResponse.json(result);
}
