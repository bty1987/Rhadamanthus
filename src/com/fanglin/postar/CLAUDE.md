# postar - 邮政快递集成模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **postar**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

postar 模块负责**中国邮政快递接口**的集成，提供快递下单、物流查询、支付回调等功能，主要用于主材配送、生产配送等场景。

**核心功能**
- 快递下单
- 物流查询
- 支付回调处理
- 运费计算

---

## 入口与启动

### 控制器入口
- `PostarAction` - 邮政快递回调

### 核心包结构
- `postar/action/` - 控制器
- `postar/service/` - 服务层
- `postar/airpos/` - 移动支付
- `postar/utils/` - 工具类

---

## 对外接口

### 快递回调
```java
// 邮政快递回调
POST /callbackPostar.do
Request: JSON 格式的快递状态
Response: { rspCod, rspMsg }
```

---

## 核心功能

### 1. 快递服务（PostarService）
- 下单
- 查询物流
- 取消订单
- 运费计算

### 2. 移动支付（Airpos / Wxpay）
- 快递费支付
- 微信支付集成

### 3. 加密工具
- `AesUtil` - AES加解密
- `RsaUtil` - RSA加解密
- `ShaUtil` - SHA哈希
- `SM4` / `SM4Utils` - 国密SM4
- `Base64Util` - Base64编解码
- `HttpUtil` - HTTP请求

---

## 数据模型

无持久化实体，主要为接口调用与响应处理。

---

## 使用流程

### 快递下单流程
1. 生成配送订单
2. 调用邮政下单接口
3. 获取快递单号
4. 邮政揽件
5. 配送中
6. 签收

### 物流查询流程
1. 根据快递单号查询
2. 调用邮政查询接口
3. 获取物流轨迹
4. 展示给用户

### 回调处理流程
1. 邮政推送物流状态
2. 接收回调数据
3. 解密与验签
4. 更新订单状态
5. 返回成功响应

---

## 常见问题 (FAQ)

**Q: 邮政快递支持哪些业务？**
A:
- 标准快递
- 经济快递
- 特快专递
- 代收货款

**Q: 如何计算运费？**
A: 调用邮政运费计算接口，根据：
- 发件地址
- 收件地址
- 重量/体积
- 快递类型

**Q: 快递异常如何处理？**
A:
1. 查询物流状态
2. 联系邮政客服
3. 处理异常件
4. 更新订单状态

**Q: 支持批量下单吗？**
A: 支持，可以批量提交订单数据。

---

## 安全注意事项

1. **数据加密**: 使用 AES/RSA 加密敏感数据
2. **签名验证**: 验证邮政回调签名
3. **HTTPS**: 使用 HTTPS 通信
4. **国密算法**: 支持 SM4 国密加密

---

## 相关文件清单

```
src/com/fanglin/postar/
├── action/
│   └── PostarAction.java                 - 快递回调 ★
├── service/
│   └── PostarService.java                - 快递服务 ★
├── airpos/
│   ├── Airpos.java                       - 移动支付
│   └── Wxpay.java                        - 微信支付
└── utils/
    ├── AesUtil.java                      - AES加密
    ├── Base64Util.java                   - Base64
    ├── HttpUtil.java                     - HTTP工具
    ├── RsaUtil.java                      - RSA加密
    ├── ShaUtil.java                      - SHA哈希
    ├── SM4.java / SM4Utils.java          - 国密SM4
    └── Test.java                         - 测试
```

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化邮政快递集成模块 AI 上下文文档
- 记录快递下单、物流查询、回调处理等功能
- 补充加密工具与安全注意事项
