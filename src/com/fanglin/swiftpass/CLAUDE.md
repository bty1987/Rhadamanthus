# swiftpass - 威富通支付集成模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **swiftpass**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

swiftpass 模块负责**威富通（Swiftpass）第三方支付接口**的集成，提供移动支付、扫码支付、退款等功能，主要用于微信支付、支付宝支付的聚合支付场景。

**核心功能**
- 扫码支付（微信/支付宝）
- 移动POS支付
- 退款处理
- 支付回调处理
- 签名验证

---

## 入口与启动

### 控制器入口
- `SwiftpassAction` - 威富通支付回调

### 核心包结构
- `swiftpass/action/` - 控制器
- `swiftpass/service/` - 服务层
- `swiftpass/config/` - 配置管理
- `swiftpass/airpos/` - 移动POS
- `swiftpass/utils/` - 工具类
- `swiftpass/enums/` - 枚举
- `swiftpass/exception/` - 异常

---

## 对外接口

### 支付回调
```java
// 威富通支付回调
POST /callbackSwiftpass.do
Request: XML 格式的支付结果
Response: success/fail
```

---

## 关键依赖与配置

### 配置类
- `Configure` - 基础配置
- `GrayConfigure` - 灰度配置
- `KeyConfigure` - 密钥配置

### 枚举类
- `KeySignTypeEnum` - 密钥签名类型
- `ReqMethodEnum` - 请求方法类型
- `RespSignAlgorithmEnum` - 响应签名算法

---

## 核心功能

### 1. 支付服务（SwiftpassService）
- 发起支付
- 查询支付结果
- 退款处理
- 关闭订单

### 2. 移动POS（Airpos）
- POS机支付
- 测试功能

### 3. 签名工具（Signature）
- 签名生成
- 签名验证

### 4. HTTP工具（HttpsPostRequest）
- HTTPS POST 请求
- XML 数据处理

---

## 回调处理流程

### 支付回调流程
1. 接收威富通 XML 格式回调
2. 解析 XML 数据
3. 验证签名
4. 更新订单状态
5. 返回成功响应

### 回调数据解析
```java
// SwiftpassAction.callbackSwiftpass()
private JSONObject getRequestPostData(HttpServletRequest request) {
    // 读取 XML 数据
    // 解析为 JSONObject
    // 返回结构化数据
}
```

---

## 数据模型

无持久化实体，主要为接口调用与响应处理。

---

## 使用流程

### 支付流程
1. 生成支付订单
2. 调用威富通支付接口
3. 用户扫码/输入密码支付
4. 威富通回调 callbackSwiftpass.do
5. 系统更新订单状态

### 退款流程
1. 用户申请退款
2. 调用威富通退款接口
3. 威富通处理退款
4. 回调通知
5. 系统更新退款状态

---

## 常见问题 (FAQ)

**Q: 威富通支付支持哪些支付方式？**
A:
- 微信扫码支付
- 支付宝扫码支付
- 移动POS支付
- APP支付

**Q: 如何配置威富通？**
A:
1. 在 Configure 中配置商户号
2. 在 KeyConfigure 中配置密钥
3. 配置回调URL

**Q: 回调URL如何配置？**
A: 配置公网可访问的回调地址：
`https://yourdomain.com/callbackSwiftpass.do`

**Q: 签名验证失败如何处理？**
A:
1. 检查密钥配置
2. 检查签名算法
3. 检查请求参数顺序
4. 查看威富通错误日志

---

## 安全注意事项

1. **密钥保护**: 商户密钥严格保密
2. **签名验证**: 所有回调必须验签
3. **HTTPS**: 生产环境必须使用HTTPS
4. **XML注入**: 防止XML注入攻击
5. **幂等性**: 处理重复回调

---

## 相关文件清单

```
src/com/fanglin/swiftpass/
├── action/
│   └── SwiftpassAction.java              - 支付回调 ★
├── service/
│   ├── AbstractTransService.java         - 抽象交易服务
│   └── SwiftpassService.java             - 威富通服务
├── config/
│   ├── Configure.java                    - 基础配置
│   ├── GrayConfigure.java                - 灰度配置
│   └── KeyConfigure.java                 - 密钥配置
├── airpos/
│   ├── Airpos.java                       - 移动POS
│   └── Test.java                         - 测试
├── enums/
│   ├── KeySignTypeEnum.java              - 密钥签名类型
│   ├── ReqMethodEnum.java                - 请求方法
│   └── RespSignAlgorithmEnum.java        - 响应签名算法
├── exception/
│   ├── SdkException.java                 - SDK异常
│   └── SdkExType.java                    - 异常类型
└── utils/
    ├── Base64.java                       - Base64工具
    ├── Const.java                        - 常量
    ├── HttpsPostRequest.java             - HTTPS POST
    ├── OpenSdk.java                      - 开放SDK
    ├── SdkUtil.java                      - SDK工具
    ├── Signature.java                    - 签名工具 ★
    └── VerifyRespSignature.java          - 验证响应签名
```

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化威富通支付集成模块 AI 上下文文档
- 记录支付、退款、回调处理等功能
- 补充配置说明与安全注意事项
