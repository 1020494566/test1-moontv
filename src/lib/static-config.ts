/* eslint-disable @typescript-eslint/no-explicit-any */

// 静态配置文件 - EdgeOne 部署专用
// 在这里直接设置明文密码和所有配置，不使用环境变量

export const STATIC_CONFIG = {
  // ===== 核心认证配置 =====
  // 系统登录密码（明文设置）
  PASSWORD: '123...qqqA',

  // 管理员用户名
  USERNAME: 'admin',

  // ===== 站点基本配置 =====
  // 站点名称
  SITE_NAME: 'MoonTV',

  // 公告内容
  ANNOUNCEMENT: '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。',

  // ===== 功能配置 =====
  // 存储类型: 'localstorage' | 'redis' | 'd1' | 'upstash'
  STORAGE_TYPE: 'localstorage' as 'localstorage' | 'redis' | 'd1' | 'upstash',

  // 是否允许用户注册
  ENABLE_REGISTER: false,

  // 搜索最大页数
  SEARCH_MAX_PAGE: 5,

  // 图片代理地址（可选）
  IMAGE_PROXY: '',

  // 豆瓣代理地址（可选）
  DOUBAN_PROXY: '',

  // 是否禁用黄色内容过滤器
  DISABLE_YELLOW_FILTER: false,

  // ===== EdgeOne 专用配置 =====
  // 是否为 EdgeOne 环境
  IS_EDGEONE: true,

  // 是否为 Docker 环境（EdgeOne 上设为 false）
  IS_DOCKER: false,

  // ===== 数据库配置（如果使用外部数据库）=====
  // Redis 配置（当 STORAGE_TYPE 为 'redis' 时使用）
  REDIS: {
    URL: '', // 如果使用 Redis，在这里设置连接字符串
    HOST: '',
    PORT: 6379,
    PASSWORD: '',
    DB: 0,
  },

  // Upstash Redis 配置（当 STORAGE_TYPE 为 'upstash' 时使用）
  UPSTASH: {
    REDIS_REST_URL: '', // Upstash Redis REST URL
    REDIS_REST_TOKEN: '', // Upstash Redis REST Token
  },

  // D1 数据库配置（当 STORAGE_TYPE 为 'd1' 时使用）
  D1: {
    DATABASE_ID: '', // D1 数据库 ID
  },

  // ===== 高级配置 =====
  // 缓存时间（秒）
  CACHE_TIME: 7200,

  // 是否启用调试模式
  DEBUG: false,

  // API 请求超时时间（毫秒）
  API_TIMEOUT: 30000,

  // 最大并发搜索数
  MAX_CONCURRENT_SEARCHES: 5,
};

// 类型定义
export type StaticConfigType = typeof STATIC_CONFIG;

// 获取配置的辅助函数
export function getStaticConfig(): StaticConfigType {
  return STATIC_CONFIG;
}

// 验证配置的函数
export function validateConfig(): boolean {
  const config = getStaticConfig();

  // 检查必需的配置项
  if (!config.PASSWORD || config.PASSWORD === 'your_secure_password_2024!') {
    console.error('❌ 请在 src/lib/static-config.ts 中设置安全的密码！');
    return false;
  }

  if (!config.USERNAME) {
    console.error('❌ 请在 src/lib/static-config.ts 中设置管理员用户名！');
    return false;
  }

  if (!config.SITE_NAME) {
    console.error('❌ 请在 src/lib/static-config.ts 中设置站点名称！');
    return false;
  }

  // 检查存储类型相关配置
  if (config.STORAGE_TYPE === 'redis' && !config.REDIS.URL && !config.REDIS.HOST) {
    console.error('❌ 使用 Redis 存储时，请配置 Redis 连接信息！');
    return false;
  }

  if (config.STORAGE_TYPE === 'upstash' && (!config.UPSTASH.REDIS_REST_URL || !config.UPSTASH.REDIS_REST_TOKEN)) {
    console.error('❌ 使用 Upstash 存储时，请配置 Upstash 连接信息！');
    return false;
  }

  console.log('✅ 静态配置验证通过');
  return true;
}

// 导出一些常用的配置项，方便其他地方使用
export const {
  PASSWORD,
  USERNAME,
  SITE_NAME,
  ANNOUNCEMENT,
  STORAGE_TYPE,
  ENABLE_REGISTER,
  SEARCH_MAX_PAGE,
  IMAGE_PROXY,
  DOUBAN_PROXY,
  DISABLE_YELLOW_FILTER,
  IS_EDGEONE,
  IS_DOCKER,
  CACHE_TIME,
} = STATIC_CONFIG;
