# 辅材与辅料费用开发文档

> **模块**: data.material (辅材) / inventory (辅料)
> **最后更新**: 2026-10-26
> **版本**: v1.4

---

## 📚 目录

1. [数据模型概述](#数据模型概述)
2. [辅材费用结构](#辅材费用结构)
3. [辅料费用结构](#辅料费用结构)
4. [费用计算逻辑](#费用计算逻辑)
5. [开发规范](#开发规范)
6. [常见业务场景](#常见业务场景)
7. [变更记录](#变更记录)

---

## 数据模型概述

### 核心概念区分

| 概念 | 英文 | 数据库 | 说明 | 示例 |
|------|------|--------|------|------|
| **辅材** | Aoods | `data.aoods` | 装修用标准材料的基础数据 | 水泥、沙子、钉子、胶水 |
| **辅材费用** | AoodsCharge | `data.aoodscharge` | 辅材的费用明细表 | 运输费、安装费、上楼费 |
| **辅料** | Accessories | `inventory.accessories` | 实际领用的辅料单 | 某工地的水泥领料单 |

**关系图**：
```
辅材(Aoods) - 基础数据字典
    ↓ 1:N
辅材费用(AoodsCharge) - 辅材的费用明细
    ↓ 被引用
辅料(Accessories) - 实际业务单据
    ↓ 包含
辅料明细(AccessoriesItem) - 具体材料明细
```

---

## 辅材费用结构

### 1. AoodsPO - 辅材基础数据

**文件位置**: `src/com/fanglin/data/po/AoodsPO.java`

**数据表**: `data.aoods`

**核心字段**：

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `aid` | `long` | 辅材ID（主键） | 1001 |
| `gid` | `long` | 商品ID（外键） | 5001 |
| `atid` | `long` | 辅材类型ID | 3 |
| `normunit` | `String` | 定额单位 | "袋" |
| `normnum` | `int` | 定额数量 | 2 |
| `storeunit` | `String` | 库房单位 | "kg" |
| `storenum` | `int` | 库房数量 | 50 |
| `balance` | `int` | 结算价（单位：厘，×1000） | 4500000 |
| `selling` | `int` | 销售价（单位：厘，×1000） | 5000000 |
| `status` | `short` | 状态 | 0-启用 |

> 🔴 **用户定调（2026-10-26）**：辅材费用**不落 `data.aoods` 列**——v1.0 文档中的 `aoodsCharge` 字段设计作废（代码与 DDL 中也从未落过该字段），费用一律按费用项逐行读写 `data.aoodscharge` 表，见下文 AoodsChargePO 一节。

**价格关系**：
```
data.aoods 表（价格体系不含费用）:   balance(结算价) → selling(销售价)
费用独立事实源:  data.aoodscharge 表行（price 价格 + surplus 浮动额，status=启用，按 sort 升序逐项累加）
```

### 2. AoodsChargePO - 辅材费用明细 ⭐ 新增

**文件位置**: `src/com/fanglin/data/po/AoodsChargePO.java`

**数据表**: `data.aoodscharge`

**核心字段**：

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `acid` | `long` | 费用ID（主键） | 10001 |
| `aid` | `long` | 辅材ID（外键） | 1001 |
| `name` | `String` | 费用名称 | "运输费" |
| `price` | `int` | 价格（单位：厘，×1000） | 5000000 |
| `surplus` | `int` | 浮动额（单位：厘，×1000） | 100000 |
| `type` | `short` | 类型：0-通用，1-超阶 | 0 |
| `status` | `short` | 状态：0-启用，1-禁用 | 0 |
| `sort` | `int` | 排序 | 1 |

**类型定义**：
```java
public static final short STATUS_ENABLE_SHORT = 0;  // 启用
public static final short STATUS_DISABLE_SHORT = 1; // 禁用

public static final short TYPE_COMMON_SHORT = 0;   // 通用费用
public static final short TYPE_UPGRADE_SHORT = 1;  // 超阶费用
```

**与 AoodsPO 的关系**：
- 一个辅材(AoodsPO) 可以有多个费用项(AoodsChargePO)
- 费用项包括：运输费、安装费、上楼费、搬运费等
- 每个费用项有独立的价格、浮动额、类型和状态

**使用场景**：
```java
// 查询某个辅材的所有启用的费用项（type 传 null 不过滤，sort 升序）
List<AoodsChargePO> charges = aoodsChargeDao.queryAoodsChargeByAid(aid, null);

// 计算辅材总费用（包含所有费用项，单位厘）
long totalCharge = 0;
for (AoodsChargePO charge : charges) {
    totalCharge = Arith.add(totalCharge, charge.getPrice());
}
```

### 3. AoodsCostPO - 辅材成本关联

**文件位置**: `src/com/fanglin/data/po/AoodsCostPO.java`

**数据表**: `data.aoodsCost`

**核心字段**：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `acid` | `long` | 成本ID（主键） |
| `aid` | `long` | 辅材ID（外键） |
| `ccid` | `long` | 施工费用ID（外键） |
| `numLimit` | `int` | 数量限制 |

**用途**：关联辅材与施工费用，控制辅材使用数量限制。

---

## 辅料费用结构

### 1. AccessoriesPO - 辅料单主表

**文件位置**: `src/com/fanglin/inventory/po/AccessoriesPO.java`

**数据表**: `inventory.accessories`

**核心字段**：

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `aid` | `long` | 辅料单ID（主键） | 20001 |
| `no` | `String` | 单号 | "23AO12230001" |
| `orderId` | `String` | 订单ID | "D20231201001" |
| `type` | `short` | 类型 | 0-普通 / 1-售后 |
| `status` | `short` | 状态 | 0-初始 / 1-预出 / 2-出货 |
| **`total`** | **`long`** | **辅料单总金额（分）** | **15000** |
| `printnum` | `int` | 打印次数 | 1 |
| `company` | `int` | 公司ID | 1 |

**状态流转**：
```
初始(0) → 预出(1) → 出货(2) → 到货(6)
   ↓         ↓
 撤销(3)   拒绝(4)
```

### 2. AccessoriesItemPO - 辅料单明细

**文件位置**: `src/com/fanglin/inventory/po/AccessoriesItemPO.java`

**数据表**: `inventory.accessoriesitem`

**核心字段**：

| 字段名 | 类型 | 说明 | 计算公式 |
|--------|------|------|----------|
| `aiid` | `long` | 明细ID（主键） | - |
| `aid` | `long` | 辅料单ID（外键） | - |
| `gid` | `long` | 商品ID（外键） | - |
| `selling` | `int` | 销售单价（分） | - |
| `num` | `int` | 数量 | - |
| `normunit` | `String` | 定额单位 | "袋" |
| `normnum` | `int` | 定额数量 | 2 |
| `storeunit` | `String` | 库房单位 | "kg" |
| `storenum` | `int` | 库房数量 | 50 |
| `surplus` | `int` | 剩余数量 | 初始值 = num |

**费用计算**：
```java
// 明细费用 = 单价 × 数量
long itemTotal = Arith.mul(accessoriesItemPO.getNum(), accessoriesItemPO.getSelling());
```

### 3. OccessoriesCostPO - 外辅费用

**文件位置**: `src/com/fanglin/inventory/po/OccessoriesCostPO.java`

**数据表**: `inventory.occessoriescost`

**核心字段**：

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `ocid` | `long` | 外辅费用ID（主键） | - |
| `oid` | `long` | 辅料单ID（外键） | - |
| `initPrice` | `int` | 初始价格（分） | 1000 |
| `price` | `int` | 金额（分，向客户收取） | 1200 |
| `cost` | `int` | 成本（分，实际支出） | 1000 |
| `type` | `short` | 费用类型 | 0-车运 / 1-搬运 / 2-上楼 |
| `status` | `short` | 状态 | 0-初始 |

**费用类型定义**：
```java
public static final short TYPE_VEHICLE_FREIGHT = 0;    // 车运费
public static final short TYPE_HANDLING_FEE = 1;       // 搬运费
public static final short TYPE_UPSTAIRS_FEE = 2;       // 上楼费
```

**初始化方法**：
```java
public OccessoriesCostPO init(long oid, int price, int cost, short type) {
    setOid(oid);
    setInitPrice(price);
    setPrice(price);
    setCost(cost);
    setType(type);
    return this;
}
```

---

## 费用计算逻辑

### 1. 辅料单总额计算

**文件位置**: `src/com/fanglin/inventory/service/impl/AccessoriesServiceImpl.java`

**计算公式**：
```java
// 辅料单总金额 = Σ(明细数量 × 明细单价)
long total = 0;
for (AccessoriesItemPO item : items) {
    total += Arith.mul(item.getNum(), item.getSelling());
}
accessoriesPO.setTotal(total);
```

### 2. 工程辅料总额累计

**添加辅料单时**：
```java
// 检查是否超限
if (Arith.add(constructionPO.getAccessoryTotal(), accessoriesVO.getTotal())
    > constructionPO.getAccessoryLimit()) {
    throw new FLException(260058, "辅料总额已达上限");
}

// 累加到工程辅料总额
constructionPO.setAccessoryTotal(
    Arith.add(constructionPO.getAccessoryTotal(), accessoriesVO.getTotal())
);
```

**撤销/拒绝辅料单时**：
```java
// 从工程辅料总额中扣除
constructionPO.setAccessoryTotal(
    Arith.sub(constructionPO.getAccessoryTotal(), total)
);
```

### 3. 工程辅料数量和费用累计

**添加时**：
```java
ConstructionAccessoryPO constructionAccessoryPO =
    constructionAccessoryDao.queryConstructionAccessory(constructionPO.getCid(), goods.getGid());

if (constructionAccessoryPO != null) {
    // 检查数量限制
    if (constructionAccessoryPO.getCheckup() == ConstructionAccessoryPO.CHECKUP_VERIFY_SHORT) {
        if (Arith.add(constructionAccessoryPO.getNum(), item.getNum())
            > constructionAccessoryPO.getNumLimit()) {
            throw new FLException(260059, "辅料总数已达上限");
        }
    }

    // 累加数量和费用
    constructionAccessoryPO.setTotal(
        Arith.add(constructionAccessoryPO.getTotal(),
                  Arith.mul(item.getNum(), item.getSelling()))
    );
    constructionAccessoryPO.setNum(
        Arith.add(constructionAccessoryPO.getNum(), item.getNum())
    );

    constructionAccessoryDao.update(constructionAccessoryPO);
}
```

**撤销时**：
```java
// 扣除数量和费用
constructionAccessoryPO.setTotal(
    Arith.sub(constructionAccessoryPO.getTotal(),
              Arith.mul(item.getNum(), item.getSelling()))
);
constructionAccessoryPO.setNum(
    Arith.sub(constructionAccessoryPO.getNum(), item.getNum())
);
```

### 4. 辅材费用（data.aoodscharge）使用场景

**🔴 取数唯一姿势**：费用行来自 `data.aoodscharge` 表，禁止读 `aoodsPO` 上的费用字段（该字段不存在，也不允许新增）：

```java
// 取某辅材全部启用费用项（status=启用，sort 升序，type 传 null 不过滤）
List<AoodsChargePO> charges = aoodsChargeDao.queryAoodsChargeByAid(aid, null);

// 费用合计 = Σ(启用费用行 price)，单位厘
long chargeTotal = 0;
for (AoodsChargePO charge : charges) {
    chargeTotal = Arith.add(chargeTotal, charge.getPrice());
}

// 只取通用费用
List<AoodsChargePO> commonCharges =
    aoodsChargeDao.queryAoodsChargeByAid(aid, AoodsChargePO.TYPE_COMMON_SHORT);
```

**消费方式由业务方决定**（报价/领料/核算是并入还是分列、超阶费用如何触发），本表只提供事实源；`selling`/`balance` 与费用行是两套口径，不得在消费点混算。

---

## 开发规范

### 1. 数据库字段命名规范

| 规范 | 示例 | 说明 |
|------|------|------|
| 价格字段 | `xxxCharge` / `xxxPrice` / `xxxCost` | 金额统一使用"分"作为单位 |
| 数量字段 | `xxxNum` / `xxxTotal` | 整数类型 |
| 单位字段 | `xxxUnit` | 字符串类型 |
| 状态字段 | `status` / `type` | short 类型 |

### 2. 金额计算规范

**使用工具类**：`com.fanglin.utils.Arith`

```java
// 加法
long result = Arith.add(a, b);

// 减法
long result = Arith.sub(a, b);

// 乘法
long result = Arith.mul(a, b);

// 除法
long result = Arith.div(a, b);
```

**注意事项**：
- ✅ 所有金额计算必须使用 `Arith` 工具类
- ✅ 金额单位统一使用"分"
- ✅ 避免浮点数运算，使用 `long` 类型

### 3. 辅材费用取数与维护流程（🔴 以 data.aoodscharge 表为准）

**用户定调（2026-10-26）**：辅材费用不落 `data.aoods` 列，一律读写 `data.aoodscharge` 表；v1.0 文档中"PO/VO/ptv/ALTER 四步加 aoodsCharge 字段"的教程随该定调作废。

**读取**（业务消费方）：
```java
// 取某辅材全部启用费用项（status=启用，sort 升序，type 传 null 不过滤）
List<AoodsChargePO> charges = aoodsChargeDao.queryAoodsChargeByAid(aid, null);
```

**维护**（管理端五层已建齐，勿重复建设）：
- 页面：`WebContent/views/data/aoodsCharge.html` + `WebContent/js/data/aoodsCharge.js`（aoods 行按钮弹层）
- 接口：`pageAoodsCharge` / `queryAoodsChargeByAid` / `addAoodsCharge` / `updateAoodsCharge` / `deleteAoodsCharge`
- 批量导入：`import_aoodscharge` Plan（脚本 `scripts/plan/plan_import_data_aoodscharge.py` 已就绪；🔴部署序=脚本先传生产 `/home/fanglin/cronbin/py3/` 再执行 30 号 SQL，顺序颠倒则计划可建、执行必败）

**禁止**：
- 在 `data.aoods` 表新增 `aoodsCharge` 等费用列
- 在业务侧自建费用快照/冗余列——费用以 aoodscharge 行为唯一事实源，变更即时生效

### 4. 业务校验规范

**辅料单添加校验**：
```java
// 1. 订单状态校验
if (decorationPO.getStatus() == DecorationPO.STATUS_TERMINATION_INT) {
    throw new FLException(140004, "装修单状态不可操作");
}

// 2. 工程辅料锁定校验
if (constructionPO.getAccessory() != ConstructionPO.ACCESSORY_OPEN_SHORT) {
    throw new FLException(120028, "工程辅料已锁定");
}

// 3. 辅料总额限制校验
if (Arith.add(constructionPO.getAccessoryTotal(), accessoriesVO.getTotal())
    > constructionPO.getAccessoryLimit()) {
    throw new FLException(260058, "辅料总额已达上限");
}

// 4. 明细数量限制校验
if (Arith.add(constructionAccessoryPO.getNum(), item.getNum())
    > constructionAccessoryPO.getNumLimit()) {
    throw new FLException(260059, "辅料总数已达上限");
}
```

---

## 常见业务场景

### 场景1：添加辅料单

**流程**：
```
1. 校验订单状态
2. 校验工程辅料锁定状态
3. 校验辅料总额限制
4. 生成辅料单号
5. 保存辅料单主表
6. 保存辅料单明细
7. 累加工程辅料总额
8. 累加工程辅料明细数量和费用
```

**关键代码位置**：
- `AccessoriesServiceImpl.addAccessories()` (第 117-220 行)

### 场景2：撤销辅料单

**流程**：
```
1. 校验辅料单状态（必须是初始状态）
2. 更新辅料单状态为"撤销"
3. 从工程辅料总额中扣除
4. 从工程辅料明细中扣除数量和费用
```

**关键代码位置**：
- `AccessoriesServiceImpl.cancelAccessories()` (第 251-299 行)

### 场景3：辅材费用计算

**场景**：报价/领料需要计算某辅材的费用合计

**示例代码**：
```java
// 费用合计 = Σ(启用费用行 price)，数据来自 data.aoodscharge 表
public long calculateAoodsChargeTotal(long aid) {
    long chargeTotal = 0;
    for (AoodsChargePO charge : aoodsChargeDao.queryAoodsChargeByAid(aid, null)) {
        chargeTotal = Arith.add(chargeTotal, charge.getPrice());
    }
    return chargeTotal;
}
```

### 场景4：辅料单费用分摊

**场景**：将外辅费用分摊到各个明细

**示例代码**：
```java
// 按金额比例分摊外辅费用
public void distributeOccessoriesCost(AccessoriesPO accessories) {
    List<AccessoriesItemPO> items = accessoriesItemDao.queryAccessoriesItem(accessories.getAid());
    List<OccessoriesCostPO> costs = occessoriesCostDao.queryOccessoriesCostByOid(accessories.getAid());

    long totalItemAmount = 0;
    for (AccessoriesItemPO item : items) {
        totalItemAmount += Arith.mul(item.getNum(), item.getSelling());
    }

    for (OccessoriesCostPO cost : costs) {
        for (AccessoriesItemPO item : items) {
            long itemAmount = Arith.mul(item.getNum(), item.getSelling());
            // 按比例分摊
            long distributedCost = Arith.mul(
                Arith.div(cost.getPrice(), totalItemAmount),
                itemAmount
            );
            // 更新明细的费用...
        }
    }
}
```

---

## 文件位置索引

### 辅材相关

| 类型 | 文件路径 | 说明 |
|------|---------|------|
| PO | `src/com/fanglin/data/po/AoodsPO.java` | 辅材实体类 |
| PO | `src/com/fanglin/data/po/AoodsChargePO.java` | 辅材费用明细 ⭐ 新增 |
| PO | `src/com/fanglin/data/po/AoodsCostPO.java` | 辅材成本关联 |
| VO | `src/com/fanglin/data/material/vo/AoodsVO.java` | 辅材值对象 |
| VO | `src/com/fanglin/data/material/vo/AoodsChargeVO.java` | 辅材费用值对象 ⭐ 新增 |
| VO | `src/com/fanglin/data/material/vo/AoodsCostVO.java` | 辅材费用值对象 |
| Action | `src/com/fanglin/data/material/action/AoodsAction.java` | 辅材控制器 |
| Action | `src/com/fanglin/data/material/action/AoodsChargeAction.java` | 辅材费用控制器 ⭐ 新增 |
| Action | `src/com/fanglin/data/material/action/AoodsCostAction.java` | 辅材费用控制器 |
| Service | `src/com/fanglin/data/material/service/impl/AoodsServiceImpl.java` | 辅材业务逻辑 |
| Service | `src/com/fanglin/data/material/service/AoodsChargeService.java` | 辅材费用服务接口 ⭐ 新增 |
| Service | `src/com/fanglin/data/material/service/impl/AoodsChargeServiceImpl.java` | 辅材费用业务逻辑 ⭐ 新增 |
| Service | `src/com/fanglin/data/material/service/impl/AoodsCostServiceImpl.java` | 辅材费用业务逻辑 |
| DAO | `src/com/fanglin/data/material/dao/AoodsDao.java` | 辅材数据访问 |
| DAO | `src/com/fanglin/data/material/dao/AoodsChargeDao.java` | 辅材费用数据访问 ⭐ 新增 |
| DAO | `src/com/fanglin/data/material/dao/impl/AoodsChargeDaoImpl.java` | 辅材费用数据访问实现 ⭐ 新增 |
| DAO | `src/com/fanglin/data/material/dao/AoodsCostDao.java` | 辅材费用数据访问 |
| 前端 | `WebContent/views/data/aoodsCharge.html` + `WebContent/js/data/aoodsCharge.js` | 辅材费用维护页（aoods 行按钮弹层） |

### 辅料相关

| 类型 | 文件路径 | 说明 |
|------|---------|------|
| PO | `src/com/fanglin/inventory/po/AccessoriesPO.java` | 辅料单实体类 |
| PO | `src/com/fanglin/inventory/po/AccessoriesItemPO.java` | 辅料单明细实体类 |
| PO | `src/com/fanglin/inventory/po/OccessoriesCostPO.java` | 外辅费用实体类 |
| VO | `src/com/fanglin/inventory/vo/AccessoriesVO.java` | 辅料单值对象 |
| VO | `src/com/fanglin/inventory/vo/AccessoriesItemVO.java` | 辅料单明细值对象 |
| VO | `src/com/fanglin/inventory/vo/OccessoriesCostVO.java` | 外辅费用值对象 |
| Action | `src/com/fanglin/inventory/action/AccessoriesAction.java` | 辅料单控制器 |
| Service | `src/com/fanglin/inventory/service/impl/AccessoriesServiceImpl.java` | 辅料单业务逻辑 |
| Service | `src/com/fanglin/inventory/service/impl/AccessoriesItemServiceImpl.java` | 辅料单明细业务逻辑 |
| Service | `src/com/fanglin/inventory/service/impl/OccessoriesCostServiceImpl.java` | 外辅费用业务逻辑 |
| DAO | `src/com/fanglin/inventory/dao/AccessoriesDao.java` | 辅料单数据访问 |
| DAO | `src/com/fanglin/inventory/dao/AccessoriesItemDao.java` | 辅料单明细数据访问 |
| DAO | `src/com/fanglin/inventory/dao/OccessoriesCostDao.java` | 外辅费用数据访问 |

---

## 常见问题 (FAQ)

### Q1: 辅材费用存哪里？与 balance、selling 的区别？

**答**：
- 辅材费用**不落 `data.aoods` 列**（2026-10-26 用户定调），按费用项逐行存于 `data.aoodscharge` 表（price 价格 + surplus 浮动额）
- `balance`: 结算价，是公司与供应商结算的价格
- `selling`: 销售价，是向客户销售的价格

**价格关系**：
```
data.aoods 表:          balance(结算价) → selling(销售价)
费用独立事实源:          data.aoodscharge 表行（status=启用，sort 升序逐项累加）
```

### Q2: 辅料单的总金额是如何计算的？

**答**：
```java
// 辅料单总金额 = Σ(明细数量 × 明细单价) + 外辅费用
long total = 0;

// 1. 计算明细费用
for (AccessoriesItemPO item : items) {
    total += Arith.mul(item.getNum(), item.getSelling());
}

// 2. 加上外辅费用（如果有）
for (OccessoriesCostPO cost : costs) {
    total += cost.getPrice();
}

accessoriesPO.setTotal(total);
```

### Q3: 如何避免辅料总额超限？

**答**：在添加辅料单时进行校验：
```java
// 检查工程辅料总额是否超限
if (Arith.add(constructionPO.getAccessoryTotal(), accessoriesVO.getTotal())
    > constructionPO.getAccessoryLimit()) {
    throw new FLException(260058, "辅料总额已达上限");
}
```

### Q4: 撤销辅料单时如何处理费用？

**答**：需要从工程辅料总额中扣除：
```java
// 1. 计算辅料单总费用
long total = 0;
for (AccessoriesItemPO item : items) {
    total += Arith.mul(item.getNum(), item.getSelling());
}

// 2. 从工程辅料总额中扣除
constructionPO.setAccessoryTotal(
    Arith.sub(constructionPO.getAccessoryTotal(), total)
);

// 3. 从工程辅料明细中扣除数量和费用
constructionAccessoryPO.setTotal(
    Arith.sub(constructionAccessoryPO.getTotal(),
              Arith.mul(item.getNum(), item.getSelling()))
);
constructionAccessoryPO.setNum(
    Arith.sub(constructionAccessoryPO.getNum(), item.getNum())
);
```

---

## 已知存量缺陷（2026-10-26 盘点）

| # | 位置 | 问题 | 影响 |
|---|------|------|------|
| 1 | `aoodsCharge.js` updateData() | 六个字段（name/price/surplus/type/status/sort）全部误读 `#addAoodsCharge` 添加表单，应为 `#editAoodsCharge` 编辑表单（editData 回显填的是编辑域，提交却读添加域） | 编辑确认把该行覆写成添加表单残留值（未用过添加表单时 price/surplus 落 0、name 落空），**编辑功能实际不可用** |
| 2 | `aoodsCharge.js` saveData()/editData() | editData 回显 `(v.price/1000).toFixed(3)` 与框架响应侧÷1000 双重换算；saveData 提交原值由框架×1000 本属正确但与回显口径矛盾 | 编辑框数值缩小 1000 倍，与列表显示不一致 |
| 3 | `aoodsCharge.js` 171-173 行 | console.log 调试残留 | 控制台噪音 |
| 4 | `sqls/material/30_add_aoodscharge_import_task.sql` | 注册的 `import_aoodscharge` Plan 指向 `script/plan_import_data_aoodscharge.py`，**脚本不存在** | 执行 30 号 SQL 后导入功能空挂 |
| 5 | `AoodsChargePO.java` / `10_aoodscharge.sql` | 金额注释写"分" | 与实际存储口径 ×1000（厘）不符，注释待校准 |
| 6 | `sqls/material/10_aoodscharge.sql` | `DROP TABLE IF EXISTS` 非幂等 | 重复执行会清空费用数据；生产已建表则不得重跑 |

> **2026-10-26 处置进展**：六项全部修复——①②③随 v1.3（金额换算收编 api tranargs 框架转换/updateData 改读编辑表单/console.log 清除）；④⑤⑥随 v1.4（导入脚本落地 scripts/plan/ + PO/SQL 注释校准厘 + 10 号 SQL 幂等化 + 30 号 SQL 照生产实况修正），详见变更记录。遗留动作仅剩部署：脚本传 cronbin/py3 → 依次执行 10/30 号 SQL。

---

## 变更记录

### 2026-10-26 - v1.4
- ④ **导入脚本落地**：`scripts/plan/plan_import_data_aoodscharge.py`（照 `plan_import_data_soods.py` 同构：plan_util Util 基类 + config.json + argv=`pid path aid`；6 列=费用名称/价格元/浮动额元/类型/状态/排序；价格浮动额×1000 折厘入库与页面 tranargs 口径一致；aid 须存在于 data.aoods 否则整单失败；逐行校验错误行跳过记 log）
- ⑤ **金额注释校准**：AoodsChargePO 与 10 号 SQL 的 price/surplus 注释"分"→"厘(×1000)"
- ⑥ **10 号 SQL 幂等化**：`DROP TABLE IF EXISTS`+CREATE 改 `CREATE TABLE IF NOT EXISTS`，补用途/前置/回滚/验证文件头（原版重跑会清空费用数据）
- 30 号 SQL 照生产实况修正：filepath 相对路径 `script/...` 改部署绝对路径 `/home/fanglin/cronbin/py3/...`（照 information/30 导入选材先例），type 0→2、handle 0→1、isShow 0→1（照 import_data_* 八行实况），INSERT 改先删后插幂等；🔴部署序=脚本先上 cronbin/py3 再执行本 SQL
- 缺陷表④⑤⑥关闭；遗留动作仅剩部署（脚本→cronbin/py3，10/30 号 SQL 依次执行）

### 2026-10-26 - v1.3
- 🔴 **金额换算双轨修复**：页面层去掉全部手工 ×/÷1000，统一交给 api tranargs 框架转换（core.js：`type=update` 发送前 `utils.accExtend` ×1000 折厘；`type=query` 响应后 `utils.accReduce` ÷1000 折元，Searcher 走 `com.post` 同样吃到转换）——api/data.js 四接口 tranargs 本已声明齐全，页面此前未遵循
- editData 回显去掉 `(v.price/1000).toFixed(3)`（框架已÷1000，原写法双重换算致编辑框缩小 1000 倍，与列表显示不一致）
- updateData 六字段改读编辑表单（editData 回显域），修复误读添加表单致编辑覆写残留值的不可用缺陷
- saveData 清除 console.log 残留；提交链路维持原值（元）直传由框架折厘
- 缺陷表①②③关闭，④（导入脚本缺失）⑤（注释单位）⑥（DROP TABLE 非幂等）待处置

### 2026-10-26 - v1.2
- 🔴 **用户定调**：辅材费用不落 `data.aoods` 列（v1.0/v1.1 的 `AoodsPO.aoodsCharge` 字段设计作废，代码与 DDL 从未落过该字段），一律取 `data.aoodscharge` 表数据
- 取数入口收敛为 `AoodsChargeDao.queryAoodsChargeByAid(aid, type)`（status=启用、sort 升序）
- 金额口径核正为厘（×1000）：依据前端编辑回显 `v.price/1000` 与仓内定点算术惯例（num×storenum ÷1000 同量纲）
- 全文清除 aoodsCharge 字段相关段落（AoodsPO 核心字段行/字段定义代码/ptv 复制/ALTER 步骤/FAQ Q1），"字段添加流程"改写为"辅材费用取数与维护流程"
- 新增"已知存量缺陷"盘点表（updateData 误读表单/添加缺 ×1000 换算/console.log 残留/导入脚本缺失/注释单位/DROP TABLE 非幂等）

### 2026-03-22 - v1.1
- ✅ 创建 `AoodsChargePO` 实体类（辅材费用明细表）
- ✅ 创建 `AoodsChargeVO` 值对象
- ✅ 创建 `AoodsChargeDao` 数据访问层
- ✅ 创建 `AoodsChargeService` 业务逻辑层
- ✅ 创建 `AoodsChargeAction` 控制器
- ✅ 生成 `aoodscharge` 数据库表结构 SQL
- ✅ 更新开发文档，添加辅材费用明细表说明

### 2026-03-22 - v1.0
- ✅ 创建辅材与辅料费用开发文档
- ✅ 定义 `aoodsCharge` 字段（辅材费用）
- ✅ 梳理辅材和辅料的数据结构
- ✅ 整理费用计算逻辑和业务场景
- ✅ 提供开发规范和常见问题解答

---

## 附录

### 相关模块文档

- [data 模块文档](../src/com/fanglin/data/CLAUDE.md)
- [inventory 模块文档](../src/com/fanglin/inventory/CLAUDE.md)
- [construction 模块文档](../src/com/fanglin/construction/CLAUDE.md)
- [模块开发规范](./MODULE_DEVELOPMENT_STANDARDS.md)

### 工具类参考

- **Arith** - 金额计算工具类
  - `add(long a, long b)` - 加法
  - `sub(long a, long b)` - 减法
  - `mul(long a, long b)` - 乘法
  - `div(long a, long b)` - 除法

- **BeanUtil** - 对象复制工具类
  - `copyProperties(source, target, ignoreProperties)` - 复制对象属性

---

**维护人员**: 开发团队
**审核人员**: 业务负责人
**批准人员**: 技术负责人
