# yspay - 银盛支付集成模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **yspay**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

yspay 模块负责**银盛支付（YSPay）第三方支付接口**的集成，提供支付、退款、分账、账户管理等功能，主要用于装饰订单与主材订单的在线支付场景。

**核心功能**
- 支付接口（扫码支付、APP支付、H5支付）
- 退款接口
- 分账管理
- 账户管理
- 商户管理
- 支付回调处理

---

## 入口与启动

### 控制器入口
- `YSPayCallback` - 支付回调接口

### 核心包结构
- `yspay/config/` - 配置管理
- `yspay/division/` - 分账相关
- `yspay/union/` - 银联相关
- `yspay/airpos/` - 移动POS
- `yspay/utils/` - 工具类

---

## 对外接口

### 支付回调
```java
// 银盛支付回调
POST /yspayCallback.do
Request: {
  signature, msg_signature, timestamp, nonce, encrypt
}
Response: success/fail
```

---

## 关键依赖与配置

### 配置文件（Config.java）
```java
public class Config {
    // 证书密码
    public static final String PASSWORD = "Fanglin1918!";

    // 公钥证书路径
    public static final String PUBLICKEYPATH =
        System.getProperty("user.dir") + "/cert/826235152110030.cer";

    // 私钥证书路径
    public static final String PRIVATEKEYPATH =
        System.getProperty("user.dir") + "/cert/826235152110030.pfx";

    // 分账接口URL
    public static final String DIVISION_URL =
        "https://commonapi.ysepay.com/gateway.do";

    // 退款接口URL
    public static final String DIVISION_REFUND_URL =
        "https://commonapi.ysepay.com/gateway.do";

    // 回调URL（需配置）
    public static final String NOTIFY_URL = "";
}
```

### 证书文件
- `cert/826235152110030.cer` - 公钥证书
- `cert/826235152110030.pfx` - 私钥证书（含密码）

---

## 核心功能

### 1. 分账管理（Division）
- `Account` - 账户管理
- `Business` - 业务管理
- `Division` - 分账处理
- `Refund` - 退款处理
- `Response` - 响应解析

### 2. 银联支付（Union）
- `Account` - 账户
- `Card` - 银行卡
- `Merchant` - 商户
- `Resource` - 资源
- `SsoToken` - SSO令牌
- `Wallet` - 钱包

### 3. 移动POS（Airpos）
- `Airpos` - 移动POS支付

### 4. 工具类（Utils）
- `AESUtil` - AES加解密
- `ByteUtil` - 字节处理
- `CertUtil` - 证书工具
- `DateUtil` - 日期工具
- `HttpClientUtil` - HTTP客户端
- `HttpUtil` - HTTP工具
- `RSAUtil` - RSA加解密
- `SignUtil` / `SignUtils` - 签名工具
- `StringUtil` / `StringUtils` - 字符串工具

---

## 数据模型

无持久化实体，主要为接口调用与响应处理。

---

## 使用流程

### 支付流程
1. 生成支付订单
2. 调用银盛支付接口
3. 用户扫码/输入密码支付
4. 银盛回调 yspayCallback.do
5. 系统更新订单状态

### 退款流程
1. 用户申请退款
2. 调用银盛退款接口
3. 银盛处理退款
4. 回调通知
5. 系统更新退款状态

### 分账流程
1. 支付成功后
2. 根据分账规则分账
3. 调用分账接口
4. 资金分配到各方账户

---

## 常见问题 (FAQ)

**Q: 银盛支付支持哪些支付方式？**
A:
- 扫码支付（微信/支付宝）
- APP支付
- H5支付
- 移动POS支付

**Q: 如何配置证书？**
A:
1. 将证书文件放到 `cert/` 目录
2. 在 Config.java 中配置路径和密码
3. 确保证书有效期

**Q: 回调URL如何配置？**
A: 在 Config.NOTIFY_URL 中配置公网可访问的回调地址，例如：
`https://yourdomain.com/yspayCallback.do`

**Q: 支付失败如何处理？**
A:
1. 检查证书配置
2. 检查签名算法
3. 查看银盛返回的错误码
4. 验证商户号与密钥

---

## 安全注意事项

1. **证书保护**: 私钥证书需严格保密
2. **签名验证**: 所有回调必须验签
3. **HTTPS**: 生产环境必须使用HTTPS
4. **参数校验**: 验证所有回调参数
5. **幂等性**: 处理重复回调

---

## 相关文件清单

```
src/com/fanglin/yspay/
├── action/
│   └── YSPayCallback.java                - 支付回调
├── config/
│   └── Config.java                       - 配置管理 ★
├── division/
│   ├── Account.java                      - 账户
│   ├── Base.java                         - 基础
│   ├── Business.java                     - 业务
│   ├── Division.java                     - 分账
│   ├── Refund.java                       - 退款
│   └── Response.java                     - 响应
├── union/
│   ├── Account.java                      - 账户
│   ├── Card.java                         - 银行卡
│   ├── Merchant.java                     - 商户
│   ├── Resource.java                     - 资源
│   ├── SsoToken.java                     - SSO令牌
│   └── Wallet.java                       - 钱包
├── airpos/
│   └── Airpos.java                       - 移动POS
└── utils/
    ├── AESUtil.java                      - AES加解密
    ├── RSAUtil.java                      - RSA加解密
    ├── SignUtil.java / SignUtils.java    - 签名工具
    ├── CertUtil.java                     - 证书工具
    ├── HttpUtil.java / HttpClientUtil.java - HTTP工具
    └── ...其他工具
```

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化银盛支付集成模块 AI 上下文文档
- 记录支付、退款、分账等核心功能
- 补充配置说明与安全注意事项
