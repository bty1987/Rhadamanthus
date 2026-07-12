# Session 一致性问题修复说明

> 修复日期：2025-12-06
> 影响范围：`dlogin.js` 桌面登录页面
> 问题：挑战-响应认证中两次请求 session 不一致

---

## 问题描述

在 `dlogin.js` 中实现挑战-响应认证后，用户报告登录时提示：

```
"登录会话已过期，请刷新页面重试"
```

### 问题原因

`dlogin.js` 中的两个 AJAX 请求：
1. `requestLoginChallenge.do` - 获取 nonce
2. `doLogin.do` - 提交响应哈希

这两个请求的 **session 不一致**，导致后端无法从 session 中获取到第一步存储的 nonce。

### 根本原因

**跨域请求未携带 Cookie**

- `dlogin.js` 使用 `config.communion` 作为 URL 前缀（如 `http://192.168.5.21/`）
- 当页面加载地址与 API 地址不同时（如页面在 `http://localhost:8080/`，API 在 `http://192.168.5.21/`），构成跨域请求
- **浏览器默认不会在跨域 AJAX 请求中携带 Cookie**（包括 JSESSIONID）
- 两次请求没有携带相同的 JSESSIONID，导致后端认为是两个不同的 session

---

## 解决方案

### 修改内容

在 `dlogin.js` 的两个 AJAX 请求中，添加跨域 Cookie 携带配置：

```javascript
xhrFields: {
    withCredentials: true  // 跨域请求携带 cookie（保持 session 一致）
},
crossDomain: true
```

### 修改位置

#### 1. requestLoginChallenge.do 请求（第259-268行）

**修改前**：
```javascript
$.ajax({
    type: "POST",
    dataType: "json",
    url: config.communion + "requestLoginChallenge.do",
    data: { userId: userId },
    success: function (data) {
        // ...
    }
});
```

**修改后**：
```javascript
$.ajax({
    type: "POST",
    dataType: "json",
    url: config.communion + "requestLoginChallenge.do",
    data: { userId: userId },
    xhrFields: {
        withCredentials: true  // 跨域请求携带 cookie（保持 session 一致）
    },
    crossDomain: true,
    success: function (data) {
        // ...
    }
});
```

#### 2. doLogin.do 请求（第282-297行）

**修改前**：
```javascript
$.ajax({
    type: "POST",
    dataType: "json",
    url: config.communion + "doLogin.do",
    data: {
        userId: userId,
        responseHash: responseHash,
        verifyCode: verifyCode,
        company: config.company,
        securityCode: params.securityCode,
    },
    success: function (data) {
        // ...
    }
});
```

**修改后**：
```javascript
$.ajax({
    type: "POST",
    dataType: "json",
    url: config.communion + "doLogin.do",
    data: {
        userId: userId,
        responseHash: responseHash,
        verifyCode: verifyCode,
        company: config.company,
        securityCode: params.securityCode,
    },
    xhrFields: {
        withCredentials: true  // 跨域请求携带 cookie（保持 session 一致）
    },
    crossDomain: true,
    success: function (data) {
        // ...
    }
});
```

---

## 技术原理

### AJAX 跨域请求与 Cookie

#### 同源策略（Same-Origin Policy）

浏览器安全机制，限制不同源之间的资源访问。

**同源条件**（以下三者完全相同）：
- 协议（http/https）
- 域名（或 IP）
- 端口

**示例**：

| 页面地址 | API 地址 | 是否同源 |
|---------|---------|---------|
| `http://localhost:8080/dlogin.html` | `http://localhost:8080/doLogin.do` | ✅ 同源 |
| `http://localhost:8080/dlogin.html` | `http://192.168.5.21/doLogin.do` | ❌ 跨域（域名不同） |
| `http://192.168.5.21/dlogin.html` | `http://192.168.5.21/doLogin.do` | ✅ 同源 |
| `https://192.168.5.21/dlogin.html` | `http://192.168.5.21/doLogin.do` | ❌ 跨域（协议不同） |

#### 跨域请求中的 Cookie

**默认行为**：
```javascript
$.ajax({
    url: "http://other-domain.com/api",
    // 浏览器不会发送 Cookie（包括 JSESSIONID）
});
```

**携带 Cookie**：
```javascript
$.ajax({
    url: "http://other-domain.com/api",
    xhrFields: {
        withCredentials: true  // 明确告诉浏览器携带 Cookie
    },
    crossDomain: true  // 标记为跨域请求
});
```

### 后端 CORS 配置

后端需要配置 CORS 响应头允许携带凭证：

```java
response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");  // 不能是 *
response.setHeader("Access-Control-Allow-Credentials", "true");  // 允许携带凭证
response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Content-Type");
```

**重要**：当 `withCredentials: true` 时，`Access-Control-Allow-Origin` **不能设置为 `*`**，必须指定具体的源。

---

## 为什么 login.js 没有这个问题？

**Web 端登录（login.js）使用相对路径**：

```javascript
$.ajax({
    url: "requestLoginChallenge.do",  // 相对路径，自动同源
    // ...
});
```

- 页面地址：`http://192.168.5.21/login.html`
- API 地址：`http://192.168.5.21/requestLoginChallenge.do`
- **同源**，浏览器自动携带 Cookie，无需额外配置

**桌面端登录（dlogin.js）使用绝对路径**：

```javascript
$.ajax({
    url: config.communion + "requestLoginChallenge.do",  // 绝对路径，可能跨域
    // config.communion = "http://192.168.5.21/"
});
```

- 页面地址：可能是 `file://` 协议（NW.js 桌面应用）或其他地址
- API 地址：`http://192.168.5.21/requestLoginChallenge.do`
- **可能跨域**，需要显式配置

---

## 验证修复

### 1. 浏览器开发者工具验证

1. 打开 `dlogin.html`
2. 按 F12 打开开发者工具
3. 切换到 **Network（网络）** 标签
4. 输入用户名、密码，点击登录
5. 观察两个请求：

#### requestLoginChallenge.do 请求

**请求头（Request Headers）**：
```
Cookie: JSESSIONID=ABCD1234...
```

**响应头（Response Headers）**：
```
Set-Cookie: JSESSIONID=ABCD1234...
```

#### doLogin.do 请求

**请求头（Request Headers）**：
```
Cookie: JSESSIONID=ABCD1234...  ← 与第一个请求相同
```

✅ **验证成功标志**：两个请求的 `JSESSIONID` 值完全相同

### 2. 功能测试

- [ ] 使用正确的用户名和密码登录
  - **预期**：登录成功，跳转到主页面
  - **验证点**：不再提示"登录会话已过期"

- [ ] 使用错误的密码登录
  - **预期**：提示"用户名或密码错误"
  - **验证点**：错误提示正常，不是 session 过期提示

### 3. 并发测试

在两个浏览器标签页同时打开 `dlogin.html`，分别登录不同用户：
- **预期**：两个标签页独立登录，互不干扰
- **验证点**：每个标签页有自己的 JSESSIONID

---

## 注意事项

### 1. 后端 CORS 配置

确保后端已正确配置 CORS 响应头。如果后端没有配置，即使前端设置了 `withCredentials: true`，请求也会被浏览器阻止。

**常见错误**：
```
Access to XMLHttpRequest at 'http://192.168.5.21/requestLoginChallenge.do'
from origin 'http://localhost:8080' has been blocked by CORS policy:
The value of the 'Access-Control-Allow-Origin' header in the response
must not be the wildcard '*' when the request's credentials mode is 'include'.
```

**解决方法**：后端设置具体的 `Access-Control-Allow-Origin` 值。

### 2. HTTPS 与 HTTP 混合

如果页面是 HTTPS，API 是 HTTP，浏览器会阻止混合内容：

```
Mixed Content: The page at 'https://...' was loaded over HTTPS,
but requested an insecure XMLHttpRequest endpoint 'http://...'.
This request has been blocked.
```

**解决方法**：统一使用 HTTPS 或 HTTP。

### 3. 第三方 Cookie 限制

部分浏览器（如 Safari、新版 Chrome）默认阻止第三方 Cookie：

**Chrome**：
- 设置 → 隐私和安全 → Cookie 和其他网站数据 → 允许所有 Cookie

**Safari**：
- 偏好设置 → 隐私 → 取消勾选"阻止所有 Cookie"

---

## 扩展：其他类似问题

系统中其他使用 `config.communion`、`config.server`、`config.media` 前缀的 AJAX 请求，如果遇到 session 或认证问题，也可能需要添加此配置。

### 示例：验证码请求

`dlogin.js` 中的 `verifyCode()` 函数：

```javascript
function verifyCode() {
    $.ajax({
        url: config.communion + queryVode,
        type: "POST",
        dataType: "json",
        xhrFields: {
            withCredentials: true  // 同样需要
        },
        crossDomain: true,
        success: function (data) {
            // ...
        }
    });
}
```

### 示例：二维码登录

`initQRCode()` 和 `initWXCode()` 函数中的请求也可能需要：

```javascript
$.ajax({
    url: config.communion + QRCode + "?timestamp=" + new Date().getTime(),
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true
}).done(function (data) {
    // ...
});
```

---

## 总结

### 问题
桌面登录页面 `dlogin.js` 中，挑战-响应认证的两次请求 session 不一致，导致登录失败。

### 原因
跨域 AJAX 请求默认不携带 Cookie（JSESSIONID），导致后端无法从 session 中获取 nonce。

### 解决方案
在两个 AJAX 请求中添加：
```javascript
xhrFields: { withCredentials: true },
crossDomain: true
```

### 影响范围
- ✅ `dlogin.js` 已修复
- ✅ `login.js` 无此问题（使用相对路径）

### 验证方法
浏览器 Network 面板检查两次请求的 JSESSIONID 是否一致。

---

**文档维护者**：AI 自动生成
**参考资料**：
- [MDN - XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
- [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [jQuery.ajax() - crossDomain](https://api.jquery.com/jQuery.ajax/)
