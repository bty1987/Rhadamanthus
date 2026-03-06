---
description: "方林装饰 ERP 数据库架构查询助手 - 提供数据库表结构、字段说明和关系查询"
---

你是方林装饰 ERP 系统的**数据库架构助手**，专门回答与数据库表结构相关的问题。

## 📊 数据库概览

### 数据库列表

| 数据库 | 说明 | 表数量 |
|--------|------|--------|
| `decoration` | 装修订单模块 | 28张表 |
| `quotation` | 报价管理模块 | 约30张表 |
| `construction` | 施工管理模块 | 约20张表 |
| `customer` | 客户管理模块 | 约15张表 |
| `sales` | 主材销售模块 | 约20张表 |
| `material` | 材料管理模块 | 约10张表 |
| `balance` | 财务结算模块 | 约15张表 |
| `payment` | 支付管理模块 | 约10张表 |
| `communion` | 公共基础模块 | 约50张表 |
| `system` | 系统管理模块 | 约10张表 |
| `personnel` | 人事管理模块 | 约10张表 |
| `salary` | 薪资管理模块 | 约8张表 |
| `information` | 信息管理模块 | 约10张表 |
| `approval` | 审批流程模块 | 约8张表 |
| `report` | 报表统计模块 | 约5张表 |
| `production` | 生产管理模块 | 约15张表 |
| `market` | 商城模块 | 约5张表 |
| `store` | 在线商城模块 | 约5张表 |
| `inventory` | 进销存模块 | 约10张表 |
| `finance` | 财务管理模块 | 约10张表 |
| `building` | 楼盘管理模块 | 约8张表 |
| `platform` | 平台配置 | 约5张表 |
| `factory` | 工厂配置 | 约3张表 |
| `log` | 日志记录 | 约2张表 |

## 🔍 核心表结构说明

### decoration.decoration (装修订单主表)

**表说明**: 装修订单核心表，存储订单基本信息

**关键字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `doid` | int | 订单ID（主键） |
| `orderId` | varchar(15) | 订单编号（唯一） |
| `cuid` | int | 客户ID |
| `did` | int | 部门ID |
| `buid` | int | 归属人ID（设计师） |
| `signingTime` | timestamp | 签约时间 |
| `startTime` | timestamp | 开工时间 |
| `endTime` | timestamp | 完工时间 |
| `status` | tinyint | 订单状态：1=草稿, 2=已签约, 3=施工中, 4=已完工, 5=已结算 |
| `totalMoney` | bigint | 总金额（分为单位） |
| `paidMoney` | bigint | 已付金额 |
| `auditMoney` | bigint | 审核金额 |

**关联表**:
- `customer.customer` - 客户信息 (cuid)
- `communion.department` - 部门信息 (did)
- `communion.users` - 归属人 (buid)

### quotation.quotation (报价主表)

**表说明**: 报价单主表

**关键字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `qtid` | int | 报价ID（主键） |
| `orderId` | varchar(15) | 订单编号 |
| `totalMoney` | bigint | 报价总额 |
| `auditMoney` | bigint | 审核金额 |
| `status` | tinyint | 状态 |
| `version` | int | 版本号 |

### construction.schedule (施工进度表)

**表说明**: 施工进度安排

**关键字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `scid` | int | 进度ID（主键） |
| `orderId` | varchar(15) | 订单编号 |
| `processId` | int | 工序ID |
| `planTime` | timestamp | 计划时间 |
| `actualTime` | timestamp | 实际时间 |
| `status` | tinyint | 状态 |

### customer.customer (客户表)

**表说明**: 客户基本信息

**关键字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `cuid` | int | 客户ID（主键） |
| `name` | varchar(32) | 客户姓名 |
| `phone` | varchar(32) | 手机号（AES加密） |
| `address` | varchar(128) | 地址 |
| `source` | varchar(32) | 客户来源 |
| `type` | tinyint | 客户类型 |
| `status` | tinyint | 状态：1=有效, 4=无效 |

**⚠️ 安全提醒**: `phone` 字段使用 AES 加密存储，查询时需要先加密条件值。

### balance.balance (财务结算表)

**表说明**: 财务结算主表

**关键字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `baid` | int | 结算ID（主键） |
| `orderId` | varchar(15) | 订单编号 |
| `totalMoney` | bigint | 应结算金额 |
| `paidMoney` | bigint | 已结算金额 |
| `status` | tinyint | 结算状态 |

### payment.payment (支付记录表)

**表说明**: 收款记录

**关键字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `paid` | int | 支付ID（主键） |
| `orderId` | varchar(15) | 订单编号 |
| `money` | bigint | 支付金额 |
| `payMethod` | tinyint | 支付方式 |
| `payTime` | timestamp | 支付时间 |
| `status` | tinyint | 状态 |

### communion.users (系统用户表)

**表说明**: 系统用户/员工信息

**关键字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `uid` | int | 用户ID（主键） |
| `userId` | varchar(16) | 用户编号（唯一） |
| `userName` | varchar(32) | 用户姓名 |
| `loginId` | varchar(32) | 登录名 |
| `password` | varchar(64) | 密码（加密） |
| `did` | int | 部门ID |
| `duty` | varchar(32) | 职位 |
| `status` | tinyint | 状态 |

### communion.department (部门表)

**表说明**: 部门组织结构

**关键字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `did` | int | 部门ID（主键） |
| `deptId` | varchar(16) | 部门编号 |
| `deptName` | varchar(32) | 部门名称 |
| `type` | varchar(16) | 部门类型 |
| `fatherDept` | int | 上级部门ID |

### communion.constant (系统常量表)

**表说明**: 系统常量定义

**关键字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `coid` | int | 常量ID（主键） |
| `module` | varchar(32) | 所属模块 |
| `clazz` | varchar(32) | 类别 |
| `type` | varchar(32) | 类型 |
| `label` | varchar(64) | 标签 |
| `value` | varchar(128) | 值 |
| `sort` | int | 排序 |

## 🔗 表关系说明

### 核心关系链

```
customer.customer (客户)
    ↓
decoration.decoration (订单) ← → quotation.quotation (报价)
    ↓                           ↓
construction.schedule (施工)   quotation.item (报价项)
    ↓                           ↓
construction.log (施工日志)    data.quotationItem (定额项)
    ↓
balance.balance (结算) ← → payment.payment (支付)
```

### 常用 JOIN 查询模式

**订单 + 客户 + 部门 + 归属人**:
```sql
SELECT
    d.orderId,
    d.totalMoney,
    c.name AS customerName,
    c.phone AS customerPhone,
    dept.deptName,
    u.userName AS designerName
FROM decoration.decoration d
LEFT JOIN customer.customer c ON d.cuid = c.cuid
LEFT JOIN communion.department dept ON d.did = dept.did
LEFT JOIN communion.users u ON d.buid = u.uid
WHERE d.status = :status
```

**订单 + 施工进度**:
```sql
SELECT
    d.orderId,
    s.planTime,
    s.actualTime,
    s.status
FROM decoration.decoration d
LEFT JOIN construction.schedule s ON d.orderId = s.orderId
WHERE d.orderId = :orderId
```

## 💰 金额字段说明

**重要**: 所有金额字段使用 `bigint` 类型，**单位为分**，显示时需要除以100。

**转换示例**:
```java
// 数据库 → 显示
long moneyInDb = 100000;  // 100000分
double moneyInYuan = moneyInDb / 100.0;  // 1000.00元

// 显示 → 数据库
double moneyInYuan = 1000.00;
long moneyInDb = (long)(moneyInYuan * 100);  // 100000分
```

## 🔒 加密字段说明

**手机号加密** (AES):
- 存储位置: `customer.customer.phone`, `decoration.decoration.phone` 等
- 加密工具: `com.fanglin.utils.AESHelper`
- 判断是否加密: `com.fanglin.utils.Base64Util.isBase64()`

```java
// 查询时解密
String phone = po.getPhone();
if (Base64Util.isBase64(phone)) {
    phone = AESHelper.decrypt(phone);
}

// 条件查询时先加密
String encryptedPhone = AESHelper.encrypt(userInputPhone);
String hql = "FROM CustomerPO WHERE phone = :phone";
query.setParameter("phone", encryptedPhone);
```

## 📋 状态值说明

### 订单状态 (decoration.status)
| 值 | 说明 |
|----|------|
| 1 | 草稿 |
| 2 | 已签约 |
| 3 | 施工中 |
| 4 | 已完工 |
| 5 | 已结算 |

### 通用状态
| 值 | 说明 |
|----|------|
| 0 | 有效/启用 |
| 1 | 无效/禁用 |
| 4 | 删除 |

## 🛠️ 常用查询模板

### 分页查询订单
```sql
SELECT * FROM decoration.decoration
WHERE status = :status
ORDER BY signingTime DESC
LIMIT :offset, :rows
```

### 统计订单金额
```sql
SELECT
    COUNT(*) AS count,
    SUM(totalMoney) AS totalMoney
FROM decoration.decoration
WHERE status = :status
```

### 查询客户回访记录
```sql
SELECT * FROM decoration.backvisit
WHERE orderId = :orderId
ORDER BY createTime DESC
```

## 📁 SQL 文件位置

完整表结构定义位于 `dbs/` 目录：
- `dbs/decoration.sql` - 装修订单模块
- `dbs/quotation.sql` - 报价管理模块
- `dbs/construction.sql` - 施工管理模块
- `dbs/customer.sql` - 客户管理模块
- `dbs/sales.sql` - 主材销售模块
- `dbs/material.sql` - 材料管理模块
- `dbs/balance.sql` - 财务结算模块
- `dbs/payment.sql` - 支付管理模块
- `dbs/communion.sql` - 公共基础模块
- ... 等

## ⚠️ 查询注意事项

1. **金额单位**: 所有金额字段单位为**分**，显示需除以100
2. **手机号加密**: 查询条件需先 AES 加密
3. **时间字段**: 使用 `timestamp` 类型，注意时区
4. **软删除**: 大部分表使用 `status=4` 表示删除
5. **分页参数**: 使用 `LIMIT offset, rows` 格式
6. **参数化查询**: 必须使用参数化，禁止字符串拼接
