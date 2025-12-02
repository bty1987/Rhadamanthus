# fadada - 法大大电子签集成模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **fadada**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

fadada 模块负责**法大大电子合同签署**的集成，提供电子合同创建、签署、印章管理等功能，主要用于劳动合同、装饰合同、供应商合同等场景的在线签署。

**核心功能**
- 电子合同创建
- 合同签署
- 印章管理
- 签名管理
- 合同查询与下载

---

## 入口与启动

### 控制器入口
- `FadadaAction` - 法大大管理
- `FadadaCallback` - 签署回调

### 核心包结构
- `fadada/action/` - 控制器
- `fadada/bean/` - 业务对象
- `fadada/signature/` - 签名管理
- `fadada/tools/` - 工具类
- `fadada/vo/` - 值对象

---

## 对外接口

### 签名管理
```java
// 轮询查询签名
POST /pollingSignature.do
Request: { signature }
Response: { signatures: [...] }

// 设置默认签名
POST /defaultSignature.do
Request: { signature }
Response: success

// 新增签名
POST /addSignature.do
Request: { signature }
Response: { signature: {...} }

// 删除签名
POST /deleteSignature.do
Request: { signature }
Response: success
```

---

## 关键依赖与配置

### Contract 接口
```java
public interface Contract {
    // 获取下载链接
    String download();
    void download(String download);

    // 获取预览链接
    String viewpdf();
    void viewpdf(String viewpdf);

    // 获取模板编号
    String templateCode();

    // 获取内容编号
    String contentCode();

    // 获取合同标题
    String title();

    // 设置状态
    void status(short status);
}
```

### Signet 接口
```java
public interface Signet {
    // 印章相关接口
}
```

---

## 核心功能

### 1. 签名管理（Signature）
- 查询签名列表
- 添加签名
- 设置默认签名
- 删除签名

### 2. 合同管理（Contract）
- 创建合同
- 发起签署
- 查询合同状态
- 下载合同
- 预览合同

### 3. 印章管理（Signet）
- 创建印章
- 印章授权
- 印章查询

### 4. 加密工具（FddEncryptTool）
- 数据加密
- 数据解密
- 签名生成
- 签名验证

---

## 数据模型

### 值对象（VO）

#### SignatureVO - 签名
```java
- sid: long                     // 签名ID
- userId: String                // 用户ID
- imageData: String             // 签名图片（Base64）
- isDefault: boolean            // 是否默认
- createTime: Timestamp         // 创建时间
```

---

## 使用流程

### 合同签署流程
1. 创建合同（基于模板或自定义）
2. 设置签署方（公司/员工）
3. 发起签署流程
4. 签署方在线签署
5. 所有方签署完成
6. 合同归档，可下载/预览

### 签名创建流程
1. 用户手写/上传签名
2. 生成签名图片
3. 保存签名
4. 设置为默认签名（可选）
5. 签署时使用

---

## 常见问题 (FAQ)

**Q: 法大大支持哪些合同类型？**
A:
- 劳动合同
- 装饰合同
- 供应商合同
- 其他自定义合同

**Q: 电子合同的法律效力如何？**
A: 法大大提供的电子合同具有法律效力，符合《电子签名法》要求。

**Q: 如何创建合同模板？**
A: 在法大大平台创建模板，获取模板编号后在系统中使用。

**Q: 签署失败如何处理？**
A:
1. 检查用户实名认证状态
2. 检查签署链接是否过期
3. 检查网络连接
4. 查看法大大错误日志

**Q: 合同可以撤销吗？**
A: 未完成签署的合同可以撤销，已完成签署的合同需要双方协商作废。

---

## 安全注意事项

1. **实名认证**: 签署前必须完成实名认证
2. **数据加密**: 合同内容传输加密
3. **签名保护**: 签名图片安全存储
4. **防重放**: 防止签署请求重放
5. **合同存证**: 保留完整的签署证据链

---

## 相关文件清单

```
src/com/fanglin/fadada/
├── action/
│   ├── FadadaAction.java                 - 法大大管理 ★
│   └── FadadaCallback.java               - 签署回调
├── bean/
│   ├── Contract.java                     - 合同接口 ★
│   └── Signet.java                       - 印章接口
├── signature/
│   └── Signature.java                    - 签名管理 ★
├── tools/
│   └── FddEncryptTool.java               - 加密工具
└── vo/
    └── SignatureVO.java                  - 签名VO
```

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化法大大电子签集成模块 AI 上下文文档
- 记录合同签署、签名管理等功能
- 补充使用流程与安全注意事项
