# MoonTV EdgeOne 部署完整指南 🚀

## 🎯 **项目概述**

MoonTV 是一个基于 Next.js 14 的影视聚合网站，支持多种视频源聚合搜索和播放。本指南将详细介绍如何将项目部署到腾讯云 EdgeOne 平台。

## 📋 **部署前准备**

### 系统要求
- Node.js 18+ 
- npm 或 yarn
- Git
- 腾讯云 EdgeOne 账号

### 项目特点
- ✅ 使用 Next.js 14 App Router
- ✅ 支持 localstorage 模式（无需数据库）
- ✅ 内置 PWA 支持
- ✅ 响应式设计
- ✅ 多视频源聚合

## 🛠️ **关键问题修复记录**

在部署过程中遇到并解决了以下关键问题：

### 1. **登录 401 错误修复**
**问题**: 中间件拦截所有 `/api` 请求导致登录失败
**解决**: 修改 `src/middleware.ts`，将登录相关 API 路径加入白名单

```typescript
// 修改前：所有 /api 路径都被拦截
// 修改后：允许登录相关 API 通过
const noAuthPaths = [
  '/login',
  '/warning',
  '/api/login',        // ✅ 新增
  '/api/register',     // ✅ 新增
  '/api/debug-login',  // ✅ 新增
];
```

### 2. **静态配置优化**
**文件**: `src/lib/static-config.ts`
**用途**: EdgeOne 部署专用配置，避免环境变量依赖

### 3. **API 路由调试增强**
**文件**: `src/app/api/login/route.ts`
**增加**: 详细的调试日志，便于问题排查

## 🔐 **密码配置说明**

### 如何修改登录密码？

**是的，只需要修改 `src/lib/static-config.ts` 文件中的密码即可：**

```typescript
export const STATIC_CONFIG = {
  // ===== 核心认证配置 =====
  // 系统登录密码（明文设置）
  PASSWORD: '你的新密码',  // 👈 在这里修改密码
  
  // 管理员用户名
  USERNAME: 'admin',
  
  // 其他配置...
};
```

### 密码安全建议
- 使用强密码（包含字母、数字、特殊字符）
- 定期更换密码
- 不要使用默认密码 `123...qqqA`

### 当前默认登录信息
- **用户名**: 不需要（localstorage 模式）
- **密码**: `123...qqqA`

## 📁 **项目文件结构**

```
MoonTV/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── login/route.ts          # 登录 API
│   │   │   ├── register/route.ts       # 注册 API
│   │   │   └── debug-login/route.ts    # 调试用登录 API
│   │   ├── login/page.tsx              # 登录页面
│   │   ├── layout.tsx                  # 全局布局
│   │   └── page.tsx                    # 首页
│   ├── components/                     # React 组件
│   ├── lib/
│   │   ├── static-config.ts            # 静态配置（重要）
│   │   ├── auth.ts                     # 认证逻辑
│   │   ├── config.ts                   # 动态配置
│   │   └── runtime.ts                  # 运行时配置
│   └── middleware.ts                   # 中间件（已修复）
├── public/
│   ├── manifest.json                   # PWA 配置
│   └── icons/                          # 应用图标
├── package.json                        # 依赖配置
├── next.config.js                      # Next.js 配置
└── README.md                           # 项目说明
```

## 🚀 **EdgeOne 部署步骤**

### 第一步：准备代码

1. **确认所有修改已保存**
   ```bash
   # 查看修改状态
   git status
   ```

2. **提交所有更改**
   ```bash
   git add .
   git commit -m "修复登录问题，准备 EdgeOne 部署"
   git push origin main
   ```

### 第二步：EdgeOne 平台配置

1. **登录腾讯云控制台**
   - 访问：https://console.cloud.tencent.com/edgeone
   - 进入 EdgeOne 服务

2. **创建站点**
   - 点击"创建站点"
   - 输入你的域名（如：`moontv.example.com`）
   - 选择"免费版"或"标准版"

3. **配置 DNS**
   - 按照 EdgeOne 提供的 NS 记录配置你的域名 DNS
   - 等待 DNS 生效（通常 10-30 分钟）

### 第三步：配置静态网站托管

1. **进入静态网站托管**
   - 在 EdgeOne 控制台，找到"静态网站托管"
   - 点击"创建项目"

2. **填写项目信息**
   ```yaml
   项目名称: MoonTV
   描述: 影视聚合网站
   框架类型: Next.js
   ```

3. **配置构建设置** ⚠️ **关键配置**
   ```yaml
   项目类型: Web应用 (不是静态网站!)
   构建框架: Next.js
   构建命令: npm run build
   构建输出目录: .next
   Node.js 版本: 20.x
   包管理器: npm
   根目录: /
   环境变量: 无需配置（使用静态配置）
   ```
   
   **⚠️ 重要提醒：**
   - 必须选择 "Web应用" 而不是 "静态网站"
   - 必须选择 "Next.js" 框架
   - 输出目录必须是 `.next`

### 第四步：连接代码仓库

1. **选择代码源**
   - GitHub / GitLab / Gitee
   - 授权 EdgeOne 访问你的仓库

2. **选择仓库和分支**
   - 仓库：你的 MoonTV 项目仓库
   - 分支：main 或 master

3. **配置自动部署**
   - 启用"推送时自动部署"
   - 选择部署分支：main

### 第五步：部署执行

1. **开始部署**
   - 点击"立即部署"
   - 等待构建过程完成

2. **预期构建日志**
   ```
   ✅ Installing dependencies (1422 packages)
   ✅ Running gen:runtime → 已生成 src/lib/runtime.ts  
   ✅ Running gen:manifest → Generated manifest.json
   ✅ Creating optimized production build
   ✅ Compiled successfully
   ✅ Build completed
   ✅ Deployment successful
   ```

3. **常见构建问题排查**
   - 如果依赖安装失败：检查 package.json
   - 如果编译错误：检查 TypeScript 类型错误
   - 如果构建超时：优化构建配置

### 第六步：域名配置

1. **配置自定义域名**
   - 在 EdgeOne 控制台添加你的域名
   - 配置 SSL 证书（免费）
   - 设置 CNAME 记录指向 EdgeOne 提供的地址

2. **测试访问**
   - 访问你的域名
   - 确认网站正常加载

## 🧪 **部署后测试**

### 1. **基本功能测试**
- ✅ 网站首页加载
- ✅ 登录功能正常
- ✅ 搜索功能工作
- ✅ 视频播放正常

### 2. **登录测试**
1. 访问登录页面：`https://你的域名/login`
2. 输入密码：`123...qqqA`（或你修改后的密码）
3. 点击登录
4. 应该成功跳转到首页

### 3. **性能测试**
- 页面加载速度
- 搜索响应时间
- CDN 缓存效果

## ⚙️ **高级配置**

### 自定义配置项

在 `src/lib/static-config.ts` 中可以修改的配置：

```typescript
export const STATIC_CONFIG = {
  // ===== 核心认证配置 =====
  PASSWORD: '你的密码',           // 登录密码
  USERNAME: 'admin',             // 管理员用户名
  
  // ===== 站点配置 =====
  SITE_NAME: 'MoonTV',           // 站点名称
  ANNOUNCEMENT: '公告内容',      // 站点公告
  
  // ===== 功能配置 =====
  STORAGE_TYPE: 'localstorage',  // 存储类型
  ENABLE_REGISTER: false,        // 是否允许注册
  SEARCH_MAX_PAGE: 5,           // 搜索最大页数
  
  // ===== 代理配置 =====
  IMAGE_PROXY: '',              // 图片代理地址
  DOUBAN_PROXY: '',             // 豆瓣代理地址
  
  // ===== 其他配置 =====
  DISABLE_YELLOW_FILTER: false, // 是否禁用内容过滤
  CACHE_TIME: 7200,             // 缓存时间（秒）
};
```

### 环境变量替代方案

如果你想使用环境变量而不是静态配置，可以：

1. **在 EdgeOne 控制台配置环境变量**
2. **修改 `src/lib/static-config.ts`**
   ```typescript
   export const STATIC_CONFIG = {
     PASSWORD: process.env.MOONTV_PASSWORD || '123...qqqA',
     USERNAME: process.env.MOONTV_USERNAME || 'admin',
     // 其他配置...
   };
   ```

## 🐛 **常见问题解决**

### 1. **404 错误 - EdgeOne 当作静态网站处理**
**现象**: 
- 访问页面显示 404 NOT_FOUND
- 错误信息包含 `x-cos-error-detail-key: xxx/login.html`
- 寻找 `.html` 文件而不是动态路由

**原因**: EdgeOne 错误地将项目识别为静态网站

**解决方案**:
1. **重新创建项目**：
   - 删除当前 EdgeOne 项目
   - 重新创建时选择 "Web应用" → "Next.js"
   - 不要选择 "静态网站"

2. **或修改现有项目配置**：
   - 进入 EdgeOne 控制台
   - 项目设置 → 构建配置
   - 修改 "项目类型" 为 "Web应用"
   - 修改 "构建框架" 为 "Next.js"

3. **确认构建配置**：
   ```yaml
   项目类型: Web应用
   构建框架: Next.js
   构建命令: npm run build
   构建输出目录: .next
   ```

**测试**: 重新部署后访问 `https://你的域名/login`（不是 `/login.html`）

### 2. **登录 401 错误**
**现象**: 登录时返回 401 Unauthorized
**原因**: 中间件拦截了登录 API
**解决**: 已在 `src/middleware.ts` 中修复

### 3. **构建失败**
**现象**: EdgeOne 构建过程中报错
**可能原因**:
- 依赖版本冲突
- TypeScript 类型错误
- 环境变量缺失

**解决方案**:
```bash
# 本地测试构建
npm run build

# 检查依赖
npm audit

# 修复依赖问题
npm audit fix
```

### 4. **页面 404 错误**
**现象**: 部署后访问页面显示 404
**原因**: Next.js 路由配置问题
**解决**: 检查 `next.config.js` 中的路由配置

### 5. **静态资源加载失败**
**现象**: 图片、CSS 等静态资源无法加载
**解决**: 
- 检查 `public` 目录文件
- 确认 CDN 缓存配置
- 检查域名 SSL 证书

## 🔄 **更新部署**

### 代码更新流程
1. **本地修改代码**
2. **测试功能正常**
3. **提交到仓库**
   ```bash
   git add .
   git commit -m "功能更新"
   git push origin main
   ```
4. **EdgeOne 自动重新部署**

### 配置更新
- 修改 `src/lib/static-config.ts`
- 提交代码后会自动重新部署
- 新配置立即生效

## 📊 **监控和维护**

### 性能监控
- EdgeOne 控制台查看访问统计
- 监控页面加载时间
- 查看 CDN 缓存命中率

### 日志查看
- EdgeOne 控制台查看构建日志
- 浏览器开发者工具查看运行时错误
- 服务器日志（如果有）

### 备份建议
- 定期备份代码仓库
- 导出重要配置
- 备份用户数据（如果有）

## 🎉 **部署完成检查清单**

- [ ] 代码已提交到仓库
- [ ] EdgeOne 项目创建成功
- [ ] 构建配置正确
- [ ] 域名 DNS 配置完成
- [ ] SSL 证书配置成功
- [ ] 登录功能测试通过
- [ ] 搜索功能测试通过
- [ ] 视频播放测试通过
- [ ] 移动端适配正常
- [ ] 性能指标达标

## 📞 **技术支持**

### 官方文档
- [EdgeOne 官方文档](https://cloud.tencent.com/document/product/1552)
- [Next.js 官方文档](https://nextjs.org/docs)

### 社区支持
- EdgeOne 开发者社区
- Next.js 中文社区

---

## 🏆 **总结**

通过本指南，你应该能够：

1. ✅ **成功修复登录 401 错误**
2. ✅ **理解项目配置结构**  
3. ✅ **完成 EdgeOne 部署**
4. ✅ **掌握密码修改方法**
5. ✅ **具备问题排查能力**

**关键要点回顾**：
- 密码修改：只需修改 `src/lib/static-config.ts` 中的 `PASSWORD` 字段
- 中间件修复：已解决登录 API 被拦截的问题
- 部署配置：使用静态配置避免环境变量依赖
- 自动部署：代码推送后 EdgeOne 会自动重新部署

**现在你的 MoonTV 项目已经可以成功部署到 EdgeOne 并正常使用了！** 🎉
