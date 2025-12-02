# communion - 公共基础模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com.fanglin](../) > **communion**

> 最后更新：2025-12-01 15:28:48

---

## 模块职责

公共基础模块（communion）是整个 ERP 系统的**基础数据层**，为所有业务模块提供通用的基础数据支持。该模块包含了部门、岗位、品牌、品类、小区村落、工种等系统运行所必需的元数据。

**核心功能**
- 部门与岗位管理
- 品牌与品类管理
- 小区与村落管理
- 工种类型管理
- 计量单位管理
- 报价分类管理
- 任务与角色配置
- 价格池管理

---

## 入口与启动

### 主要 Action 控制器
| Action 类 | 职责 | 关键功能 |
|----------|------|----------|
| `CommunionCommonAction.java` | 公共基础数据主控制器 | 基础数据的统一查询与管理入口 |
| `DepartmentAction.java` | 部门管理 | 部门树形结构、部门人员 |
| `PostAction.java` | 岗位管理 | 岗位配置、岗位权限 |
| `BrandAction.java` | 品牌管理 | 材料品牌、品牌分类 |
| `CategoryAction.java` | 品类管理 | 材料品类、品类层级 |
| `VillageAction.java` | 小区村落管理 | 小区、村落、街道等地理信息 |
| `WorkTypeAction.java` | 工种管理 | 工种类型、工种等级 |

### 前端页面路径
```
WebContent/views/communion/
├── department.html             - 部门管理
├── brand.html                  - 品牌管理
├── category.html               - 品类管理
├── village.html                - 小区村落管理
└── worktype.html               - 工种管理
```

---

## 对外接口

### REST API 接口

#### 部门管理
```
GET  /pageDepartment.do         - 查询部门列表
POST /addDepartment.do          - 添加部门
POST /updateDepartment.do       - 更新部门
POST /deleteDepartment.do       - 删除部门
GET  /queryDepartmentTree.do    - 查询部门树
```

#### 品牌品类管理
```
GET  /pageBrand.do              - 查询品牌列表
POST /addBrand.do               - 添加品牌
GET  /pageCategory.do           - 查询品类列表
POST /addCategory.do            - 添加品类
```

#### 小区村落管理
```
GET  /pageVillage.do            - 查询小区列表
POST /addVillage.do             - 添加小区
GET  /queryVillageByRegion.do   - 根据区域查询小区
```

#### 工种管理
```
GET  /pageWorkType.do           - 查询工种列表
POST /addWorkType.do            - 添加工种
```

---

## 关键依赖与配置

### 服务层依赖
- `DepartmentService` - 部门服务
- `BrandService` - 品牌服务
- `CategoryService` - 品类服务
- `VillageService` - 小区村落服务
- `WorkTypeService` - 工种服务
- `MeasurementUnitService` - 计量单位服务
- `QuotationClassificationService` - 报价分类服务

### 外部模块依赖
该模块是基础数据模块，**被所有业务模块依赖**，本身不依赖其他业务模块，仅依赖：
- `system` - 系统管理模块（区域、公司等）
- `personel` - 人事模块（人员信息）

---

## 数据模型

### 核心实体 (PO)

#### DepartmentPO - 部门
```java
@Entity
@Table(name = "department")
public class DepartmentPO {
    private long did;                    // 部门 ID
    private String name;                 // 部门名称
    private String code;                 // 部门编码
    private DepartmentPO parent;         // 父部门
    private int level;                   // 层级
    private String path;                 // 路径（用于树形结构）
    private UserPO manager;              // 部门经理
    private short status;                // 状态（启用/禁用）
    private int index;                   // 排序
}
```

#### PostPO - 岗位
```java
@Entity
@Table(name = "post")
public class PostPO {
    private long pid;                    // 岗位 ID
    private String name;                 // 岗位名称
    private String code;                 // 岗位编码
    private DepartmentPO department;     // 所属部门
    private String description;          // 岗位描述
    private short status;                // 状态
}
```

#### BrandPO - 品牌
```java
@Entity
@Table(name = "brand")
public class BrandPO {
    private long bid;                    // 品牌 ID
    private String name;                 // 品牌名称
    private String category;             // 品类（瓷砖/地板/涂料等）
    private String logo;                 // 品牌 LOGO
    private String description;          // 品牌描述
    private String origin;               // 产地
    private short status;                // 状态
}
```

#### CategoryPO - 品类
```java
@Entity
@Table(name = "category")
public class CategoryPO {
    private long cid;                    // 品类 ID
    private String name;                 // 品类名称
    private String code;                 // 品类编码
    private CategoryPO parent;           // 父品类
    private int level;                   // 层级
    private short status;                // 状态
    private int index;                   // 排序
}
```

#### VillagePO - 小区村落
```java
@Entity
@Table(name = "village")
public class VillagePO {
    private long vid;                    // 小区 ID
    private String name;                 // 小区名称
    private String type;                 // 类型（小区/村落/街道）
    private String address;              // 地址
    private String cityCode;             // 城市编码
    private String regionCode;           // 区域编码
    private double avgPrice;             // 均价
    private int houseCount;              // 房屋数量
    private String propertyCompany;      // 物业公司
    private short status;                // 状态
}
```

#### WorkTypePO - 工种
```java
@Entity
@Table(name = "worktype")
public class WorkTypePO {
    private long wid;                    // 工种 ID
    private String name;                 // 工种名称（水电工/木工/瓦工等）
    private String category;             // 类别（基础工/精细工）
    private String level;                // 等级（初级/中级/高级）
    private long unitPrice;              // 单价
    private String unit;                 // 计量单位
    private short status;                // 状态
}
```

#### MeasurementUnitPO - 计量单位
```java
@Entity
@Table(name = "measurement_unit")
public class MeasurementUnitPO {
    private long muid;                   // 单位 ID
    private String name;                 // 单位名称（米/平米/个/套等）
    private String symbol;               // 符号（m/㎡/个/套）
    private String category;             // 类别（长度/面积/体积/数量）
}
```

#### QuotationClassificationPO - 报价分类
```java
@Entity
@Table(name = "quotation_classification")
public class QuotationClassificationPO {
    private long qcid;                   // 分类 ID
    private String name;                 // 分类名称
    private String code;                 // 分类编码
    private int level;                   // 层级
    private short status;                // 状态
}
```

#### QuotationBigCategoryPO - 报价大类
```java
@Entity
@Table(name = "quotation_big_category")
public class QuotationBigCategoryPO {
    private long qbid;                   // 大类 ID
    private String name;                 // 大类名称（地面工程/墙面工程等）
    private String code;                 // 大类编码
}
```

#### QuotationSmallCategoryPO - 报价小类
```java
@Entity
@Table(name = "quotation_small_category")
public class QuotationSmallCategoryPO {
    private long qsid;                   // 小类 ID
    private QuotationBigCategoryPO bigCategory; // 关联大类
    private String name;                 // 小类名称（瓷砖铺贴/地板安装等）
    private String code;                 // 小类编码
}
```

#### PricePoolPO - 价格池
```java
@Entity
@Table(name = "price_pool")
public class PricePoolPO {
    private long ppid;                   // 价格池 ID
    private String itemName;             // 项目名称
    private String category;             // 类别
    private long unitPrice;              // 单价
    private String unit;                 // 单位
    private Timestamp effectiveTime;     // 生效时间
    private Timestamp expiryTime;        // 失效时间
}
```

#### TaskPO - 任务配置
```java
@Entity
@Table(name = "task")
public class TaskPO {
    private long tid;                    // 任务 ID
    private String name;                 // 任务名称
    private String type;                 // 任务类型
    private String params;               // 任务参数（JSON）
    private String cronExpression;       // Cron 表达式
    private short status;                // 状态（启用/禁用）
}
```

#### RoleChartPO - 角色图表
```java
@Entity
@Table(name = "role_chart")
public class RoleChartPO {
    private long rcid;                   // 图表 ID
    private RolePO role;                 // 关联角色
    private String chartName;            // 图表名称
    private String chartType;            // 图表类型
    private String chartConfig;          // 图表配置（JSON）
}
```

### 数据库关系
```
department (部门) - 树形结构
post (岗位)
brand (品牌)
category (品类) - 树形结构
village (小区村落)
worktype (工种)
measurement_unit (计量单位)
quotation_classification (报价分类) - 树形结构
  ├── quotation_big_category (报价大类)
  └── quotation_small_category (报价小类)
price_pool (价格池)
task (任务配置) 1:N
  └── task_param (任务参数)
role_chart (角色图表)
```

---

## 测试与质量

### 当前测试状态
- **单元测试**: 无
- **集成测试**: 无
- **测试覆盖率**: 0%

### 建议测试策略
1. **树形结构测试**: 部门、品类等树形数据的完整性
2. **基础数据完整性测试**: 确保关键基础数据存在
3. **数据引用一致性测试**: 检查基础数据被业务模块引用的一致性

---

## 常见问题 (FAQ)

### Q1: communion 模块与 common 模块的区别？
**A**:
- `communion`: 公共**基础数据**模块，管理部门、品牌、小区等元数据
- `common`: 通用**功能**模块，提供登录、上传、验证码等通用服务

### Q2: 部门树形结构如何实现？
**A**: 使用 `parent` 字段关联父部门，`path` 字段存储路径（如 `/1/2/3/`），`level` 字段标识层级。

### Q3: 品牌与品类的关系？
**A**:
- `BrandPO`：具体的品牌（如马可波罗、东鹏）
- `CategoryPO`：品类（如瓷砖、地板、涂料）
- 品牌属于某个品类

### Q4: 小区与楼盘的区别？
**A**:
- `VillagePO`（小区村落）：通用的地理位置信息，包含小区、村落、街道等
- `BuildingPO`（楼盘）：`building` 模块管理的详细楼盘信息
- 小区是更通用的概念，楼盘是小区的详细补充

---

## 相关文件清单

### 核心实体 (约 20+ 个)
```
po/
├── DepartmentPO.java                   - 部门
├── PostPO.java                         - 岗位
├── BrandPO.java                        - 品牌
├── CategoryPO.java                     - 品类
├── CustomerPO.java                     - 客户（基础）
├── HousePO.java                        - 房屋（基础）
├── VillagePO.java                      - 小区村落
├── VillageRulePO.java                  - 小区规则
├── WorkTypePO.java                     - 工种
├── MeasurementUnitPO.java              - 计量单位
├── QuotationClassificationPO.java      - 报价分类
├── QuotationBigCategoryPO.java         - 报价大类
├── QuotationSmallCategoryPO.java       - 报价小类
├── QuotationTypePO.java                - 报价类型
├── PricePoolPO.java                    - 价格池
├── TaskPO.java                         - 任务
├── TaskParamPO.java                    - 任务参数
├── RoleChartPO.java                    - 角色图表
├── RoleTaskPO.java                     - 角色任务
├── ServiceNodePO.java                  - 服务节点
└── UpgradePO.java                      - 升级记录
```

---

## 变更记录 (Changelog)

### 2025-12-01 15:28:48
- 初始化模块文档
- 完成公共基础模块架构分析
- 记录 20+ 个核心实体
- 待补充：Action 和 Service 层详细分析
