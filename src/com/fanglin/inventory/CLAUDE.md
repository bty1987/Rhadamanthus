# inventory - 库存管理模块

> 最后更新：2026-03-24

---

## 📋 模块概述

**模块名称**：inventory（库存管理）

**职责描述**：材料采购、入库出库、库存盘点、仓库管理、辅料管理

**核心功能**：
- 采购订单管理（Purchase）
- 入库出库单据（Manifest）
- 辅料领用管理（Accessories）
- 仓库与库存管理（Storehouse/Stock）
- 库存盘点（CheckList）
- 单据模板管理（ManifestTemplate）
- 库存图纸管理（InventoryDrawing）

---

## 🏗️ 架构设计

### 目录结构

```
src/com/fanglin/inventory/
├── action/          # 控制器层（15个）
├── service/         # 业务逻辑层（33个）
├── dao/             # 数据访问层（33个）
├── po/              # 持久化对象（21个）
└── vo/              # 值对象（21个）
```

### 核心实体

| 实体 | 说明 | 关键字段 |
|------|------|----------|
| **ManifestPO** | 入库出库单据 | mid, code, type, status |
| **ManifestItemPO** | 单据明细项 | miid, 数量, 单价 |
| **PurchasePO** | 采购订单 | pid, code, status, balanceStatus |
| **PurchaseItemPO** | 采购明细项 | piid, 数量, 单价 |
| **AccessoriesPO** | 辅料领用单 | aid, no, status, type |
| **AccessoriesItemPO** | 辅料明细项 | aiiid, 数量, 单价 |
| **StorehousePO** | 仓库信息 | shid, code, name, status |
| **StorehouseStockPO** | 库存记录 | ssid, 商品, 仓库, 数量 |
| **StorehouseUserPO** | 仓库管理员 | suid, 仓库, 用户 |
| **CheckListPO** | 盘点单 | clid, code, 盘点类型 |
| **ManifestTemplatePO** | 单据模板 | mtid, name, type |
| **OccessoriesPO** | 外辅费用单 | oid, no, status |
| **OccessoriesCostPO** | 外辅费用明细 | ocid, 费用项, 金额 |

---

## 🔄 业务流程

### 单据类型（Manifest Type）

| 类型码 | 名称 | 方向 | 说明 |
|--------|------|------|------|
| CG (1) | 进货 | 入库 | 主材供应商进货 |
| CR (2) | 进退 | 出库 | 退货给供应商 |
| XG (3) | 出货 | 出库 | 主材销售出库 |
| XB (4) | 出返 | 入库 | 客户退货入库 |
| PU (6) | 采购 | 入库 | 采购入库 |
| AS (7) | 辅料 | 出库 | 辅料领用出库 |
| AR (8) | 辅退 | 入库 | 辅料退回入库 |
| CP (11) | 盘盈 | 入库 | 盘点盈余入库 |
| CL (12) | 盘亏 | 出库 | 盘点亏损出库 |

### 辅料领用流程（Accessories Status）

| 状态码 | 名称 | 说明 |
|--------|------|------|
| 0 | 初始 | 创建待审批 |
| 1 | 预出 | 审批通过待领料 |
| 2 | 出货 | 已领料出库 |
| 3 | 撤销 | 已撤销 |
| 4 | 拒绝 | 审批拒绝 |
| 5 | 退回 | 退回重审 |
| 6 | 到货 | 已到货 |
| 7 | 审批 | 审批中 |

### 采购订单流程

| 状态码 | 名称 | 说明 |
|--------|------|------|
| 0 | 初始 | 待审核 |
| 1 | 已审核 | 审核通过 |
| 2 | 已完成 | 采购完成 |

---

## 📊 数据模型

### Manifest - 入库出库单据

```java
// 主要字段
long mid;              // 单据ID
String code;           // 单据编号
short type;            // 单据类型（CG/CR/XG/XB/PU等）
short status;          // 状态（0-初始，1-确认）
UserPO creater;        // 创建人
Timestamp createTime;  // 创建时间
Timestamp manifestTime; // 单据时间
String comment;        // 备注
ManifestPO quoteManifest; // 关联单据
int company;           // 公司
```

### Purchase - 采购订单

```java
// 主要字段
long pid;              // 采购单ID
String code;           // 采购单号
short status;          // 状态
short balanceStatus;   // 结算状态
UserPO creater;        // 创建人
Timestamp createTime;  // 创建时间
```

### Accessories - 辅料领用

```java
// 主要字段
long aid;              // 领用单ID
String no;             // 领用单号
String orderId;        // 关联订单ID
HousePO house;         // 房屋信息
UserPO supervisor;     // 监工
UserPO creater;        // 创建人
UserPO approver;       // 审批人
short status;          // 状态
short type;            // 类型（0-普通，1-邮寄）
```

### Storehouse - 仓库

```java
// 主要字段
long shid;             // 仓库ID
String code;           // 仓库编码
String name;           // 仓库名称
short status;          // 状态（0-启用，1-停用）
```

---

## 🔌 核心接口

### ManifestAction - 单据管理

```java
// 分页查询单据
pageManifest(paging, filters, company)

// 根据单据ID查询
queryManifestByMid(manifest)

// 查询单据明细
queryManifestItemByMid(manifest)

// 创建入库单（进货）
addManifestForCG(manifest, items, userId, company)

// 创建出库单（出货）
addManifestForXG(manifest, items, sids, userId, company)

// 创建辅料出库单
addManifestForAS(accessories, items, userId, company)

// 确认单据
confirmManifest(manifest)
```

### PurchaseAction - 采购管理

```java
// 分页查询采购单
pagePurchase(paging, filters, company)

// 添加采购单
addPurchase(purchase, sids, items, userId, company)

// 更新采购单
updatePurchase(purchase)

// 更新状态
updatePurchaseForStatus(purchase)

// 更新结算状态
updatePurchaseForBalanceStatus(purchase)
```

### AccessoriesAction - 辅料领用

```java
// 分页查询辅料单
pageAccessories(paging, filters, company)

// 创建辅料领用单
addAccessories(accessories, items, userId)

// 预出库
preoutAccessories(accessories, userId)

// 审批
auditAccessories(accessories)

// 撤销
cancelAccessories(accessories, userId)

// 拒绝
refuseAccessories(accessories, userId)

// 配送
deliveAccessories(accessories, userId)
```

### StorehouseAction - 仓库管理

```java
// 分页查询仓库
pageStorehouse(paging, filters)

// 查询用户有权限的仓库
queryStorehouseForSelf(userId)

// 添加仓库
addStorehouse(storehouse)

// 更新仓库状态
updateStorehouseForStatus(storehouse)
```

---

## 🔗 模块依赖

### 依赖模块

| 模块 | 用途 |
|------|------|
| `personel` | 用户、员工信息 |
| `communion` | 商品、品牌、品类 |
| `sales` | 主材销售订单 |
| `decoration` | 装饰订单 |
| `data` | 材料数据字典 |

### 被依赖模块

| 模块 | 用途 |
|------|------|
| `sales` | 主材销售出库 |
| `balance` | 财务结算 |
| `construction` | 施工领料 |

---

## 🎯 典型场景

### 场景1：主材销售出库

```
1. 创建销售订单（sales模块）
2. 创建出库单（XG类型）
3. 添加出库明细项
4. 确认出库
5. 扣减库存
```

### 场景2：辅料领用流程

```
1. 创建辅料领用单（Accessories）
2. 添加辅料明细项
3. 监工审批
4. 预出库（状态变为预出）
5. 仓管发货（状态变为出货）
6. 扣减库存
```

### 场景3：采购入库

```
1. 创建采购单（Purchase）
2. 采购审核
3. 创建入库单（PU类型）
4. 添加入库明细项
5. 确认入库
6. 增加库存
```

### 场景4：库存盘点

```
1. 创建盘点单（CheckList）
2. 盘点实际库存
3. 生成盘盈/盘亏单（CP/CL类型）
4. 确认单据
5. 调整库存
```

---

## 🔑 关键表结构

```sql
-- 入库出库单据
CREATE TABLE inventory.manifest (
    mid BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50),           -- 单据编号
    type SMALLINT,              -- 单据类型
    status SMALLINT,            -- 状态
    cuid BIGINT,                -- 创建人
    qmid BIGINT,                -- 引用单据ID
    manifestTime TIMESTAMP,     -- 单据时间
    comment TEXT,               -- 备注
    attachment VARCHAR(255),    -- 附件
    company INT                 -- 公司
);

-- 单据明细
CREATE TABLE inventory.manifestitem (
    miid BIGINT PRIMARY KEY AUTO_INCREMENT,
    mid BIGINT,                 -- 单据ID
    siid BIGINT,                -- 商品ID
    quantity DECIMAL(10,2),     -- 数量
    price DECIMAL(10,2),        -- 单价
    total DECIMAL(10,2)         -- 金额
);

-- 采购订单
CREATE TABLE inventory.purchase (
    pid BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50),           -- 采购单号
    status SMALLINT,            -- 状态
    balanceStatus SMALLINT,     -- 结算状态
    cuid BIGINT,                -- 创建人
    createTime TIMESTAMP        -- 创建时间
);

-- 辅料领用单
CREATE TABLE inventory.accessories (
    aid BIGINT PRIMARY KEY AUTO_INCREMENT,
    no VARCHAR(50),             -- 领用单号
    orderId VARCHAR(50),        -- 关联订单
    hid BIGINT,                 -- 房屋ID
    suid BIGINT,                -- 监工ID
    cuid BIGINT,                -- 创建人
    auid BIGINT,                -- 审批人
    status SMALLINT,            -- 状态
    type SMALLINT,              -- 类型
    fetchTime TIMESTAMP,        -- 领料时间
    company INT                 -- 公司
);

-- 仓库
CREATE TABLE inventory.storehouse (
    shid BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50),           -- 仓库编码
    name VARCHAR(100),          -- 仓库名称
    status SMALLINT             -- 状态
);

-- 库存
CREATE TABLE inventory.storehousestock (
    ssid BIGINT PRIMARY KEY AUTO_INCREMENT,
    shid BIGINT,                -- 仓库ID
    siid BIGINT,                -- 商品ID
    quantity DECIMAL(10,2),     -- 库存数量
    lockQuantity DECIMAL(10,2)  -- 锁定数量
);
```

---

## 📝 开发注意事项

### 单据类型与状态
- 所有入库出库操作都通过 Manifest 单据进行
- 单据类型（type）决定了入库还是出库
- 单据状态：0-初始，1-已确认

### 库存更新
- 入库操作：增加库存数量
- 出库操作：扣减库存数量
- 库存更新在确认单据时触发

### 权限控制
- 仓库管理员通过 StorehouseUser 配置
- 用户只能操作有权限的仓库
- 辅料领用需要监工审批

### 外辅费用
- Occessories 管理外协加工费用
- OccessoriesCost 管理费用明细
- OccessoriesCharge 管理费用核销

---

## 🔗 相关文档

- [项目主文档](../../../CLAUDE.md)
- [模块开发规范](../../../docs/MODULE_DEVELOPMENT_STANDARDS.md)
- [数据字典模块](../data/CLAUDE.md)
- [主材销售模块](../sales/CLAUDE.md)
- [装饰订单模块](../decoration/CLAUDE.md)

---

**文档维护者**: Claude Code
**创建时间**: 2026-03-24
**最后更新**: 2026-03-24
