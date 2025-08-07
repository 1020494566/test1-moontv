# EdgeOne 部署配置问题解决方案

## 🚨 **问题诊断**

根据错误信息：`x-cos-error-detail-key: test-moontv-v2-q5ymmdvv2x/login.html`

**问题原因**：EdgeOne 将项目错误识别为静态网站，而不是 Next.js 应用。

## ✅ **解决方案**

### **方案一：在 EdgeOne 控制台修改配置**

1. **登录 EdgeOne 控制台**
2. **找到项目 `test-moontv-v2`**
3. **进入 "项目设置" → "构建配置"**
4. **修改以下配置**：

```yaml
# 错误配置（当前状态）
项目类型: 静态网站 ❌

# 正确配置
项目类型: Web 应用 ✅
构建框架: Next.js ✅
构建命令: npm run build
构建输出目录: .next
Node.js 版本: 20.x
包管理器: npm
根目录: /
```

### **方案二：重新创建项目（推荐）**

如果无法修改现有配置：

1. **删除当前项目**
2. **重新创建项目时选择**：
   - ✅ **Web 应用**（不是静态网站）
   - ✅ **Next.js**
   - ✅ 连接相同的 GitHub 仓库

### **方案三：使用 package.json 脚本配置**

在你的 `package.json` 中添加：

```json
{
  "scripts": {
    "build": "npm run gen:runtime && npm run gen:manifest && next build",
    "start": "next start"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 🔧 **EdgeOne 特殊配置说明**

### **核心差异**

**静态网站模式**（错误）：
- 寻找 `.html` 文件
- 使用对象存储（COS）
- 不支持服务端渲染
- 不支持 API 路由

**Next.js 应用模式**（正确）：
- 支持动态路由（`/login`）
- 支持 API 路由（`/api/login`）
- 支持服务端渲染
- 正确处理 Next.js 构建输出

### **验证方法**

配置正确后，以下 URL 都应该正常工作：

- ✅ `https://test-moontv-v2.edgeone.app/`
- ✅ `https://test-moontv-v2.edgeone.app/login`
- ✅ `https://test-moontv-v2.edgeone.app/api/login`（POST 请求）

### **错误识别标志**

如果看到以下错误，说明仍然是静态网站模式：
- `x-cos-error-detail-key` 包含 `.html` 后缀
- 寻找 `login.html` 而不是 `/login`
- 所有页面都返回 404

## 📋 **立即行动清单**

1. [ ] 确认当前项目是否为 "Web 应用" 类型
2. [ ] 确认构建框架是否选择 "Next.js"
3. [ ] 确认构建输出目录是 `.next`
4. [ ] 重新部署测试
5. [ ] 验证所有页面和 API 正常工作

## 🎯 **预期结果**

配置正确后：
- 首页加载正常：包含 MoonTV 界面
- 登录页面正常：可以输入密码 `123...qqqA`
- 登录功能正常：可以成功登录进入系统
- API 响应正常：不再返回 404

---

**这是一个配置问题，不是代码问题。你的代码构建完全正常！**
