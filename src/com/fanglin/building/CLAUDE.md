# building - 楼盘管理模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com.fanglin](../) > **building**

> 最后更新：2025-12-01 15:28:48

---

## 模块职责

楼盘管理模块负责小区楼盘、楼栋、房屋等基础数据的管理，为客户管理、装饰订单等业务提供房屋信息支持。该模块是业务的基础数据层。

**核心功能**
- 楼盘（小区）信息管理
- 楼栋信息管理
- 房屋信息管理
- 房屋与业主关联
- 楼盘进度跟踪
- 楼盘图纸管理

---

## 入口与启动

### 主要 Action 控制器
| Action 类 | 职责 | 关键方法 |
|----------|------|----------|
| `BuildingAction.java` | 楼盘主控制器 | 楼盘 CRUD、楼盘列表查询 |
| `BuildingHouseAction.java` | 房屋管理 | 房屋信息管理、房屋与业主关联 |
| `BuildingNodeAction.java` | 楼盘节点 | 楼盘开发节点、施工进度 |
| `BuildingScheduleAction.java` | 楼盘进度 | 楼盘整体进度跟踪 |
| `BuildingDrawingAction.java` | 楼盘图纸 | 楼盘平面图、户型图管理 |
| `BuildingCustomerAction.java` | 楼盘客户 | 楼盘业主信息关联 |
| `BuildingRecordAction.java` | 楼盘记录 | 楼盘变更记录、操作日志 |

### 前端页面路径
```
WebContent/views/building/
├── building.html               - 楼盘列表
├── building_detail.html        - 楼盘详情
├── building_house.html         - 房屋管理
└── building_drawing.html       - 图纸管理
```

---

## 对外接口

### REST API 接口

#### 楼盘管理
```
GET  /pageBuilding.do           - 分页查询楼盘列表
POST /addBuilding.do            - 添加楼盘
POST /updateBuilding.do         - 更新楼盘信息
POST /deleteBuilding.do         - 删除楼盘
GET  /queryBuildingById.do      - 查询楼盘详情
```

#### 房屋管理
```
GET  /pageBuildingHouse.do      - 查询房屋列表
POST /addBuildingHouse.do       - 添加房屋
POST /updateBuildingHouse.do    - 更新房屋信息
POST /deleteBuildingHouse.do    - 删除房屋
GET  /queryBuildingHouseById.do - 查询房屋详情
GET  /queryHouseByBuilding.do   - 根据楼盘查询房屋
```

#### 楼盘进度
```
GET  /pageBuildingSchedule.do   - 查询楼盘进度
POST /updateBuildingSchedule.do - 更新进度
```

#### 楼盘图纸
```
GET  /pageBuildingDrawing.do    - 查询图纸列表
POST /uploadBuildingDrawing.do  - 上传图纸
POST /deleteBuildingDrawing.do  - 删除图纸
```

---

## 关键依赖与配置

### 服务层依赖
- `BuildingService` - 楼盘核心服务
- `BuildingHouseService` - 房屋服务
- `BuildingNodeService` - 节点服务
- `BuildingScheduleService` - 进度服务
- `BuildingDrawingService` - 图纸服务
- `BuildingCustomerService` - 客户关联服务
- `BuildingRecordService` - 记录服务

### 外部模块依赖
| 依赖模块 | 用途 |
|---------|------|
| `communion` | 使用小区村落等基础数据 |
| `customer` | 客户信息关联房屋 |
| `decoration` | 装饰订单关联房屋 |
| `system` | 使用区域、城市等系统配置 |

---

## 数据模型

### 核心实体 (PO)

#### BuildingPO - 楼盘
```java
@Entity
@Table(name = "building")
public class BuildingPO {
    private long bid;                    // 楼盘 ID
    private String name;                 // 楼盘名称
    private String address;              // 地址
    private String developer;            // 开发商
    private String propertyCompany;      // 物业公司
    private int buildingCount;           // 楼栋数量
    private int houseCount;              // 房屋数量
    private double avgPrice;             // 均价（元/平米）
    private String propertyType;         // 物业类型（住宅/商业/别墅）
    private String deliverStandard;      // 交房标准（毛坯/精装）
    private Timestamp deliverTime;       // 交房时间
    private String cityCode;             // 城市编码
    private String regionCode;           // 区域编码
    private String remark;               // 备注
    private short status;                // 状态（在建/已交付）
}
```

#### BuildingHousePO - 房屋
```java
@Entity
@Table(name = "building_house")
public class BuildingHousePO {
    private long bhid;                   // 房屋 ID
    private BuildingPO building;         // 关联楼盘
    private String buildingNo;           // 楼栋号
    private String unit;                 // 单元号
    private String floor;                // 楼层
    private String houseNo;              // 房号
    private String houseType;            // 户型（三室两厅等）
    private double buildArea;            // 建筑面积
    private double innerArea;            // 套内面积
    private double freeArea;             // 使用面积
    private String orientation;          // 朝向
    private String owner;                // 业主姓名
    private String ownerPhone;           // 业主电话
    private CustomerPO customer;         // 关联客户
    private short status;                // 状态（待售/已售/已装修）
}
```

#### BuildingNodePO - 楼盘节点
```java
@Entity
@Table(name = "building_node")
public class BuildingNodePO {
    private long bnid;                   // 节点 ID
    private BuildingPO building;         // 关联楼盘
    private String nodeName;             // 节点名称（开盘/封顶/交付等）
    private Timestamp planTime;          // 计划时间
    private Timestamp actualTime;        // 实际时间
    private String description;          // 描述
    private short status;                // 状态（未开始/进行中/已完成）
}
```

#### BuildingSchedulePO - 楼盘进度
```java
@Entity
@Table(name = "building_schedule")
public class BuildingSchedulePO {
    private long bsid;                   // 进度 ID
    private BuildingPO building;         // 关联楼盘
    private String stage;                // 阶段（基础施工/主体施工/装修等）
    private int progress;                // 进度（0-100）
    private Timestamp updateTime;        // 更新时间
    private String remark;               // 备注
}
```

#### BuildingDrawingPO - 楼盘图纸
```java
@Entity
@Table(name = "building_drawing")
public class BuildingDrawingPO {
    private long bdid;                   // 图纸 ID
    private BuildingPO building;         // 关联楼盘
    private String drawingType;          // 图纸类型（总平面图/户型图/施工图等）
    private String fileName;             // 文件名
    private String filePath;             // 文件路径
    private long fileSize;               // 文件大小
    private Timestamp uploadTime;        // 上传时间
    private UserPO uploader;             // 上传人
}
```

#### BuildingCustomerPO - 楼盘客户关联
```java
@Entity
@Table(name = "building_customer")
public class BuildingCustomerPO {
    private long bcid;                   // 关联 ID
    private BuildingPO building;         // 关联楼盘
    private BuildingHousePO house;       // 关联房屋
    private CustomerPO customer;         // 关联客户
    private String relation;             // 关系（业主/租户）
    private Timestamp moveInTime;        // 入住时间
}
```

#### BuildingRecordPO - 楼盘记录
```java
@Entity
@Table(name = "building_record")
public class BuildingRecordPO {
    private long brid;                   // 记录 ID
    private BuildingPO building;         // 关联楼盘
    private UserPO user;                 // 操作人
    private Timestamp recordTime;        // 操作时间
    private String action;               // 操作类型（创建/修改/删除）
    private String content;              // 操作内容
}
```

### 数据库关系
```
building (楼盘) 1:N
├── building_house (房屋)
├── building_node (楼盘节点)
├── building_schedule (楼盘进度)
├── building_drawing (楼盘图纸)
├── building_customer (客户关联)
└── building_record (操作记录)
```

---

## 测试与质量

### 当前测试状态
- **单元测试**: 无
- **集成测试**: 无
- **测试覆盖率**: 0%

### 建议测试策略
1. **数据一致性测试**: 楼盘、楼栋、房屋的层级关系一致性
2. **业务关联测试**: 房屋与客户、订单的关联关系
3. **数据完整性测试**: 楼盘基础数据的完整性校验

---

## 常见问题 (FAQ)

### Q1: 楼盘、小区、村落的关系？
**A**:
- `BuildingPO`（楼盘）：本模块管理的实体，主要针对商品房小区
- `VillagePO`（小区/村落）：`communion` 模块管理的基础数据，更通用，包含小区、村落、街道等
- 两者可以关联，楼盘是小区的详细信息补充

### Q2: 房屋状态流转？
**A**:
- 待售 → 已售 → 已装修
- 房屋与客户关联后，状态变为已售
- 关联装饰订单后，状态变为已装修

### Q3: 楼盘进度如何跟踪？
**A**: 通过 `BuildingNodePO` 定义关键节点（开盘、封顶、交付），通过 `BuildingSchedulePO` 跟踪各阶段施工进度。

---

## 相关文件清单

### Action 控制器 (7 个)
```
action/
├── BuildingAction.java              - 楼盘主控制器
├── BuildingHouseAction.java         - 房屋管理
├── BuildingNodeAction.java          - 楼盘节点
├── BuildingScheduleAction.java      - 楼盘进度
├── BuildingDrawingAction.java       - 楼盘图纸
├── BuildingCustomerAction.java      - 楼盘客户关联
└── BuildingRecordAction.java        - 楼盘记录
```

### 实体类 (7 个)
```
po/
├── BuildingPO.java                  - 楼盘
├── BuildingHousePO.java             - 房屋
├── BuildingNodePO.java              - 楼盘节点
├── BuildingSchedulePO.java          - 楼盘进度
├── BuildingDrawingPO.java           - 楼盘图纸
├── BuildingCustomerPO.java          - 楼盘客户关联
└── BuildingRecordPO.java            - 楼盘记录
```

---

## 变更记录 (Changelog)

### 2025-12-01 15:28:48
- 初始化模块文档
- 完成楼盘管理模块架构分析
- 记录 7 个核心实体、7 个 Action 控制器
