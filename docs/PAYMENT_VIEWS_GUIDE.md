# Payment 数据库视图说明文档

> **版本**: v1.0
> **更新日期**: 2026-04-10
> **数据库**: payment (生产环境)
> **查询环境**: rr-2ze11ccr650aw2c79oo.mysql.rds.aliyuncs.com:3306

---

## 目录

- [视图概览](#视图概览)
- [视图详细说明](#视图详细说明)
- [字段说明](#字段说明)
- [使用示例](#使用示例)
- [数据字典](#数据字典)
- [注意事项](#注意事项)

---

## 视图概览

### 视图列表

| 序号 | 视图名称 | 说明 | 源表 | 记录数 |
|:----:|---------|------|------|-------|
| 1 | `v_pay_design_fee` | 设计费汇总视图 | `decorationpayment` | 按订单汇总 |
| 2 | `v_pay_server_fee_dp` | 装修服务费汇总视图 | `decorationpayment` | 按订单汇总 |
| 3 | `v_pay_server_fee_sp` | 商品服务费汇总视图 | `servicepayment` | 按订单汇总 |

### 查询统计

```sql
-- decoration 库视图数量
SELECT COUNT(*) FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'decoration';
-- 结果: 0

-- payment 库视图数量
SELECT COUNT(*) FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'payment';
-- 结果: 3
```

---

## 视图详细说明

### 1. v_pay_design_fee - 设计费汇总视图

#### 基本信息

| 项目 | 说明 |
|------|------|
| **视图名称** | `v_pay_design_fee` |
| **用途** | 统计每个订单的设计费总额 |
| **源表** | `payment.decorationpayment` |
| **键字段** | `orderId` |

#### 视图定义

```sql
CREATE ALGORITHM=UNDEFINED DEFINER=`fanglin1918`@`%`
SQL SECURITY DEFINER VIEW `v_pay_design_fee` AS
SELECT
    `decorationpayment`.`orderId` AS `orderId`,
    (SUM(IF((`decorationpayment`.`onetype` = 1), -(`decorationpayment`.`referMoney`), `decorationpayment`.`referMoney`)) / 1000) AS `design_fee_amount`
FROM `decorationpayment`
WHERE (
    `decorationpayment`.`paymentType` IN ('设计费', '设计费退单', '设计费追回')
    AND `decorationpayment`.`paymentStatus` IN (1, 2, 4)
)
GROUP BY `decorationpayment`.`orderId`
```

#### 逻辑说明

| 条件 | 说明 |
|------|------|
| `paymentType IN ('设计费', '设计费退单', '设计费追回')` | 只统计设计费相关类型 |
| `paymentStatus IN (1, 2, 4)` | 只统计有效状态（1=待审核, 2=已审核, 4=已到账） |
| `onetype = 1` | 表示退单，金额取负 |
| `onetype != 1` | 表示正常收款，金额取正 |
| `/ 1000` | 金额单位转换（分→千元） |

#### 返回字段

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `orderId` | VARCHAR | 装修单编号 | `"1501040012"` |
| `design_fee_amount` | DECIMAL | 设计费总额（千元） | `2000.0000` |

#### 示例数据

```
orderId      | design_fee_amount
------------+------------------
1501040012   | 2000.0000
1501070017   | 3000.0000
1501080001   | 5600.0000
1501100026   | 10000.0000
1501100038   | 15000.0000
```

---

### 2. v_pay_server_fee_dp - 装修服务费汇总视图

#### 基本信息

| 项目 | 说明 |
|------|------|
| **视图名称** | `v_pay_server_fee_dp` |
| **用途** | 统计每个订单的装修服务费（首期款）总额 |
| **源表** | `payment.decorationpayment` |
| **键字段** | `orderId` |

#### 视图定义

```sql
CREATE ALGORITHM=UNDEFINED DEFINER=`fanglin1918`@`%`
SQL SECURITY DEFINER VIEW `v_pay_server_fee_dp` AS
SELECT
    `decorationpayment`.`orderId` AS `orderId`,
    (SUM(IF((`decorationpayment`.`onetype` = 0), `decorationpayment`.`referMoney`, -(`decorationpayment`.`referMoney`))) / 1000) AS `server_fee_dp`
FROM `decorationpayment`
WHERE (
    `decorationpayment`.`paymentType` IN ('首期款', '首期款退单')
    AND `decorationpayment`.`paymentStatus` IN (1, 2)
)
GROUP BY `decorationpayment`.`orderId`
```

#### 逻辑说明

| 条件 | 说明 |
|------|------|
| `paymentType IN ('首期款', '首期款退单')` | 只统计首期款相关类型 |
| `paymentStatus IN (1, 2)` | 只统计待审核/已审核状态 |
| `onetype = 0` | 表示正常收款，金额取正 |
| `onetype != 0` | 表示退单，金额取负 |
| `/ 1000` | 金额单位转换（分→千元） |

#### 返回字段

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `orderId` | VARCHAR | 装修单编号 | `"2004200049"` |
| `server_fee_dp` | DECIMAL | 装修服务费总额（千元） | `14739.0000` |

#### 示例数据

```
orderId      | server_fee_dp
------------+--------------
1902240134   | -1600.0000   -- 负值表示退单金额大于收款金额
2004200049   | 14739.0000
2006280048   | 3940.0000
2010020112   | 7123.2000
2012050209   | 5000.0000
```

---

### 3. v_pay_server_fee_sp - 商品服务费汇总视图

#### 基本信息

| 项目 | 说明 |
|------|------|
| **视图名称** | `v_pay_server_fee_sp` |
| **用途** | 统计每个订单的商品服务费总额 |
| **源表** | `payment.servicepayment` |
| **键字段** | `orderId` |

#### 视图定义

```sql
CREATE ALGORITHM=UNDEFINED DEFINER=`fanglin1918`@`%`
SQL SECURITY DEFINER VIEW `v_pay_server_fee_sp` AS
SELECT
    `servicepayment`.`orderId` AS `orderId`,
    (SUM(IF((`servicepayment`.`type` = 0), `servicepayment`.`serviceMoney`, -(`servicepayment`.`serviceMoney`))) / 1000) AS `server_fee_sp`
FROM `servicepayment`
WHERE (`servicepayment`.`status` IN (1, 2))
GROUP BY `servicepayment`.`orderId`
```

#### 逻辑说明

| 条件 | 说明 |
|------|------|
| `status IN (1, 2)` | 只统计待审核/已审核状态 |
| `type = 0` | 表示正常收款，金额取正 |
| `type != 0` | 表示退单，金额取负 |
| `/ 1000` | 金额单位转换（分→千元） |

#### 返回字段

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `orderId` | VARCHAR | 装修单编号 | `"1501110126"` |
| `server_fee_sp` | DECIMAL | 商品服务费总额（千元） | `18449.0000` |

#### 示例数据

```
orderId      | server_fee_sp
------------+--------------
1501110084   | 0.0000
1501110126   | 18449.0000
1501110268   | 22417.0000
1501120032   | 9740.0000
1501130060   | 12353.0000
```

---

## 字段说明

### decorationpayment 表关键字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `orderId` | VARCHAR | 装修单编号 |
| `paymentType` | VARCHAR | 收款类型（设计费、首期款等） |
| `onetype` | INT | 操作类型（0=正常收款，1=退单） |
| `paymentStatus` | INT | 收款状态（0=未审核，1=待审核，2=已审核，4=已到账） |
| `referMoney` | BIGINT | 金额（分） |

### servicepayment 表关键字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `orderId` | VARCHAR | 装修单编号 |
| `type` | INT | 类型（0=正常收款，1=退单） |
| `status` | INT | 状态（0=未审核，1=待审核，2=已审核） |
| `serviceMoney` | BIGINT | 金额（分） |

---

## 数据字典

### paymentType（收款类型）

| 类型值 | 说明 |
|--------|------|
| 设计费 | 设计费收款 |
| 设计费退单 | 设计费退单 |
| 设计费追回 | 设计费追回 |
| 首期款 | 首期款收款 |
| 首期款退单 | 首期款退单 |
| 尾款 | 尾款收款 |
| 尾款退单 | 尾款退单 |
| 增项款 | 增项款收款 |
| 增项款退单 | 增项款退单 |
| 维修费 | 维修费收款 |
| 维修费退单 | 维修费退单 |
| 管理费 | 管理费收款 |
| 管理费退单 | 管理费退单 |

### onetype / type（操作类型）

| 值 | 说明 | 金额处理 |
|----|------|---------|
| 0 | 正常收款 | 取正 |
| 1 | 退单 | 取负 |

### paymentStatus / status（状态）

| 值 | 说明 |
|----|------|
| 0 | 未审核 |
| 1 | 待审核 |
| 2 | 已审核 |
| 4 | 已到账 |

---

## 使用示例

### 基础查询

#### 1. 查询指定订单的设计费

```sql
-- 查询订单 1501040012 的设计费
SELECT * FROM v_pay_design_fee WHERE orderId = '1501040012';
```

#### 2. 查询指定订单的装修服务费

```sql
-- 查询订单 2004200049 的装修服务费
SELECT * FROM v_pay_server_fee_dp WHERE orderId = '2004200049';
```

#### 3. 查询指定订单的商品服务费

```sql
-- 查询订单 1501110126 的商品服务费
SELECT * FROM v_pay_server_fee_sp WHERE orderId = '1501110126';
```

### 关联查询

#### 4. 查询订单的全部费用汇总

```sql
SELECT
    d.orderId,
    IFNULL(vd.design_fee_amount, 0) AS design_fee,
    IFNULL(vdp.server_fee_dp, 0) AS server_fee_dp,
    IFNULL(vsp.server_fee_sp, 0) AS server_fee_sp,
    IFNULL(vd.design_fee_amount, 0) + IFNULL(vdp.server_fee_dp, 0) + IFNULL(vsp.server_fee_sp, 0) AS total_fee
FROM decoration.decorationorder d
LEFT JOIN payment.v_pay_design_fee vd ON d.orderId = vd.orderId
LEFT JOIN payment.v_pay_server_fee_dp vdp ON d.orderId = vdp.orderId
LEFT JOIN payment.v_pay_server_fee_sp vsp ON d.orderId = vsp.orderId
WHERE d.orderId = '1501040012';
```

#### 5. 查询设计费大于5000的订单

```sql
SELECT
    orderId,
    design_fee_amount
FROM v_pay_design_fee
WHERE design_fee_amount > 5000
ORDER BY design_fee_amount DESC;
```

#### 6. 查询有退单记录的订单（负金额）

```sql
-- 装修服务费退单
SELECT orderId, server_fee_dp
FROM v_pay_server_fee_dp
WHERE server_fee_dp < 0;

-- 商品服务费退单
SELECT orderId, server_fee_sp
FROM v_pay_server_fee_sp
WHERE server_fee_sp < 0;
```

### 统计分析

#### 7. 统计各费用类型的总额

```sql
-- 设计费总额
SELECT SUM(design_fee_amount) AS total_design_fee FROM v_pay_design_fee;

-- 装修服务费总额
SELECT SUM(server_fee_dp) AS total_server_fee_dp FROM v_pay_server_fee_dp;

-- 商品服务费总额
SELECT SUM(server_fee_sp) AS total_server_fee_sp FROM v_pay_server_fee_sp;
```

#### 8. 统计费用区间分布

```sql
-- 设计费区间分布
SELECT
    CASE
        WHEN design_fee_amount < 3000 THEN '0-3000'
        WHEN design_fee_amount < 5000 THEN '3000-5000'
        WHEN design_fee_amount < 10000 THEN '5000-10000'
        ELSE '10000+'
    END AS fee_range,
    COUNT(*) AS order_count
FROM v_pay_design_fee
GROUP BY fee_range
ORDER BY fee_range;
```

#### 9. 查询未收全款的订单（有设计费但无服务费）

```sql
SELECT
    vd.orderId,
    vd.design_fee_amount,
    IFNULL(vdp.server_fee_dp, 0) AS server_fee_dp
FROM v_pay_design_fee vd
LEFT JOIN v_pay_server_fee_dp vdp ON vd.orderId = vdp.orderId
WHERE vdp.orderId IS NULL;
```

### 与订单表关联

#### 10. 查询订单及费用信息

```sql
SELECT
    d.orderId AS 订单编号,
    d.customerName AS 客户名称,
    d.villageName AS 楼盘名称,
    IFNULL(vd.design_fee_amount, 0) AS 设计费,
    IFNULL(vdp.server_fee_dp, 0) AS 装修服务费,
    IFNULL(vsp.server_fee_sp, 0) AS 商品服务费,
    IFNULL(vd.design_fee_amount, 0) + IFNULL(vdp.server_fee_dp, 0) + IFNULL(vsp.server_fee_sp, 0) AS 总费用
FROM decoration.decorationorder d
LEFT JOIN payment.v_pay_design_fee vd ON d.orderId = vd.orderId
LEFT JOIN payment.v_pay_server_fee_dp vdp ON d.orderId = vdp.orderId
LEFT JOIN payment.v_pay_server_fee_sp vsp ON d.orderId = vsp.orderId
WHERE d.createTime >= '2024-01-01'
ORDER BY d.createTime DESC
LIMIT 100;
```

---

## 注意事项

### 1. 数据库切换

视图位于 `payment` 数据库，查询时需要指定数据库名：

```sql
-- 正确
SELECT * FROM payment.v_pay_design_fee;

-- 错误（如果当前不在 payment 库）
SELECT * FROM v_pay_design_fee;
```

### 2. 金额单位

所有金额字段已除以 1000，单位为**千元**：

| 存储单位 | 视图显示单位 | 示例 |
|---------|-------------|------|
| 分 | 千元 | `2000000` 分 → `2000.0000` 千元（即2000元） |

### 3. 金额正负

- **正数**: 表示收款金额
- **负数**: 表示退单金额（退单 > 收款时可能为负）

### 4. 数据时效性

视图基于源表实时计算，每次查询都是最新数据。无缓存机制。

### 5. 空值处理

如果订单没有对应的收款记录，则该订单不会出现在视图中。使用时建议用 `LEFT JOIN` 并处理 `NULL`：

```sql
-- 建议写法
SELECT IFNULL(vd.design_fee_amount, 0) AS design_fee
FROM decorationorder d
LEFT JOIN v_pay_design_fee vd ON d.orderId = vd.orderId;
```

---

## 相关表结构

### decorationpayment 表

```sql
CREATE TABLE `decorationpayment` (
  `dpid` BIGINT NOT NULL AUTO_INCREMENT,
  `orderId` VARCHAR(50) DEFAULT NULL,
  `paymentType` VARCHAR(50) DEFAULT NULL,
  `onetype` INT DEFAULT 0,
  `paymentStatus` INT DEFAULT 0,
  `referMoney` BIGINT DEFAULT 0,
  `createTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dpid`),
  KEY `idx_orderId` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### servicepayment 表

```sql
CREATE TABLE `servicepayment` (
  `spid` BIGINT NOT NULL AUTO_INCREMENT,
  `orderId` VARCHAR(50) DEFAULT NULL,
  `type` INT DEFAULT 0,
  `status` INT DEFAULT 0,
  `serviceMoney` BIGINT DEFAULT 0,
  `createTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`spid`),
  KEY `idx_orderId` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 变更记录

### v1.0 (2026-04-10)

- 初始版本
- 汇总 3 个视图的详细说明
- 添加使用示例
- 补充数据字典和注意事项
