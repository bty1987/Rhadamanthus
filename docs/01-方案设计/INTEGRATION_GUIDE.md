# 报价单预算员自动分配功能 - 集成指南

> **版本**: v1.0
> **创建日期**: 2026-03-13
> **目标用户**: 开发人员

---

## 📋 概述

本文档说明如何在现有系统中集成和使用报价单预算员自动分配功能。

---

## 🚀 快速开始

### 1. 数据库部署

```bash
# 执行数据库脚本
mysql -u root -p < sqls/add_quotation_budget_assignment.sql

# 验证表创建
mysql -u root -p -e "USE quotation; SHOW TABLES LIKE '%quotation%';"
```

### 2. 准备测试数据

```sql
-- 1. 添加预算员规则
INSERT INTO quotation.quotationuserrule (uid, company, department, status, currentTaskCount)
VALUES
(1001, 1, 10, 1, 0),  -- 预算员A
(1002, 1, 10, 1, 0),  -- 预算员B
(1003, 1, 11, 1, 0);  -- 预算员C

-- 2. 配置预算员类型（burid=1 支持半包和整装-全能预算员）
INSERT INTO quotation.quotationuserruletype (burid, type) VALUES (1, 1);
INSERT INTO quotation.quotationuserruletype (burid, type) VALUES (1, 2);

-- burid=2 只支持半包
INSERT INTO quotation.quotationuserruletype (burid, type) VALUES (2, 1);

-- burid=3 只支持整装
INSERT INTO quotation.quotationuserruletype (burid, type) VALUES (3, 2);

-- 3. 启用预算配置（公司1启用自动分配）
INSERT INTO quotation.quotationconfig (company, department, enabled, autoAssign)
VALUES (1, NULL, 1, 1);
```

---

## 🔌 API 接口使用

### 1. 自动分配预算员

**接口**: `POST /autoAssignBudgetUser.do`

**请求参数**:
```json
{
  "orderId": "1501020001",
  "companyId": 1,
  "decorationType": 1
}
```

**响应示例**:
```json
{
  "success": true,
  "budgetUid": 1001,
  "message": "预算员分配成功"
}
```

**或无可用预算员时**:
```json
{
  "success": false,
  "budgetUid": null,
  "message": "无可用预算员，已加入待分配队列"
}
```

**或类型不匹配时**:
```json
{
  "success": false,
  "budgetUid": null,
  "message": "当前无预算员支持该装修类型（整装），请联系管理员配置预算员类型"
}
```

---

### 2. 手动分配预算员

**接口**: `POST /manualAssignBudgetUser.do`

**请求参数**:
```json
{
  "orderId": "1501020001",
  "budgetUid": 1001,
  "assignUid": 2001
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "手动分配成功"
}
```

---

### 3. 重新分配预算员

**接口**: `POST /reassignBudgetUser.do`

**请求参数**:
```json
{
  "orderId": "1501020001",
  "newBudgetUid": 1002,
  "assignUid": 2001
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "重新分配成功"
}
```

---

### 4. 完成报价单（触发反向自动分配）

**接口**: `POST /finishQuotation.do`

**请求参数**:
```json
{
  "orderId": "1501020001"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "报价单已完成"
}
```

---

### 5. 检查配置状态

**接口**: `POST /isQuotationAssignEnabled.do`

**请求参数**:
```json
{
  "companyId": 1,
  "departmentId": 10
}
```

**响应示例**:
```json
{
  "enabled": true,
  "autoAssign": true
}
```

---

## 🔧 现有代码集成

### 方式1: 在 QuotationAction 中集成（推荐）

修改 `src/com/fanglin/quotation/action/QuotationAction.java`，在 `addQuotation` 方法中集成自动分配功能：

```java
@Action(value = "addQuotation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
public String addQuotation() throws FLException {
	// 原有逻辑：创建报价单
	quotationService.addQuotation(quotation, queryUserId(), queryCompany());

	// ===== 新增：自动分配预算员 =====
	// 1. 检查是否启用预算分配功能
	@Autowired
	private QuotationAssignService quotationAssignService;

	boolean enabled = quotationAssignService.isQuotationAssignEnabled(
		queryCompany(), quotation.getDepartment());

	if (enabled) {
		// 2. 获取装修单信息
		String orderId = quotation.getOrderId();

		try {
			// 3. 自动分配预算员
			Integer budgetUid = quotationAssignService.autoAssignBudgetUser(
				orderId, queryCompany(), quotation.getType());

			if (budgetUid != null) {
				// 分配成功
				System.out.println("预算员自动分配成功: " + budgetUid);
			} else {
				// 无可用预算员，已进入待分配队列
				System.out.println("无可用预算员，已加入待分配队列");
			}
		} catch (Exception e) {
			// 类型不匹配等错误
			System.err.println("预算员分配失败: " + e.getMessage());
			// 可以选择是否抛出异常
			// throw new FLException(e.getMessage());
		}
	}
	// ===== 新增结束 =====

	return SUCCESS;
}
```

---

### 方式2: 在前端页面中调用

在图纸页面 (`WebContent/views/decoration/decorationPicture.html`) 中添加"发起预算制作"按钮：

```javascript
// 在 decorationPicture.js 中添加
$(document).ready(function() {
	// 检查是否显示"发起预算制作"按钮
	checkBudgetAssignButton();

	// 绑定发起预算制作按钮事件
	$('#initiateBudgetBtn').on('click', function() {
		initiateBudgetProduction();
	});
});

// 检查是否显示按钮
function checkBudgetAssignButton() {
	// 获取装修单信息
	var orderId = com.params.orderId;

	com.post(api.decoration.queryDecorationByOrderId, {
		"decoration.orderId": orderId
	}, function(res) {
		var decoration = res.decoration;

		// 检查是否有图纸
		com.post(api.decoration.hasPicture, {
			"orderId": orderId
		}, function(pictureRes) {
			var hasPicture = pictureRes.hasPicture;
			var hasBudgetUser = decoration.budgetUid != null;

			// 只有在有图纸且未分配预算员时才显示按钮
			if (hasPicture && !hasBudgetUser) {
				$('#initiateBudgetBtn').show();
			} else {
				$('#initiateBudgetBtn').hide();
			}
		});
	});
}

// 发起预算制作
function initiateBudgetProduction() {
	var orderId = com.params.orderId;

	// 确认对话框
	com.confirm('确认发起预算制作？系统将自动分配预算员。', function() {
		com.post(api.quotationAssign.autoAssignBudgetUser, {
			"orderId": orderId,
			"companyId": com.params.companyId
		}, function(res) {
			if (res.success) {
				if (res.budgetUid) {
					// 分配成功
					com.showAlert(com.info, '预算员分配成功：' + res.budgetUid);
					// 刷新页面
					com.refreshPage();
				} else {
					// 无可用预算员，已进入待分配队列
					com.showAlert(com.warning, '无可用预算员，已加入待分配队列');
				}
			} else {
				// 分配失败
				com.showAlert(com.error, res.message || '预算员分配失败');
			}
		});
	});
}
```

在 `WebContent/js/api/quotation.js` 中添加 API 定义：

```javascript
$.extend(api, {
	quotationAssign: {
		// 自动分配预算员
		autoAssignBudgetUser: {
			url: "autoAssignBudgetUser.do"
		},
		// 手动分配预算员
		manualAssignBudgetUser: {
			url: "manualAssignBudgetUser.do"
		},
		// 重新分配预算员
		reassignBudgetUser: {
			url: "reassignBudgetUser.do"
		},
		// 完成报价单
		finishQuotation: {
			url: "finishQuotation.do"
		},
		// 检查配置
		isQuotationAssignEnabled: {
			url: "isQuotationAssignEnabled.do"
		}
	}
});
```

---

### 方式3: 在报价完成时触发反向分配

在 `QuotationService` 或相关 Service 中，当报价单完成时调用：

```java
@Autowired
private QuotationAssignService quotationAssignService;

public void completeQuotation(String orderId) {
	// ... 原有的报价单完成逻辑 ...

	// 新增：触发反向自动分配
	try {
		quotationAssignService.finishQuotation(orderId);
		logger.info("已触发反向自动分配，装修单号: " + orderId);
	} catch (Exception e) {
		logger.error("反向自动分配失败: " + e.getMessage(), e);
		// 不影响主流程
	}
}
```

---

## 📊 数据流程图

### 正向自动分配流程

```
设计师点击"发起预算制作"
    ↓
调用 autoAssignBudgetUser 接口
    ↓
检查装修单是否已分配预算员
    ↓
获取装修单类型（半包/整装）
    ↓
查找待分配且类型匹配的预算员
    ↓
┌─────────────┬─────────────┬─────────────┐
│   分支1     │   分支2     │   分支3     │
│ 找到且      │   无预算员  │   类型不    │
│ 类型匹配    │             │   匹配      │
└─────────────┴─────────────┴─────────────┘
    ↓              ↓              ↓
执行分配     进入待分配队列   返回错误提示
    ↓              ↓              ↓
更新装修单   创建待分配请求   发送错误通知
    ↓              ↓
发送通知     发送队列通知
```

### 反向自动分配流程

```
预算员完成报价单
    ↓
调用 finishQuotation 接口
    ↓
删除 quotationassignrequest 记录
    ↓
更新预算员状态（待分配）
    ↓
检查待分配队列
    ↓
查找类型匹配且最优先的任务
    ↓
自动分配给当前预算员
    ↓
更新装修单和请求状态
    ↓
发送通知：已从队列自动分配
```

---

## 🧪 测试步骤

### 1. 单元测试

测试自动分配功能：

```bash
# 在测试类中
@Test
public void testAutoAssign() {
	// 准备测试数据
	String orderId = "1501020001";
	Integer companyId = 1;
	Byte decorationType = 1; // 半包

	// 调用接口
	Integer result = quotationAssignService.autoAssignBudgetUser(
		orderId, companyId, decorationType);

	// 验证结果
	assertNotNull(result);

	// 验证数据库
	DecorationPO decoration = decorationDao.findByOrderId(orderId);
	assertEquals(result, decoration.getBudgetUid());
}
```

### 2. 集成测试

通过 Postman 或前端页面测试：

```bash
# 1. 自动分配测试
curl -X POST http://localhost:8080/Rhadamanthus/autoAssignBudgetUser.do \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "orderId=1501020001&companyId=1&decorationType=1"

# 2. 手动分配测试
curl -X POST http://localhost:8080/Rhadamanthus/manualAssignBudgetUser.do \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "orderId=1501020002&budgetUid=1001&assignUid=2001"

# 3. 重新分配测试
curl -X POST http://localhost:8080/Rhadamanthus/reassignBudgetUser.do \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "orderId=1501020003&newBudgetUid=1002&assignUid=2001"

# 4. 完成报价单测试
curl -X POST http://localhost:8080/Rhadamanthus/finishQuotation.do \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "orderId=1501020001"
```

### 3. 前端测试

1. 登录系统
2. 进入图纸页面
3. 点击"发起预算制作"按钮
4. 观察分配结果
5. 检查预算员是否收到通知

---

## ⚠️ 注意事项

### 1. 配置检查

在使用自动分配功能前，务必检查配置：

```sql
-- 查看预算配置
SELECT * FROM quotation.quotationconfig WHERE company = 1;

-- 查看预算员规则
SELECT * FROM quotation.quotationuserrule WHERE company = 1;

-- 查看预算员类型配置
SELECT * FROM quotation.quotationuserruletype;
```

### 2. 类型匹配

确保预算员已配置支持的类型：

```sql
-- 查看预算员支持的所有类型
SELECT u.uid, u.userName, t.type
FROM quotation.quotationuserrule u
LEFT JOIN quotation.quotationuserruletype t ON u.burid = t.burid
WHERE u.company = 1;
```

### 3. 状态监控

监控预算员状态：

```sql
-- 查看预算员当前状态
SELECT
	u.uid,
	u.userName,
	u.status,
	u.currentTaskCount,
	u.lastFinishTime
FROM quotation.quotationuserrule u
WHERE u.company = 1
ORDER BY u.lastFinishTime ASC;
```

### 4. 待分配队列

查看待分配队列：

```sql
-- 查看待分配队列
SELECT
	r.orderId,
	r.decorationType,
	r.priority,
	r.requestTime,
	d.cuid AS designerUid
FROM quotation.quotationassignrequest r
LEFT JOIN decoration.decoration d ON r.orderId = d.orderId
WHERE r.status = 1 AND r.company = 1
ORDER BY r.priority ASC, r.requestTime ASC;
```

---

## 🐛 常见问题

### Q1: 自动分配失败，提示"无预算员支持该类型"

**原因**: 当前公司的所有预算员都没有配置支持该装修类型（半包或整装）

**解决方法**:
```sql
-- 为预算员添加类型配置
INSERT INTO quotation.quotationuserruletype (burid, type)
SELECT burid, 1 FROM quotation.quotationuserrule WHERE uid = 1001;
```

### Q2: 报价单一直处于待分配队列状态

**原因**: 没有可用的预算员（所有预算员都是"制作中"状态）

**解决方法**:
1. 等待预算员完成当前任务
2. 或手动调整预算员状态为"待分配"
3. 或手动分配预算员

### Q3: 如何禁用自动分配功能？

**方法1**: 修改配置
```sql
UPDATE quotation.quotationconfig SET enabled = 0 WHERE company = 1;
```

**方法2**: 删除配置
```sql
DELETE FROM quotation.quotationconfig WHERE company = 1;
```

### Q4: 如何查看分配历史？

```sql
SELECT
	r.orderId,
	r.uid,
	r.assignType,
	r.assignResult,
	r.assignTime,
	r.failReason
FROM quotation.quotationassignrecord r
WHERE r.orderId = '1501020001'
ORDER BY r.assignTime DESC;
```

---

## 📞 技术支持

如有问题，请联系：
- 查看设计文档: `docs/DESIGN_quotation_budget_assignment.md`
- 查看实施总结: `docs/IMPLEMENTATION_SUMMARY.md`
- 查看项目知识库: `docs/KNOWLEDGE_BASE.md`

---

**更新时间**: 2026-03-13
**维护者**: AI Assistant
