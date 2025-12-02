# quotation - 报价管理模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com.fanglin](../) > **quotation**

> 最后更新：2025-12-01 15:28:48

---

## 模块职责

报价管理模块是方林装饰 ERP 系统的**核心业务模块**之一，负责整装项目的报价生成、预算管理、版本控制等全流程管理。该模块支持多种报价方式（功能区报价、定额报价、定制报价），并与装饰订单、客户信息紧密集成。

**核心功能**
- 报价单创建与版本管理
- 功能区报价（客厅、卧室、厨房等）
- 工程量预算与成本核算
- 报价优惠与折扣管理
- 报价审批与锁定
- 报价变更与退款管理
- 选材方案管理

---

## 入口与启动

### 主要 Action 控制器
| Action 类 | 职责 | 关键方法 |
|----------|------|----------|
| `QuotationAction.java` | 报价单主控制器 | `pageQuotation`（分页查询）<br/>`addQuotation`（创建报价单）<br/>`updateQuotation`（更新报价单）<br/>`queryQuotationForDefaultByOrderId`（获取默认报价） |
| `QuotationFunctionAreaAction.java` | 功能区报价 | 管理客厅、卧室、厨卫等功能区的报价 |
| `SelectionAction.java` | 选材方案管理 | 管理主材选配方案 |
| `QuotationRecordAction.java` | 报价变更记录 | 记录报价单的历史变更 |
| `QuotationRefundAction.java` | 报价退款管理 | 处理报价退款流程 |
| `ProtationAction.java` | 定制产品报价 | 管理橱柜、衣柜等定制产品报价 |
| `ExtensionAction.java` | 延伸报价 | 管理增补项和额外服务报价 |
| `AddReduceAction.java` | 增减项管理 | 管理报价的增减项明细 |

### 前端页面路径
```
WebContent/views/quotation/
├── quotation.html              - 报价单列表
├── quotation_detail.html       - 报价单详情
├── quotation_functionarea.html - 功能区报价编辑
├── selection.html              - 选材方案管理
├── quotation_refund.html       - 退款管理
└── protation.html              - 定制产品报价
```

---

## 对外接口

### REST API 接口

#### 报价单管理
```
GET  /pageQuotation.do              - 分页查询报价单列表
POST /addQuotation.do               - 创建新报价单
POST /updateQuotation.do            - 更新报价单
GET  /queryQuotationById.do         - 根据 ID 查询报价单
GET  /queryQuotationByOrderId.do    - 根据订单 ID 查询所有报价单
GET  /queryQuotationForDefaultByOrderId.do - 获取订单的默认报价单
POST /lockQuotation.do              - 锁定报价单（提交审批）
POST /approveQuotation.do           - 审批报价单
POST /deleteQuotation.do            - 删除报价单
```

#### 功能区报价
```
GET  /pageQuotationFunctionArea.do       - 查询功能区列表
POST /addQuotationFunctionArea.do        - 添加功能区
POST /updateQuotationFunctionArea.do     - 更新功能区
POST /deleteQuotationFunctionArea.do     - 删除功能区
GET  /queryQuotationFunctionAreaItem.do  - 查询功能区明细项
POST /updateQuotationFunctionAreaItem.do - 批量更新功能区明细
```

#### 选材方案
```
GET  /pageSelection.do           - 查询选材方案列表
POST /addSelection.do            - 创建选材方案
POST /updateSelection.do         - 更新选材方案
GET  /querySelectionItem.do      - 查询选材明细
POST /updateSelectionItem.do     - 更新选材明细
```

#### 报价退款
```
GET  /pageQuotationRefund.do     - 查询退款列表
POST /addQuotationRefund.do      - 创建退款申请
POST /updateQuotationRefund.do   - 更新退款状态
```

---

## 关键依赖与配置

### 服务层依赖
- `QuotationService` - 报价单核心业务逻辑
- `QuotationFunctionAreaService` - 功能区报价服务
- `QuotationFunctionAreaItemService` - 功能区明细服务
- `SelectionService` / `SelectionItemService` - 选材方案服务
- `QuotationRecordService` - 报价变更记录服务
- `QuotationRefundService` - 退款服务
- `ProtationService` - 定制产品报价服务
- `ExtensionService` - 延伸报价服务
- `QeasureService` - 测量服务
- `NormtionService` - 定额报价服务

### 外部模块依赖
| 依赖模块 | 用途 |
|---------|------|
| `decoration` | 关联装饰订单，报价依附于订单 |
| `customer` | 获取客户信息和房屋信息 |
| `data.quotation` | 使用报价数据字典（标准工艺、材料定额、报价模板） |
| `communion` | 使用品牌、品类等基础数据 |
| `approval` | 报价审批流程 |
| `personel` | 获取设计师、业务员等人员信息 |

### 配置参数
报价管理模块的配置存储在系统配置表中，包括：
- 报价版本选择策略
- 管理费率、税率、运费率默认值
- 报价折扣规则
- 报价审批流程配置

---

## 数据模型

### 核心实体 (PO)

#### QuotationPO - 报价单主表
```java
@Entity
@Table(name = "quotation", catalog = "quotation")
public class QuotationPO {
    private long qid;                    // 报价单 ID
    private String orderId;              // 关联订单 ID
    private String name;                 // 报价单名称
    private String style;                // 装修风格
    private Timestamp createTime;        // 创建时间
    private Timestamp lockTime;          // 锁定时间
    private Timestamp finishTime;        // 完成时间
    private int workTime;                // 工期（天）
    private UserPO creater;              // 创建人（设计师）
    private QuotationVersionPO version;  // 报价版本

    // 价格字段
    private long basePrice;              // 基础价格
    private long undisPrice;             // 未折扣价格
    private long disPrice;               // 折扣后价格
    private int discount;                // 折扣率（百分比）
    private long managePrice;            // 管理费
    private int manageRate;              // 管理费率
    private long trafficPrice;           // 运费
    private int trafficRate;             // 运费率
    private long taxPrice;               // 税费
    private int taxRate;                 // 税率
    private long costPrice;              // 成本价
    private long totalPrice;             // 总价

    // 状态字段
    private short defaults;              // 是否默认报价（0:否, 1:是）
    private short status;                // 状态（0:初始, 1:锁定, 2:审批通过）
    private short attstatus;             // 增补状态（1:提交, 2:审核, 3:完成）
    private String content;              // 备注
    private short index;                 // 排序索引
}
```

#### QuotationFunctionAreaPO - 功能区报价
```java
@Entity
@Table(name = "quotation_function_area")
public class QuotationFunctionAreaPO {
    private long qfid;                   // 功能区 ID
    private QuotationPO quotation;       // 关联报价单
    private String name;                 // 功能区名称（客厅、卧室等）
    private int area;                    // 面积（平米）
    private long basePrice;              // 基础价格
    private long totalPrice;             // 总价
    private short index;                 // 排序
}
```

#### QuotationFunctionAreaItemPO - 功能区明细项
```java
@Entity
@Table(name = "quotation_function_area_item")
public class QuotationFunctionAreaItemPO {
    private long qfiid;                  // 明细 ID
    private QuotationFunctionAreaPO functionArea; // 关联功能区
    private String category;             // 类别（地面、墙面、吊顶等）
    private String itemName;             // 项目名称
    private String unit;                 // 单位
    private double quantity;             // 数量
    private long unitPrice;              // 单价
    private long totalPrice;             // 总价
    private long costPrice;              // 成本价
    private String remark;               // 备注
}
```

#### SelectionPO - 选材方案
```java
@Entity
@Table(name = "selection")
public class SelectionPO {
    private long sid;                    // 方案 ID
    private QuotationPO quotation;       // 关联报价单
    private String name;                 // 方案名称
    private long totalPrice;             // 总价
    private short defaults;              // 是否默认方案
    private Timestamp createTime;        // 创建时间
}
```

#### SelectionItemPO - 选材明细
```java
@Entity
@Table(name = "selection_item")
public class SelectionItemPO {
    private long siid;                   // 明细 ID
    private SelectionPO selection;       // 关联选材方案
    private String category;             // 材料类别（地板、瓷砖等）
    private String brandName;            // 品牌名称
    private String goodsName;            // 商品名称
    private String model;                // 型号
    private String unit;                 // 单位
    private double quantity;             // 数量
    private long unitPrice;              // 单价
    private long totalPrice;             // 总价
}
```

#### QuotationRecordPO - 报价变更记录
```java
@Entity
@Table(name = "quotation_record")
public class QuotationRecordPO {
    private long qrid;                   // 记录 ID
    private QuotationPO quotation;       // 关联报价单
    private UserPO user;                 // 操作人
    private Timestamp recordTime;        // 操作时间
    private String action;               // 操作类型（创建、修改、锁定、审批）
    private String content;              // 变更内容
}
```

#### QuotationRefundPO - 报价退款
```java
@Entity
@Table(name = "quotation_refund")
public class QuotationRefundPO {
    private long qrid;                   // 退款 ID
    private QuotationPO quotation;       // 关联报价单
    private long refundAmount;           // 退款金额
    private String reason;               // 退款原因
    private Timestamp applyTime;         // 申请时间
    private Timestamp approveTime;       // 审批时间
    private short status;                // 状态（待审批、已批准、已拒绝）
}
```

#### ProtationPO - 定制产品报价
```java
@Entity
@Table(name = "protation")
public class ProtationPO {
    private long pid;                    // 定制产品 ID
    private QuotationPO quotation;       // 关联报价单
    private String productType;          // 产品类型（橱柜、衣柜等）
    private String material;             // 材质
    private double length;               // 长度
    private double width;                // 宽度
    private double height;               // 高度
    private long totalPrice;             // 总价
    private long costPrice;              // 成本价
}
```

#### ExtensionPO - 延伸报价
```java
@Entity
@Table(name = "extension")
public class ExtensionPO {
    private long eid;                    // 延伸 ID
    private QuotationPO quotation;       // 关联报价单
    private String itemName;             // 项目名称
    private String category;             // 类别
    private long totalPrice;             // 总价
}
```

#### AddReducePO - 增减项
```java
@Entity
@Table(name = "add_reduce")
public class AddReducePO {
    private long arid;                   // 增减项 ID
    private QuotationPO quotation;       // 关联报价单
    private short type;                  // 类型（1:增项, 2:减项）
    private String itemName;             // 项目名称
    private long price;                  // 金额
    private String reason;               // 原因
    private Timestamp createTime;        // 创建时间
}
```

### 数据库关系
```
quotation (报价单主表) 1:N
├── quotation_function_area (功能区) 1:N
│   └── quotation_function_area_item (功能区明细)
├── selection (选材方案) 1:N
│   └── selection_item (选材明细)
├── quotation_record (变更记录)
├── quotation_refund (退款)
├── protation (定制产品) 1:N
│   └── protation_item (定制产品明细)
├── extension (延伸报价) 1:N
│   └── extension_item (延伸明细)
└── add_reduce (增减项) 1:N
    └── add_reduce_item (增减项明细)
```

---

## 测试与质量

### 当前测试状态
- **单元测试**: 无
- **集成测试**: 无
- **测试覆盖率**: 0%

### 建议测试策略
1. **报价计算逻辑测试**
   - 测试功能区报价总价计算
   - 测试折扣、管理费、税费计算
   - 测试增减项价格计算

2. **业务流程测试**
   - 报价单创建 → 编辑 → 锁定 → 审批流程
   - 报价版本切换测试
   - 选材方案切换与价格联动测试

3. **数据一致性测试**
   - 报价单与订单关联一致性
   - 报价明细汇总与总价一致性
   - 报价变更记录完整性

---

## 常见问题 (FAQ)

### Q1: 如何创建一个新报价单？
**A**: 报价单必须依附于装饰订单创建。流程：
1. 选择订单 (`orderId`)
2. 选择报价版本 (`version`)
3. 系统根据房屋面积和版本自动生成初始报价
4. 设计师在功能区报价页面编辑明细
5. 保存并锁定后提交审批

### Q2: 报价单的默认报价是什么？
**A**: 每个订单可以有多个报价单（不同方案、不同版本），其中一个标记为默认报价 (`defaults = 1`)。默认报价会自动用于订单的价格展示和合同生成。

### Q3: 报价版本管理如何工作？
**A**: 系统支持多个报价版本（如标准版、升级版），每个版本包含不同的材料定额和价格体系。报价单创建时选择版本后，材料价格会根据版本配置自动填充。

### Q4: 报价单的状态流转？
**A**:
- `status = 0 (初始)`: 可编辑
- `status = 1 (锁定)`: 已提交审批，不可编辑
- `status = 2 (审批通过)`: 可用于生成合同

### Q5: 如何处理报价后的增减项？
**A**:
- 方式一：修改原报价单的增减项表 (`add_reduce`)
- 方式二：创建新的报价单作为补充报价
- 增减项会记录在报价变更记录表 (`quotation_record`) 中

### Q6: 报价退款如何处理？
**A**: 通过 `QuotationRefundAction` 创建退款申请，关联到原报价单，审批通过后生成退款记录。退款金额会影响订单的应付款统计。

---

## 相关文件清单

### Action 控制器 (27 个)
```
action/
├── QuotationAction.java                    - 报价单主控制器
├── QuotationFunctionAreaAction.java        - 功能区报价
├── QuotationFunctionAreaItemAction.java    - 功能区明细
├── SelectionAction.java                    - 选材方案
├── SelectionItemAction.java                - 选材明细
├── QuotationRecordAction.java              - 变更记录
├── QuotationRefundAction.java              - 退款管理
├── QuotationRefundItemAction.java          - 退款明细
├── QuotationPictureAction.java             - 报价图片
├── QuotationPreferAction.java              - 优惠管理
├── ProtationAction.java                    - 定制产品报价
├── ProtationItemAction.java                - 定制产品明细
├── ProtationCostAction.java                - 定制产品成本
├── ExtensionAction.java                    - 延伸报价
├── ExtensionItemAction.java                - 延伸明细
├── AddReduceAction.java                    - 增减项
├── AddReduceItemAction.java                - 增减项明细
├── QeasureAction.java                      - 测量管理
├── NormtionAction.java                     - 定额报价
├── NormoodItemAction.java                  - 定额材料明细
├── NormriceItemAction.java                 - 定额价格明细
├── QuotationFunctionAction.java            - 功能管理
├── QuotetionAction.java                    - 报价单（旧版）
├── QuotetionFunctionAreaAction.java        - 功能区（旧版）
├── QuotetionFunctionAreaItemAction.java    - 功能区明细（旧版）
└── QuotationRemeasureAction.java           - 复尺管理
```

### 服务层 (27 个)
```
service/
├── QuotationService.java                   - 报价单核心服务
├── QuotationFunctionAreaService.java       - 功能区服务
├── QuotationFunctionAreaItemService.java   - 功能区明细服务
├── SelectionService.java                   - 选材方案服务
├── SelectionItemService.java               - 选材明细服务
├── QuotationRecordService.java             - 变更记录服务
├── QuotationRefundService.java             - 退款服务
├── QuotationRefundItemService.java         - 退款明细服务
├── QuotationPreferService.java             - 优惠服务
├── QuotationPictureService.java            - 图片服务
├── QuotationRemeasureService.java          - 复尺服务
├── ProtationService.java                   - 定制产品服务
├── ProtationItemService.java               - 定制产品明细服务
├── ProtationCostService.java               - 定制产品成本服务
├── ExtensionService.java                   - 延伸报价服务
├── ExtensionItemService.java               - 延伸明细服务
├── AddReduceService.java                   - 增减项服务
├── AddReduceItemService.java               - 增减项明细服务
├── QeasureService.java                     - 测量服务
├── QeasureFunctionAreaService.java         - 测量功能区服务
├── NormtionService.java                    - 定额报价服务
├── NormoodItemService.java                 - 定额材料服务
├── NormriceItemService.java                - 定额价格服务
└── QuotationFunctionService.java           - 功能管理服务
```

### 实体类 (31 个)
```
po/
├── QuotationPO.java                        - 报价单主表
├── QuotationFunctionAreaPO.java            - 功能区
├── QuotationFunctionAreaItemPO.java        - 功能区明细
├── QuotationFunctionAreaParamPO.java       - 功能区参数
├── SelectionPO.java                        - 选材方案
├── SelectionItemPO.java                    - 选材明细
├── QuotationRecordPO.java                  - 变更记录
├── QuotationRefundPO.java                  - 退款
├── QuotationRefundItemPO.java              - 退款明细
├── QuotationPicturePO.java                 - 报价图片
├── QuotationPreferPO.java                  - 优惠
├── QuotationRemeasurePO.java               - 复尺记录
├── QuotationRemeasureItemPO.java           - 复尺明细
├── ProtationPO.java                        - 定制产品
├── ProtationItemPO.java                    - 定制产品明细
├── ProtationCostPO.java                    - 定制产品成本
├── ExtensionPO.java                        - 延伸报价
├── ExtensionItemPO.java                    - 延伸明细
├── AddReducePO.java                        - 增减项
├── AddReduceItemPO.java                    - 增减项明细
├── QeasurePO.java                          - 测量记录
├── QeasureItemPO.java                      - 测量明细
├── QeasureOptionPO.java                    - 测量选项
├── QeasureFunctionAreaPO.java              - 测量功能区
├── NormtionPO.java                         - 定额报价
├── NormoodItemPO.java                      - 定额材料明细
├── NormriceItemPO.java                     - 定额价格明细
├── QuotationFunctionPO.java                - 功能管理
├── QuotetionPO.java                        - 报价单（旧版）
├── QuotetionFunctionAreaPO.java            - 功能区（旧版）
└── QuotetionFunctionAreaItemPO.java        - 功能区明细（旧版）
```

### 数据访问层 (DAO)
每个 PO 对应一个 Dao 接口和 DaoImpl 实现类（约 60 个文件）

### 值对象 (VO)
每个 PO 对应一个 VO 类（约 31 个文件）

---

## 变更记录 (Changelog)

### 2025-12-01 15:28:48
- 初始化模块文档
- 完成报价管理模块架构分析
- 记录 31 个核心实体、27 个 Action 控制器、27 个 Service 服务
- 待补充：DAO 层详细分析、前端页面交互流程、报价计算算法详解
