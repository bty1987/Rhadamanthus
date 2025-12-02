# wechat - 微信集成模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **wechat**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

wechat 模块负责**微信公众号与小程序**的集成，提供微信 AccessToken 管理、JS-SDK 配置、消息推送等功能，支持微信生态下的业务扩展。

**核心功能**
- AccessToken 管理（公众号/小程序）
- JsapiTicket 管理
- OpenAccessToken 管理
- 微信消息推送
- JS-SDK 配置

---

## 入口与启动

### 控制器入口
- `AccessTokenAction` - AccessToken 管理

### 核心包结构
- `wechat/action/` - 控制器
- `wechat/service/` - 服务层
- `wechat/dao/` - 数据访问层
- `wechat/po/` - 实体对象
- `wechat/vo/` - 值对象
- `wechat/utils/` - 工具类

---

## 对外接口

### AccessToken 管理
```java
// 查询 AccessToken
GET/POST /queryAccessToken.do
Request: { company }
Response: { accessToken: {...} }

// 查询 JsapiTicket
GET/POST /queryJsapiTicket.do
Request: { company }
Response: { jsapiTicket: {...} }

// 生成 AccessToken
POST /makeAccessToken.do
Request: { type, company }
Response: success

// 删除 AccessToken
POST /deleteAccessToken.do
Response: success

// 删除 OpenAccessToken
POST /deleteOpenAccessToken.do
Response: success
```

---

## 关键依赖与配置

### 微信API接口（WXApi.java）
```java
public interface WXApi {
    // 发送支付消息
    String WXAPI_SEND_MESSAGE_PAYMENT_STR =
        "%s/sendPayment.do?payment.type=%d&payment.no=%s&payment.name=%s&payment.money=%s&payment.comment=%s";

    // 发送服务进度消息
    String WXAPI_SEND_MESSAGE_SERVICE_SCHEDULE_STR =
        "%s/sendServiceSchedule.do";

    // 获取 AccessToken
    String WXAPI_GET_TOKEN_STR =
        "%s/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s";

    // 获取 JsapiTicket
    String WXAPI_GET_JSAPI_TICKET_STR =
        "%s/cgi-bin/ticket/getticket?type=jsapi&access_token=%s";
}
```

### 微信公众号配置
- AppID: 公众号/小程序 AppID
- AppSecret: 公众号/小程序 AppSecret
- Token: 消息推送 Token
- EncodingAESKey: 消息加密密钥

---

## 数据模型

### 核心实体（PO）

#### AccessTokenPO - AccessToken
```java
@Entity
@Table(name = "accessToken", catalog = "wechat")
- atid: long                    // AccessToken ID
- accessToken: String           // AccessToken 值
- expiresIn: int                // 过期时间（秒）
- createTime: Timestamp         // 创建时间
- company: String               // 公司标识
```

#### JsapiTicketPO - JsapiTicket
```java
@Entity
@Table(name = "jsapiTicket", catalog = "wechat")
- jtid: long                    // Ticket ID
- ticket: String                // Ticket 值
- expiresIn: int                // 过期时间（秒）
- createTime: Timestamp         // 创建时间
- company: String               // 公司标识
```

#### OpenAccessTokenPO - OpenAccessToken
```java
@Entity
- oatid: long                   // OpenAccessToken ID
- openId: String                // 用户OpenID
- accessToken: String           // AccessToken
- refreshToken: String          // RefreshToken
- expiresIn: int                // 过期时间
- createTime: Timestamp         // 创建时间
```

### 值对象（VO）
- `AccessTokenVO` - AccessToken 视图
- `JsapiTicketVO` - JsapiTicket 视图
- `ConfigVO` - 微信配置视图

---

## 核心功能

### 1. AccessToken 管理
- 自动获取与刷新
- 缓存管理（避免频繁请求微信接口）
- 多公司支持

### 2. JsapiTicket 管理
- 用于微信 JS-SDK 签名
- 自动获取与刷新
- 缓存管理

### 3. 消息推送
- 发送支付通知
- 发送服务进度通知
- 模板消息推送

---

## 使用流程

### AccessToken 获取流程
1. 检查缓存中是否有有效 AccessToken
2. 如有效直接返回
3. 如无效或过期，调用微信接口获取
4. 存入数据库并缓存
5. 返回 AccessToken

### JS-SDK 签名流程
1. 获取 JsapiTicket
2. 构造签名串（包含 url、timestamp、noncestr）
3. SHA1 签名
4. 返回签名结果

### 消息推送流程
1. 获取 AccessToken
2. 构造消息内容
3. 调用微信接口发送
4. 处理返回结果

---

## 常见问题 (FAQ)

**Q: AccessToken 多久过期？**
A: 微信 AccessToken 有效期为 7200 秒（2小时），建议提前刷新。

**Q: 如何处理 AccessToken 过期？**
A: 系统会自动检测过期并重新获取，业务代码无需特殊处理。

**Q: 多公司如何管理 AccessToken？**
A: 通过 company 字段区分不同公司，每个公司使用独立的 AppID 和 AppSecret。

**Q: JS-SDK 签名失败如何排查？**
A:
1. 检查 JsapiTicket 是否有效
2. 检查签名 URL 是否正确（不包含 # 后的部分）
3. 检查时间戳和随机字符串
4. 检查签名算法

**Q: 如何发送模板消息？**
A: 使用 MessageService，调用微信模板消息接口。

---

## 安全注意事项

1. **AppSecret 保护**: AppSecret 严格保密，不要泄露
2. **AccessToken 保护**: AccessToken 不要暴露给前端
3. **HTTPS**: 生产环境必须使用 HTTPS
4. **IP 白名单**: 在微信后台配置服务器 IP 白名单
5. **消息验签**: 接收微信消息时验证签名

---

## 相关文件清单

```
src/com/fanglin/wechat/
├── action/
│   └── AccessTokenAction.java            - AccessToken 管理 ★
├── service/
│   ├── AccessTokenService.java           - AccessToken 服务
│   ├── JsapiTicketService.java           - JsapiTicket 服务
│   ├── OpenAccessTokenService.java       - OpenAccessToken 服务
│   └── MessageService.java               - 消息服务
├── dao/
│   ├── AccessTokenDao.java               - AccessToken DAO
│   ├── JsapiTicketDao.java               - JsapiTicket DAO
│   └── OpenAccessTokenDao.java           - OpenAccessToken DAO
├── po/
│   ├── AccessTokenPO.java                - AccessToken 实体
│   ├── JsapiTicketPO.java                - JsapiTicket 实体
│   └── OpenAccessTokenPO.java            - OpenAccessToken 实体
├── vo/
│   ├── AccessTokenVO.java                - AccessToken VO
│   ├── JsapiTicketVO.java                - JsapiTicket VO
│   └── ConfigVO.java                     - 配置 VO
└── utils/
    └── WXApi.java                        - 微信API接口定义 ★
```

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化微信集成模块 AI 上下文文档
- 记录 AccessToken、JsapiTicket 管理功能
- 补充微信API接口说明
- 添加常见问题与安全注意事项
