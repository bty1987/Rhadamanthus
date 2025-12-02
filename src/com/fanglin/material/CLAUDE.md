# material - 材料管理模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com.fanglin](../) > **material**

> 最后更新：2025-12-01 15:28:48

---

## 模块职责

材料管理模块负责装饰辅材和主材的订单管理，与施工订单关联，用于跟踪材料配送、退货等流程。该模块是 `sales`（主材销售）模块的补充，主要聚焦施工相关的材料管理。

**核心功能**
- 材料订单管理
- 材料明细跟踪
- 材料结算
- 材料退货处理
- 材料活动管理

---

## 入口与启动

### 主要 Action 控制器
| Action 类 | 职责 | 关键方法 |
|----------|------|----------|
| `MaterialAction.java` | 材料订单主控制器 | 材料订单 CRUD、订单状态管理 |
| `MaterialItemAction.java` | 材料明细管理 | 材料明细的增删改查 |
| `MaterialBalanceAction.java` | 材料结算 | 材料款结算、对账 |
| `MaterialRefundAction.java` | 材料退货 | 退货申请、退货处理 |
| `MaterialActivityAction.java` | 材料活动 | 材料促销活动管理 |

### 前端页面路径
```
WebContent/views/material/
├── material.html               - 材料订单列表
├── material_detail.html        - 材料订单详情
├── material_balance.html       - 材料结算
└── material_refund.html        - 材料退货
```

---

## 对外接口

### REST API 接口

#### 材料订单管理
```
GET  /pageMaterial.do           - 分页查询材料订单
POST /addMaterial.do            - 创建材料订单
POST /updateMaterial.do         - 更新材料订单
POST /deleteMaterial.do         - 删除材料订单
GET  /queryMaterialById.do      - 查询材料订单详情
```

#### 材料明细管理
```
GET  /pageMaterialItem.do       - 查询材料明细
POST /addMaterialItem.do        - 添加材料明细
POST /updateMaterialItem.do     - 更新材料明细
POST /deleteMaterialItem.do     - 删除材料明细
```

#### 材料结算
```
GET  /pageMaterialBalance.do    - 查询结算记录
POST /addMaterialBalance.do     - 创建结算单
POST /updateMaterialBalance.do  - 更新结算状态
```

#### 材料退货
```
GET  /pageMaterialRefund.do     - 查询退货记录
POST /addMaterialRefund.do      - 创建退货申请
POST /approveMaterialRefund.do  - 审批退货
```

---

## 关键依赖与配置

### 服务层依赖
- `MaterialService` - 材料订单核心服务
- `MaterialItemService` - 材料明细服务
- `MaterialBalanceService` - 结算服务
- `MaterialRefundService` - 退货服务
- `MaterialActivityService` - 活动服务

### 外部模块依赖
| 依赖模块 | 用途 |
|---------|------|
| `decoration` | 关联装饰订单，材料订单依附于装饰订单 |
| `sales` | 与主材销售模块协同，材料管理主要负责辅材 |
| `data.material` | 使用材料数据字典（材料品类、品牌、规格） |
| `communion` | 使用品牌、供应商等基础数据 |
| `payment` | 材料款支付管理 |
| `balance` | 材料结算集成到财务结算 |

---

## 数据模型

### 核心实体 (PO)

#### MaterialPO - 材料订单
```java
@Entity
@Table(name = "material")
public class MaterialPO {
    private long mid;                    // 材料订单 ID
    private String orderId;              // 关联装饰订单 ID
    private String materialNo;           // 材料订单号
    private Timestamp createTime;        // 创建时间
    private Timestamp deliverTime;       // 配送时间
    private UserPO creater;              // 创建人
    private long totalPrice;             // 总价
    private long paidPrice;              // 已付金额
    private long refundPrice;            // 退款金额
    private short status;                // 状态（待配送/配送中/已完成）
    private String remark;               // 备注
}
```

#### MaterialItemPO - 材料明细
```java
@Entity
@Table(name = "material_item")
public class MaterialItemPO {
    private long miid;                   // 明细 ID
    private MaterialPO material;         // 关联材料订单
    private String category;             // 材料类别（辅材/主材）
    private String brandName;            // 品牌
    private String goodsName;            // 商品名称
    private String model;                // 型号
    private String unit;                 // 单位
    private double quantity;             // 数量
    private long unitPrice;              // 单价
    private long totalPrice;             // 总价
    private String supplier;             // 供应商
    private Timestamp deliverTime;       // 配送时间
    private short status;                // 状态（待配送/已配送）
}
```

#### MaterialBalancePO - 材料结算
```java
@Entity
@Table(name = "material_balance")
public class MaterialBalancePO {
    private long mbid;                   // 结算 ID
    private MaterialPO material;         // 关联材料订单
    private long balanceAmount;          // 结算金额
    private Timestamp balanceTime;       // 结算时间
    private UserPO balancer;             // 结算人
    private String remark;               // 备注
    private short status;                // 状态（待审核/已审核）
}
```

#### MaterialRefundPO - 材料退货
```java
@Entity
@Table(name = "material_refund")
public class MaterialRefundPO {
    private long mrid;                   // 退货 ID
    private MaterialPO material;         // 关联材料订单
    private MaterialItemPO item;         // 关联材料明细
    private double refundQuantity;       // 退货数量
    private long refundAmount;           // 退款金额
    private String reason;               // 退货原因
    private Timestamp applyTime;         // 申请时间
    private Timestamp approveTime;       // 审批时间
    private short status;                // 状态（待审批/已批准/已拒绝）
}
```

#### MaterialActivityItemPO - 材料活动明细
```java
@Entity
@Table(name = "material_activity_item")
public class MaterialActivityItemPO {
    private long maiid;                  // 活动明细 ID
    private String activityName;         // 活动名称
    private String goodsName;            // 商品名称
    private long originalPrice;          // 原价
    private long activityPrice;          // 活动价
    private int discount;                // 折扣
    private Timestamp startTime;         // 开始时间
    private Timestamp endTime;           // 结束时间
}
```

### 数据库关系
```
material (材料订单) 1:N
├── material_item (材料明细)
├── material_balance (结算记录)
├── material_refund (退货记录)
└── material_activity_item (活动明细)
```

---

## 测试与质量

### 当前测试状态
- **单元测试**: 无
- **集成测试**: 无
- **测试覆盖率**: 0%

### 建议测试策略
1. **订单流程测试**: 订单创建 → 配送 → 完成流程
2. **退货流程测试**: 退货申请 → 审批 → 退款
3. **结算逻辑测试**: 结算金额计算、已付款跟踪

---

## 常见问题 (FAQ)

### Q1: material 与 sales 模块的区别？
**A**:
- `material` 模块：主要管理施工相关的辅材订单，与装饰订单紧密关联
- `sales` 模块：主要管理主材销售订单，可以独立存在，也可以关联装饰订单

### Q2: 材料订单状态流转？
**A**:
- 待配送 → 配送中 → 已完成
- 可能涉及退货状态

### Q3: 材料退货如何处理？
**A**: 创建退货申请，关联到材料明细，审批通过后生成退款记录，并更新订单总价和已付金额。

---

## 相关文件清单

### Action 控制器 (5 个)
```
action/
├── MaterialAction.java              - 材料订单主控制器
├── MaterialItemAction.java          - 材料明细
├── MaterialBalanceAction.java       - 材料结算
├── MaterialRefundAction.java        - 材料退货
└── MaterialActivityAction.java      - 材料活动
```

### 实体类 (5 个)
```
po/
├── MaterialPO.java                  - 材料订单
├── MaterialItemPO.java              - 材料明细
├── MaterialBalancePO.java           - 材料结算
├── MaterialRefundPO.java            - 材料退货
└── MaterialActivityItemPO.java      - 材料活动明细
```

---

## 变更记录 (Changelog)

### 2025-12-01 15:28:48
- 初始化模块文档
- 完成材料管理模块架构分析
- 记录 5 个核心实体、5 个 Action 控制器
