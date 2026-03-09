# HttpHelper 统一工具类 - 使用文档与迁移指南

> 最后更新：2025-12-29
>
> 整合项目中的所有 HTTP 工具类，提供统一的 HTTP 请求接口

---

## 📋 目录

1. [为什么需要统一](#为什么需要统一)
2. [功能对比](#功能对比)
3. [快速开始](#快速开始)
4. [API 详解](#api-详解)
5. [迁移指南](#迁移指南)
6. [常见问题](#常见问题)
7. [最佳实践](#最佳实践)

---

## 为什么需要统一

### 现状问题

项目中发现 **3 个重复的 HTTP 工具类**：

| 工具类 | 位置 | 问题 |
|-------|------|------|
| `HttpUtil` | `com.fanglin.utils` | 功能不完整，缺少自定义 Headers 支持 |
| `HttpHelper` | `com.fanglin.wechat.utils` | 仅微信模块使用，功能重复 |
| `HttpUtil` | `com.fanglin.yspay.utils` | 仅银盛支付模块使用，功能重复 |

### 存在的问题

- ❌ **代码重复**：三个类有 60% 以上的重复代码
- ❌ **功能分散**：各自有特色功能，没有统一
- ❌ **维护困难**：修改一处需要同步修改多处
- ❌ **调用混乱**：不同模块使用不同的工具类

### 统一方案

✅ **创建统一的 `HttpHelper` 类**：`com.fanglin.utils.HttpHelper`

✅ **整合所有功能**：

- GET/POST/PUT 请求
- 文件上传/下载
- HTTPS 证书支持（微信支付）
- XML 请求/响应
- 自定义 Headers
- 灵活配置

---

## 功能对比

### 统一前 vs 统一后

| 功能 | 旧工具类 | 新 HttpHelper | 改进 |
|-----|---------|---------------|------|
| GET 请求 | ✅ HttpUtil | ✅ httpGet() | 统一接口 |
| POST JSON | ✅ HttpUtil | ✅ httpPost() | 统一接口 |
| POST 表单 | ✅ HttpHelper | ✅ httpPostForm() | 更清晰的命名 |
| PUT 请求 | ✅ HttpUtil | ✅ httpPut() | 统一接口 |
| 自定义 Headers | ✅ HttpHelper (仅微信) | ✅ httpPost(url, headers, data) | 所有模块可用 |
| 文件上传 | ✅ 重复实现 | ✅ uploadMedia() | 统一实现 |
| 文件下载 | ✅ 重复实现 | ✅ downloadMedia() | 统一实现 |
| HTTPS 证书 | ✅ HttpHelper (仅微信) | ✅ httpsXml() | 所有模块可用 |
| XML 请求 | ✅ HttpHelper (仅微信) | ✅ httpXml() | 所有模块可用 |
| 返回 String | ❌ | ✅ httpGetString() / httpPostString() | 新增功能 |
| 配置超时 | ❌ 硬编码 | ✅ setTimeout() | 支持动态配置 |

---

## 快速开始

### 1. 基本使用

#### GET 请求

```java
// 简单 GET 请求
JSONObject result = HttpHelper.httpGet("http://api.example.com/user?id=123");
```

#### POST JSON 请求

```java
// 创建请求数据
JSONObject data = new JSONObject();
data.put("name", "张三");
data.put("age", 25);

// 发送 POST 请求
JSONObject result = HttpHelper.httpPost("http://api.example.com/user", data);

System.out.println(result.toJSONString());
```

#### POST 表单请求

```java
// 方式一：使用 Map
Map<String, String> params = new HashMap<>();
params.put("username", "admin");
params.put("password", "123456");

JSONObject result = HttpHelper.httpPostForm("http://api.example.com/login", params);

// 方式二：使用 List<NameValuePair>
List<BasicNameValuePair> formParams = new ArrayList<>();
formParams.add(new BasicNameValuePair("username", "admin"));
formParams.add(new BasicNameValuePair("password", "123456"));

JSONObject result = HttpHelper.httpPostForm("http://api.example.com/login", formParams);
```

### 2. 文件操作

#### 文件上传

```java
File file = new File("test.jpg");
JSONObject result = HttpHelper.uploadMedia("http://api.example.com/upload", file);

String mediaId = result.getString("media_id");
```

#### 文件下载

```java
String url = "http://api.example.com/files/test.jpg";
String saveDir = "/tmp/downloads";

JSONObject result = HttpHelper.downloadMedia(url, saveDir);
String filePath = result.getString("downloadFilePath");

// 简单下载
HttpHelper.download(url, "test.jpg", "/tmp/downloads");
```

### 3. 高级用法

#### 自定义 Headers

```java
Map<String, String> headers = new HashMap<>();
headers.put("Content-Type", "application/json");
headers.put("Authorization", "Bearer token123");

JSONObject data = new JSONObject();
data.put("message", "Hello");

JSONObject result = HttpHelper.httpPost("http://api.example.com/secure", headers, data);
```

#### HTTPS 证书请求（微信支付）

```java
String url = "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers";
String xml = "<xml>...</xml>";
String certPath = "/path/to/cert.pfx";
String certPass = "password";

String response = HttpHelper.httpsXml(url, xml, certPath, certPass);
```

#### 动态配置超时

```java
// 设置超时为 5 秒
HttpHelper.setTimeout(5000, 5000);

// 恢复默认超时（2秒）
HttpHelper.setTimeout(2000, 2000);
```

---

## API 详解

### 配置方法

#### setTimeout(int socketTimeout, int connectTimeout)

设置超时时间

```java
HttpHelper.setTimeout(5000, 5000);  // Socket: 5秒, Connect: 5秒
```

**参数说明**：
- `socketTimeout`: Socket 超时时间（毫秒）
- `connectTimeout`: 连接超时时间（毫秒）

**默认值**：2000ms（2秒）

---

### GET 请求

#### httpGet(String url)

发送 GET 请求，返回 JSONObject

```java
JSONObject result = HttpHelper.httpGet("http://api.example.com/user");
```

#### httpGetString(String url)

发送 GET 请求，返回 String

```java
String html = HttpHelper.httpGetString("http://www.baidu.com");
```

---

### POST 请求

#### httpPost(String url, Object data)

发送 POST JSON 请求

```java
JSONObject data = new JSONObject();
data.put("name", "张三");

JSONObject result = HttpHelper.httpPost("http://api.example.com/user", data);
```

#### httpPostForm(String url, Map<String, String> params)

发送 POST 表单请求（Map 版本）

```java
Map<String, String> params = new HashMap<>();
params.put("username", "admin");

JSONObject result = HttpHelper.httpPostForm("http://api.example.com/login", params);
```

#### httpPostForm(String url, List<BasicNameValuePair> params)

发送 POST 表单请求（List 版本）

```java
List<BasicNameValuePair> params = new ArrayList<>();
params.add(new BasicNameValuePair("username", "admin"));

JSONObject result = HttpHelper.httpPostForm("http://api.example.com/login", params);
```

#### httpPost(String url, Map<String, String> headers, Object data)

发送 POST 请求（自定义 Headers）

```java
Map<String, String> headers = new HashMap<>();
headers.put("Authorization", "Bearer token");

JSONObject result = HttpHelper.httpPost("http://api.example.com/secure", headers, data);
```

#### httpPostString(String url, Map<String, String> params)

发送 POST 请求，返回 String

```java
String response = HttpHelper.httpPostString("http://api.example.com/submit", params);
```

---

### PUT 请求

#### httpPut(String url, Object data)

发送 PUT JSON 请求

```java
JSONObject data = new JSONObject();
data.put("name", "李四");

JSONObject result = HttpHelper.httpPut("http://api.example.com/user/123", data);
```

---

### 文件操作

#### uploadMedia(String url, File file)

上传文件（multipart/form-data）

```java
File file = new File("test.jpg");
JSONObject result = HttpHelper.uploadMedia("http://api.example.com/upload", file);
```

#### downloadMedia(String url, String fileDir)

下载文件（支持重定向）

```java
JSONObject result = HttpHelper.downloadMedia("http://api.example.com/file.jpg", "/tmp");
String filePath = result.getString("downloadFilePath");
```

#### download(String urlString, String filename, String savePath)

简单文件下载

```java
HttpHelper.download("http://api.example.com/file.jpg", "test.jpg", "/tmp");
```

---

### XML 请求

#### httpsXml(String url, String xml, String certPath, String certPass)

发送 HTTPS XML 请求（支持双向证书认证，用于微信支付）

```java
String url = "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers";
String xml = "<xml><amount>100</amount></xml>";
String certPath = "/path/to/cert.pfx";
String certPass = "password";

String response = HttpHelper.httpsXml(url, xml, certPath, certPass);
```

#### httpXml(String url, String method, String xml)

发送 HTTP/HTTPS XML 请求

```java
StringBuffer response = HttpHelper.httpXml("http://api.example.com/xml", "POST", "<xml>...</xml>");
```

---

## 迁移指南

### 从 `utils.HttpUtil` 迁移

#### 旧代码

```java
import com.fanglin.utils.HttpUtil;

// GET 请求
JSONObject result = HttpUtil.httpGet(url);

// POST JSON
JSONObject result = HttpUtil.httpPost(url, data);

// POST 表单
JSONObject result = HttpUtil.httpPost(url, params);

// PUT 请求
JSONObject result = HttpUtil.httpPut(url, data);

// 文件上传
JSONObject result = HttpUtil.uploadMedia(url, file);

// 文件下载
JSONObject result = HttpUtil.downloadMedia(url, dir);
HttpUtil.download(url, filename, savePath);
```

#### 新代码

```java
import com.fanglin.utils.HttpHelper;

// GET 请求（无变化）
JSONObject result = HttpHelper.httpGet(url);

// POST JSON（无变化）
JSONObject result = HttpHelper.httpPost(url, data);

// POST 表单（方法名更清晰）
JSONObject result = HttpHelper.httpPostForm(url, params);

// PUT 请求（无变化）
JSONObject result = HttpHelper.httpPut(url, data);

// 文件上传（无变化）
JSONObject result = HttpHelper.uploadMedia(url, file);

// 文件下载（无变化）
JSONObject result = HttpHelper.downloadMedia(url, dir);
HttpHelper.download(url, filename, savePath);
```

**迁移步骤**：
1. 将 `import com.fanglin.utils.HttpUtil` 改为 `import com.fanglin.utils.HttpHelper`
2. 将 `HttpUtil.httpPost(url, params)` 改为 `HttpHelper.httpPostForm(url, params)`（如果 params 是 Map 或 List）
3. 其他方法调用保持不变

---

### 从 `wechat.utils.HttpHelper` 迁移

#### 旧代码

```java
import com.fanglin.wechat.utils.HttpHelper;

// GET 请求
JSONObject result = HttpHelper.httpGet(url);

// POST JSON
JSONObject result = HttpHelper.httpPost(url, params);

// POST with Headers
Map<String, String> headers = new HashMap<>();
headers.put("Content-Type", "application/json");
JSONObject result = HttpHelper.httpPost(url, headers, params);

// HTTPS XML
String response = HttpHelper.httpsXml(url, xml, type, file, passwd);

// HTTP XML
StringBuffer response = HttpHelper.httpXml(url, method, xml);

// 文件上传
JSONObject result = HttpHelper.uploadMedia(url, file);

// 文件下载
JSONObject result = HttpHelper.downloadMedia(url, dir);
```

#### 新代码

```java
import com.fanglin.utils.HttpHelper;

// GET 请求（无变化）
JSONObject result = HttpHelper.httpGet(url);

// POST JSON（无变化）
JSONObject result = HttpHelper.httpPost(url, params);

// POST with Headers（无变化）
JSONObject result = HttpHelper.httpPost(url, headers, params);

// HTTPS XML（参数简化）
String response = HttpHelper.httpsXml(url, xml, certPath, certPass);

// HTTP XML（无变化）
StringBuffer response = HttpHelper.httpXml(url, method, xml);

// 文件上传（无变化）
JSONObject result = HttpHelper.uploadMedia(url, file);

// 文件下载（无变化）
JSONObject result = HttpHelper.downloadMedia(url, dir);
```

**迁移步骤**：
1. 将 `import com.fanglin.wechat.utils.HttpHelper` 改为 `import com.fanglin.utils.HttpHelper`
2. 将 `httpsXml(url, xml, type, file, passwd)` 改为 `httpsXml(url, xml, file, passwd)`（去掉 type 参数）
3. 其他方法调用保持不变

---

### 从 `yspay.utils.HttpUtil` 迁移

#### 旧代码

```java
import com.fanglin.yspay.utils.HttpUtil;

// POST 表单（返回 String）
String result = HttpUtil.sendPost(url, map);

// POST 表单 + 文件上传
String result = HttpUtil.sendPost(url, map, file);

// 下载文件
File file = HttpUtil.getFile(url);
```

#### 新代码

```java
import com.fanglin.utils.HttpHelper;

// POST 表单（返回 JSONObject）
JSONObject result = HttpHelper.httpPostForm(url, map);

// POST 表单 + 文件上传
JSONObject result = HttpHelper.uploadMedia(url, file);

// 下载文件
JSONObject result = HttpHelper.downloadMedia(url, "/tmp");
String filePath = result.getString("downloadFilePath");

// 或者简单下载
HttpHelper.download(url, "filename", "/tmp");
```

**迁移步骤**：
1. 将 `import com.fanglin.yspay.utils.HttpUtil` 改为 `import com.fanglin.utils.HttpHelper`
2. 将 `HttpUtil.sendPost(url, map)` 改为 `HttpHelper.httpPostString(url, map)`（如果需要返回 String）
3. 将 `HttpUtil.sendPost(url, map, file)` 改为 `HttpHelper.uploadMedia(url, file)`
4. 将 `HttpUtil.getFile(url)` 改为 `HttpHelper.downloadMedia(url, dir)`

---

## 常见问题

### Q1: 为什么要迁移到新的 HttpHelper？

**A**:
- ✅ **功能更强大**：整合了所有工具类的优点
- ✅ **代码更简洁**：消除重复代码
- ✅ **维护更容易**：只需维护一个工具类
- ✅ **接口更统一**：所有模块使用相同的接口

### Q2: 旧的工具类会立即删除吗？

**A**: 不会。旧工具类已标记为 `@Deprecated`，但仍然可以继续使用。建议在后续开发中逐步迁移到新的 `HttpHelper`。

### Q3: 迁移会影响现有功能吗？

**A**: 不会。新 `HttpHelper` 的接口与旧工具类高度兼容，只需简单的包名替换即可。

### Q4: 如何选择合适的方法？

**A**:
- **GET 请求** → `httpGet()`
- **POST JSON** → `httpPost()`
- **POST 表单** → `httpPostForm()`
- **自定义 Headers** → `httpPost(url, headers, data)`
- **文件上传** → `uploadMedia()`
- **文件下载** → `downloadMedia()` 或 `download()`
- **微信支付** → `httpsXml()`

### Q5: 如何设置超时时间？

**A**:
```java
// 全局设置（影响后续所有请求）
HttpHelper.setTimeout(5000, 5000);

// 查看当前超时设置
int socketTimeout = HttpHelper.getSocketTimeout();
int connectTimeout = HttpHelper.getConnectTimeout();
```

### Q6: 如何处理请求失败？

**A**:
```java
JSONObject result = HttpHelper.httpGet(url);
if (result == null) {
    // 请求失败（HTTP 状态码非 200-206，或发生异常）
    logger.error("请求失败");
    return;
}

// 检查业务错误码
Integer errcode = result.getInteger("errcode");
if (errcode != null && errcode != 0) {
    logger.error("业务错误: " + result.getString("errmsg"));
    return;
}
```

### Q7: 支持哪些 HTTP 方法？

**A**:
- ✅ GET
- ✅ POST
- ✅ PUT
- ❌ DELETE（可按需添加）
- ❌ PATCH（可按需添加）

---

## 最佳实践

### 1. 统一导入

```java
// ✅ 推荐
import com.fanglin.utils.HttpHelper;

// ❌ 不推荐
import com.fanglin.wechat.utils.HttpHelper;
import com.fanglin.yspay.utils.HttpUtil;
```

### 2. 统一异常处理

```java
try {
    JSONObject result = HttpHelper.httpGet(url);
    if (result == null) {
        throw new BusinessException("请求失败");
    }
    // 处理 result
} catch (Exception e) {
    logger.error("HTTP 请求异常", e);
    throw new BusinessException("系统异常");
}
```

### 3. 统一日志记录

```java
JSONObject result = HttpHelper.httpPost(url, data);
if (result == null) {
    logger.error("HTTP 请求失败: url={}", url);
} else {
    logger.info("HTTP 请求成功: url={}, response={}", url, result.toJSONString());
}
```

### 4. 合理设置超时

```java
// 内部 API（快速响应）
HttpHelper.setTimeout(2000, 2000);

// 外部 API（可能较慢）
HttpHelper.setTimeout(5000, 5000);

// 文件上传/下载（需要更长时间）
HttpHelper.setTimeout(30000, 10000);
```

### 5. 使用连接池（高级）

对于高并发场景，建议使用 HttpClient 连接池：

```java
// 可以在 HttpHelper 中添加连接池支持（按需扩展）
```

---

## 附录

### 完整示例

```java
package com.fanglin.example;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.message.BasicNameValuePair;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.utils.HttpHelper;

/**
 * HttpHelper 使用示例
 */
public class HttpHelperExample {

    public static void main(String[] args) {
        // 1. GET 请求
        testHttpGet();

        // 2. POST JSON 请求
        testHttpPostJson();

        // 3. POST 表单请求
        testHttpPostForm();

        // 4. 自定义 Headers
        testCustomHeaders();

        // 5. 文件上传
        testFileUpload();

        // 6. 文件下载
        testFileDownload();

        // 7. HTTPS XML 请求（微信支付）
        testHttpsXml();
    }

    /**
     * GET 请求示例
     */
    public static void testHttpGet() {
        String url = "http://api.example.com/user?id=123";
        JSONObject result = HttpHelper.httpGet(url);

        if (result != null) {
            System.out.println("GET 请求成功: " + result.toJSONString());
        } else {
            System.out.println("GET 请求失败");
        }
    }

    /**
     * POST JSON 请求示例
     */
    public static void testHttpPostJson() {
        String url = "http://api.example.com/user";

        JSONObject data = new JSONObject();
        data.put("name", "张三");
        data.put("age", 25);

        JSONObject result = HttpHelper.httpPost(url, data);

        if (result != null) {
            System.out.println("POST JSON 请求成功: " + result.toJSONString());
        } else {
            System.out.println("POST JSON 请求失败");
        }
    }

    /**
     * POST 表单请求示例
     */
    public static void testHttpPostForm() {
        String url = "http://api.example.com/login";

        // 方式一：使用 Map
        Map<String, String> params = new HashMap<>();
        params.put("username", "admin");
        params.put("password", "123456");

        JSONObject result = HttpHelper.httpPostForm(url, params);

        // 方式二：使用 List<BasicNameValuePair>
        List<BasicNameValuePair> formParams = new ArrayList<>();
        formParams.add(new BasicNameValuePair("username", "admin"));
        formParams.add(new BasicNameValuePair("password", "123456"));

        JSONObject result2 = HttpHelper.httpPostForm(url, formParams);

        System.out.println("POST 表单请求成功: " + result.toJSONString());
    }

    /**
     * 自定义 Headers 示例
     */
    public static void testCustomHeaders() {
        String url = "http://api.example.com/secure";

        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Authorization", "Bearer token123");

        JSONObject data = new JSONObject();
        data.put("message", "Hello World");

        JSONObject result = HttpHelper.httpPost(url, headers, data);

        System.out.println("自定义 Headers 请求成功: " + result.toJSONString());
    }

    /**
     * 文件上传示例
     */
    public static void testFileUpload() {
        String url = "http://api.example.com/upload";
        File file = new File("test.jpg");

        JSONObject result = HttpHelper.uploadMedia(url, file);

        if (result != null) {
            String mediaId = result.getString("media_id");
            System.out.println("文件上传成功, media_id=" + mediaId);
        } else {
            System.out.println("文件上传失败");
        }
    }

    /**
     * 文件下载示例
     */
    public static void testFileDownload() {
        String url = "http://api.example.com/files/test.jpg";
        String saveDir = "/tmp/downloads";

        JSONObject result = HttpHelper.downloadMedia(url, saveDir);

        if (result != null) {
            String filePath = result.getString("downloadFilePath");
            System.out.println("文件下载成功, path=" + filePath);
        } else {
            System.out.println("文件下载失败");
        }

        // 简单下载
        HttpHelper.download(url, "test.jpg", saveDir);
    }

    /**
     * HTTPS XML 请求示例（微信支付）
     */
    public static void testHttpsXml() {
        String url = "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers";
        String xml = "<xml><mch_appid>wx8888888888888888</mch_appid><mchid>1900000109</mchid>...</xml>";
        String certPath = "/path/to/cert.pfx";
        String certPass = "password";

        String response = HttpHelper.httpsXml(url, xml, certPath, certPass);

        System.out.println("HTTPS XML 请求成功: " + response);
    }
}
```

---

## 版本历史

| 版本 | 日期 | 说明 |
|-----|------|------|
| 1.0 | 2025-12-29 | 初始版本，整合所有 HTTP 工具类功能 |

---

## 联系方式

如有问题或建议，请联系开发团队。
