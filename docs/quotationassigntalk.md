# QuotationAssignTalk - 报价分配沟通消息模块

> 模块版本: 1.0 | 创建日期: 2026-04-30 | 作者: Claude AI

---

## 一、功能概述

报价分配沟通消息模块（QuotationAssignTalk）为设计师和预算员提供了基于装修单号的实时沟通能力，依托于现有的报价分配请求队列（QuotationAssignRequest），在消息持久化的同时自动发送钉钉通知。

**核心功能：**
- 设计师和预算员按装修单号进行一对一沟通
- 消息类型自动识别（根据当前分配请求判断发送人角色）
- 发送消息时自动推送钉钉通知给对方
- 两个前端入口：分配请求页面 + 装修详情页面

---

## 二、数据库

### 表结构：quotationassigntalk（catalog: quotation）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| qatid | BIGINT(20) PK AUTO_INCREMENT | 是 | 消息ID |
| orderId | VARCHAR(15) | 是 | 装修单号（关联 decoration.orderId） |
| senderUid | INT(11) | 是 | 发送人用户ID（关联 user.uid） |
| content | VARCHAR(2000) | 是 | 消息内容 |
| sendTime | TIMESTAMP | 是 | 发送时间 |
| type | SMALLINT(6) | 是 | 消息类型：1=设计师→预算员，2=预算员→设计师 |
| createTime | TIMESTAMP | 是 | 创建时间 |

**索引：**
- PRIMARY KEY (qatid)
- KEY idx_orderId (orderId)
- KEY idx_sendTime (sendTime)

---

## 三、后端架构

### 3.1 分层结构

```
com.fanglin.quotation/
├── po/QuotationAssignTalkPO.java        # Hibernate实体
├── vo/QuotationAssignTalkVO.java        # 视图对象
├── dao/QuotationAssignTalkDao.java      # DAO接口
├── dao/impl/QuotationAssignTalkDaoImpl.java  # DAO实现
├── service/QuotationAssignTalkService.java   # Service接口
├── service/impl/QuotationAssignTalkServiceImpl.java  # Service实现
└── action/QuotationAssignTalkAction.java     # Struts2 Action
```

### 3.2 关键设计

**PO实体（QuotationAssignTalkPO）：**
- 主键: qatid (Long)
- sender字段: `@ManyToOne(fetch=LAZY)` 关联 UserPO，外键 senderUid
- `ptv()` 方法: BeanUtils.copyProperties + sender.setBaseInfo()
- 常量: `TYPE_DESIGNER_TO_BUDGETER_INT=1`, `TYPE_BUDGETER_TO_DESIGNER_INT=2`

**Service核心逻辑（sendQuotationAssignTalk）：**
1. 通过 UserDao.queryUserByUserId(senderUserId) 获取发送人
2. 通过 QuotationAssignRequestDao.queryActiveByOrderId(orderId) 获取分配请求
3. 比对发送人uid与请求中的设计师(requestUser)/预算员(user)，自动判断角色
4. 保存消息到数据库
5. 调用 dingTalkMessageService.sendDing() 发送钉钉通知给对方

**Action接口：**
| Action URL | 说明 | 参数 | 返回 |
|------------|------|------|------|
| queryQuotationAssignTalkByOrderId.do | 查询消息列表 | quotationAssignTalk.orderId | quotationAssignTalks (List) |
| sendQuotationAssignTalk.do | 发送消息 | quotationAssignTalk.orderId, quotationAssignTalk.content | quotationAssignTalk (单个) |

### 3.3 Spring/Hibernate配置

**无需修改配置文件**，以下自动扫描机制已覆盖：
- Spring: `<context:component-scan base-package="com.fanglin" />`
- Hibernate: `<property name="packagesToScan" value="com.fanglin.*.po" />`
- Struts: Convention插件自动发现 @Action 注解

---

## 四、前端入口

### 4.1 报价分配请求页面（quotationAssignRequest.html）

- **入口位置**: 每行分配请求的行按钮"沟通"
- **弹窗**: #talkModal（已在HTML中定义）
- **JS逻辑**: quotationAssignRequest.js 中的 openTalkModal / loadTalkMessages / sendTalkMessage

**使用流程：**
1. 用户在分配请求列表中点击某行的"沟通"按钮
2. 弹出沟通弹窗，自动加载该 orderId 的所有消息
3. 在输入框中输入消息，按回车或点击"发送"按钮发送
4. 发送成功后自动刷新消息列表并滚动到底部

### 4.2 装修详情页面（decoration4detail.html）

- **入口位置**: "交接单"按钮旁边的"分配沟通"按钮
- **弹窗**: #decorationTalkModal（已在HTML中定义）
- **JS逻辑**: decoration4detail.js 中的 loadDecorationTalkMessages / sendDecorationTalkMessage
- **按钮创建**: decorationPageUtils.js 中的 $assignTalkBtn

**使用流程：**
1. 用户在装修详情页的放线方案区域，点击"分配沟通"按钮
2. 自动使用当前装修单号（decorationDetail.orderId）
3. 弹出沟通弹窗，操作方式与分配请求页面相同

### 4.3 API定义

在 `js/api/quotation.js` 中新增：
```javascript
queryQuotationAssignTalkByOrderId: {
    url: "queryQuotationAssignTalkByOrderId.do",
    result: "quotationAssignTalks"
},
sendQuotationAssignTalk: {
    url: "sendQuotationAssignTalk.do",
    result: "quotationAssignTalk"
}
```

**调用方式：**
```javascript
// 查询消息列表
com.post(api.quotation.queryQuotationAssignTalkByOrderId, {
    "quotationAssignTalk.orderId": orderId
}, function(res) {
    var talks = res.quotationAssignTalks || [];
});

// 发送消息
com.post(api.quotation.sendQuotationAssignTalk, {
    "quotationAssignTalk.orderId": orderId,
    "quotationAssignTalk.content": content
}, function(res) { });
```

---

## 五、钉钉通知

发送消息时，系统自动向对方发送钉钉消息，格式：

```
【报价分配沟通】{发送人姓名} 发来消息：
装修单号：{orderId}
内容：{消息内容}
```

**发送逻辑：**
- 设计师发送 → 钉钉通知预算员
- 预算员发送 → 钉钉通知设计师
- 钉钉发送失败不影响消息保存（try-catch包容）

**钉钉调用：** `dingTalkMessageService.sendDing(receiver.getUserId(), message, company)`

---

## 六、文件清单

### 新建文件（7个）

| 文件 | 说明 | 大小 |
|------|------|------|
| src/com/fanglin/quotation/po/QuotationAssignTalkPO.java | 实体类 | 4.4KB |
| src/com/fanglin/quotation/vo/QuotationAssignTalkVO.java | 视图对象 | 1.7KB |
| src/com/fanglin/quotation/dao/QuotationAssignTalkDao.java | DAO接口 | 0.9KB |
| src/com/fanglin/quotation/dao/impl/QuotationAssignTalkDaoImpl.java | DAO实现 | 1.3KB |
| src/com/fanglin/quotation/service/QuotationAssignTalkService.java | Service接口 | 1.6KB |
| src/com/fanglin/quotation/service/impl/QuotationAssignTalkServiceImpl.java | Service实现 | 5.6KB |
| src/com/fanglin/quotation/action/QuotationAssignTalkAction.java | Action控制器 | 4.0KB |

### 修改文件（6个）

| 文件 | 修改内容 |
|------|----------|
| WebContent/js/api/quotation.js | 新增2个API定义 |
| WebContent/views/quotation/quotationAssignRequest.html | 新增沟通弹窗HTML |
| WebContent/js/quotation/quotationAssignRequest.js | 新增"沟通"行按钮及交互逻辑 |
| WebContent/views/decoration/decoration4detail.html | 新增沟通弹窗HTML |
| WebContent/js/decoration/decoration4detail.js | 新增沟通按钮事件和交互逻辑 |
| WebContent/js/utils/decorationPageUtils.js | 新增"分配沟通"按钮定义和挂载 |

---

## 七、注意事项

1. **数据库表已创建**：quotationassigntalk 表已在 quotation 库中创建（生产环境：192.168.5.21）
2. **自动角色判断**：依赖 QuotationAssignRequestDao.queryActiveByOrderId() 查询活跃的分配请求，若无活跃请求则默认作为设计师发送
3. **LAZY加载**：sender 字段使用 FetchType.LAZY，确保在事务内访问
4. **钉钉公司参数**：使用发送人的 company 字段（UserPO.getCompany() 返回 int）
5. **前端防重复**：建议后续增加发送按钮防重复点击机制
