# 客户城区分配规则详细设计文档

> **文档版本**: v1.0
> **创建日期**: 2026-03-12
> **作者**: Claude
> **项目**: Rhadamanthus - 方林装饰 ERP 系统

---

## 📋 目录

- [1. 需求背景](#1-需求背景)
- [2. 需求目标](#2-需求目标)
- [3. 总体设计](#3-总体设计)
- [4. 数据库设计](#4-数据库设计)
- [5. 后端代码设计](#5-后端代码设计)
- [6. 前端界面设计](#6-前端界面设计)
- [7. 分配流程设计](#7-分配流程设计)
- [8. 测试方案](#8-测试方案)
- [9. 实施计划](#9-实施计划)
- [10. 风险评估](#10-风险评估)
- [11. 附录](#11-附录)

---

## 1. 需求背景

### 1.1 当前问题

当前客户资源自动分配系统存在以下限制：

- ❌ **无法按城区限制分配范围**：所有设计师均可接收任意区域的客户资源
- ❌ **跨区分配不合理**：客户资源可能分配给距离较远的设计师
- ❌ **管理粒度不足**：无法实现"城区A的客户只分配给城区A的设计师"
- ❌ **业务扩展受限**：未来可能需要按街道、片区等维度控制分配

### 1.2 业务需求

业务部门提出以下需求：

1. **城区隔离**：不同城区的客户资源应优先分配给对应城区的设计师
2. **灵活配置**：支持按城区配置可分配的公司、部门、设计师
3. **兼容现有**：不影响现有的面积段、部门、部门类型等匹配规则
4. **逐步演进**：分阶段实施，先快速上线，后逐步完善

---

## 2. 需求目标

### 2.1 核心目标

✅ **第一阶段（1-2周）**：快速上线城区→设计师的映射功能
✅ **第二阶段（1-2月）**：建立完整的城区规则体系

### 2.2 功能目标

| 功能点 | 第一阶段 | 第二阶段 |
|-------|---------|---------|
| 城区→设计师映射 | ✅ | ✅ |
| 城区→公司映射 | ❌ | ✅ |
| 城区→部门映射 | ❌ | ✅ |
| 城区规则管理界面 | ❌ | ✅ |
| 规则优先级控制 | ✅ | ✅ |
| 兼容现有规则 | ✅ | ✅ |

### 2.3 性能目标

- ⚡ 分配接口响应时间：≤ 500ms
- ⚡ 规则查询性能：≤ 100ms
- ⚡ 支持并发分配：≥ 10 TPS

---

## 3. 总体设计

### 3.1 设计思路

采用**渐进式演进**策略，分两个阶段实施：

```
第一阶段：扩展人员规则明细
├── 扩展现有表结构
├── 增加城区匹配逻辑
└── 快速上线城区→设计师映射

第二阶段：建立城区规则体系
├── 新建城区规则表
├── 实现多级映射（城区→公司→部门→设计师）
└── 提供完整的管理界面
```

### 3.2 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                     前端层 (Web)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 规则配置页面  │  │ 分配管理页面  │  │ 规则查询接口  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP/JSON
┌─────────────────────────────────────────────────────────┐
│                   控制层 (Action)                       │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ CustomerCityRule  │  │ CustomerUserRuleItemAction   │ │
│  │     Action        │  │           (扩展)             │ │
│  └──────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   服务层 (Service)                      │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ CustomerCityRule  │  │ CustomerUserRuleItemService  │ │
│  │     Service       │  │          (扩展)              │ │
│  └──────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   数据访问层 (DAO)                       │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ CustomerCityRule  │  │ CustomerUserRuleItemDao      │ │
│  │       Dao         │  │          (扩展)              │ │
│  └──────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   数据层 (Database)                      │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ customercityrule  │  │ customeruserruleitem (扩展)   │ │
│  │     (新增)        │  │                               │ │
│  └──────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3.3 设计原则

1. **兼容性原则**：不破坏现有规则体系
2. **渐进式原则**：分阶段实施，逐步完善
3. **灵活性原则**：支持多种配置方式
4. **性能优先原则**：确保分配性能不受影响
5. **可扩展原则**：预留扩展空间，支持未来需求

---

## 4. 数据库设计

### 4.1 第一阶段：扩展现有表

#### 4.1.1 修改 `customeruserruleitem` 表

```sql
-- 修改现有表，增加城区字段
ALTER TABLE customer.customeruserruleitem
ADD COLUMN cityid INT COMMENT '城区ID，关联cityproper表' AFTER lowval;

-- 添加索引
ALTER TABLE customer.customeruserruleitem
ADD INDEX idx_cityid (cityid);

-- 添加外键约束（可选）
ALTER TABLE customer.customeruserruleitem
ADD CONSTRAINT fk_customeruserruleitem_city
FOREIGN KEY (cityid) REFERENCES communion.cityproper(cpid) ON DELETE SET NULL;
```

#### 4.1.2 字段说明

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|------|------|
| `cityid` | INT | 城区ID，关联 `cityproper.cpid` | 可为 NULL |
| `type` | SMALLINT | 规则类型 | 4 表示城区规则 |
| `priority` | SMALLINT | 优先级 | 数字越大优先级越高 |

#### 4.1.3 数据示例

```sql
-- 示例1：城区规则（优先级5）
INSERT INTO customer.customeruserruleitem
(curid, type, cityid, priority, isSurplus, isDelete, status, createTime)
VALUES
(1001, 4, 101, 5, 0, 1, 0, NOW());

-- 示例2：面积段规则（优先级1，兼容原有）
INSERT INTO customer.customeruserruleitem
(curid, type, uppval, lowval, priority, isSurplus, isDelete, status, createTime)
VALUES
(1001, 0, 140000, 100000, 1, 0, 1, 0, NOW());

-- 示例3：管理规则（兜底，优先级99）
INSERT INTO customer.customeruserruleitem
(curid, type, priority, isSurplus, isDelete, status, createTime)
VALUES
(1001, 1, 99, 0, 1, 0, NOW());
```

### 4.2 第二阶段：新增城区规则表

#### 4.2.1 创建 `customercityrule` 表

```sql
-- 创建城区规则表
CREATE TABLE customer.customercityrule (
    ccrid BIGINT AUTO_INCREMENT COMMENT '规则ID',

    -- 关联字段
    cityid INT NOT NULL COMMENT '城区ID，关联cityproper表',
    company INT NOT NULL COMMENT '创建公司',

    -- 目标对象（三选一，或组合使用）
    cid INT COMMENT '可分配公司ID，关联company表',
    did INT COMMENT '可分配部门ID，关联department表',
    uid INT COMMENT '可分配设计师ID，关联user表',

    -- 规则属性
    type SMALLINT NOT NULL COMMENT '规则类型：0=公司, 1=部门, 2=设计师',
    priority SMALLINT DEFAULT 0 COMMENT '优先级，数字越大优先级越高',
    status SMALLINT DEFAULT 0 COMMENT '状态：0=启用, 1=禁用',

    -- 审计字段
    createruid INT COMMENT '创建人ID',
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateruid INT COMMENT '更新人ID',
    updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    finishTime TIMESTAMP NULL COMMENT '失效时间',

    -- 备注
    comment VARCHAR(500) COMMENT '备注说明',

    PRIMARY KEY (ccrid),
    INDEX idx_cityid (cityid),
    INDEX idx_company (company),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_priority (priority)

) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客户城区分配规则表';

-- 添加外键约束
ALTER TABLE customer.customercityrule
ADD CONSTRAINT fk_customercityrule_city
FOREIGN KEY (cityid) REFERENCES communion.cityproper(cpid);

ALTER TABLE customer.customercityrule
ADD CONSTRAINT fk_customercityrule_company
FOREIGN KEY (company) REFERENCES system.company(cid);

ALTER TABLE customer.customercityrule
ADD CONSTRAINT fk_customercityrule_targetcompany
FOREIGN KEY (cid) REFERENCES system.company(cid) ON DELETE SET NULL;

ALTER TABLE customer.customercityrule
ADD CONSTRAINT fk_customercityrule_dept
FOREIGN KEY (did) REFERENCES communion.department(did) ON DELETE SET NULL;

ALTER TABLE customer.customercityrule
ADD CONSTRAINT fk_customercityrule_user
FOREIGN KEY (uid) REFERENCES communion.user(uid) ON DELETE SET NULL;
```

#### 4.2.2 字段说明

| 字段名 | 类型 | 说明 | 必填 |
|-------|------|------|------|
| `ccrid` | BIGINT | 规则ID（主键） | ✅ |
| `cityid` | INT | 城区ID | ✅ |
| `company` | INT | 创建公司 | ✅ |
| `cid` | INT | 可分配公司ID | ❌ |
| `did` | INT | 可分配部门ID | ❌ |
| `uid` | INT | 可分配设计师ID | ❌ |
| `type` | SMALLINT | 规则类型 | ✅ |
| `priority` | SMALLINT | 优先级 | ✅ |
| `status` | SMALLINT | 状态 | ✅ |
| `comment` | VARCHAR(500) | 备注 | ❌ |

#### 4.2.3 规则类型说明

```java
public static final short TYPE_COMPANY_INT = 0;    // 城区→公司
public static final short TYPE_DEPT_INT = 1;       // 城区→部门
public static final short TYPE_USER_INT = 2;       // 城区→设计师
```

#### 4.2.4 数据示例

```sql
-- 示例1：城区→公司映射
INSERT INTO customer.customercityrule
(cityid, company, type, cid, priority, status, comment)
VALUES
(101, 1, 0, 1, 10, 0, '城区101的客户优先分配给公司1'),
(101, 1, 0, 2, 5, 0, '城区101的客户次选分配给公司2');

-- 示例2：城区→部门映射
INSERT INTO customer.customercityrule
(cityid, company, type, did, priority, status, comment)
VALUES
(102, 1, 1, 1001, 10, 0, '城区102的客户优先分配给设计一部'),
(102, 1, 1, 1002, 5, 0, '城区102的客户次选分配给设计二部');

-- 示例3：城区→设计师映射
INSERT INTO customer.customercityrule
(cityid, company, type, uid, priority, status, comment)
VALUES
(103, 1, 2, 10001, 10, 0, '城区103的客户优先分配给设计师张三'),
(103, 1, 2, 10002, 5, 0, '城区103的客户次选分配给设计师李四');
```

---

## 5. 后端代码设计

### 5.1 第一阶段：扩展人员规则明细

#### 5.1.1 部门规则聚焦设计 (Focus Design)

**设计思路**: 部门规则 (`CustomerDeptRulePO`) 中的 `focus` 字段控制在自动分配时如何匹配人员规则明细 (`CustomerUserRuleItemPO`)。通过增加城区聚焦类型，实现城区优先匹配。

**文件**: `src/com/fanglin/customer/po/CustomerDeptRulePO.java`

```java
@Entity
@Table(name = "customerDeptRule", catalog = "customer")
public class CustomerDeptRulePO implements Serializable {

    private static final long serialVersionUID = 1L;

    // 聚焦类型常量
    public static final short FOCUS_COM_INT = 0;        // 公司级（部门+部门类型）
    public static final short FOCUS_AREA_INT = 1;       // 面积优先
    public static final short FOCUS_DEPT_INT = 2;       // 部门优先
    public static final short FOCUS_DEPT_TYPE_INT = 3;  // 部门类型优先
    public static final short FOCUS_CITY_INT = 4;       // 城区优先（新增）

    // 分配类型常量
    public static final short ATTTYPE_AUTO_INT = 0;     // 自动分配
    public static final short ATTTYPE_USER_INT = 1;     // 指定人员
    public static final short ATTTYPE_DEPT_INT = 2;     // 部门分配
    public static final short ATTTYPE_REGION_INT = 3;   // 区域分配

    // ... 其他字段保持不变

    private short atttype;  // 分配类型（AUTO/USER/DEPT/REGION）
    private short focus;    // 聚焦类型（COM/AREA/DEPT/DEPT_TYPE/CITY）

    // Getters and Setters
    @Column(name = "focus")
    public short getFocus() {
        return focus;
    }

    public void setFocus(short focus) {
        this.focus = focus;
    }

    // ... 其他方法保持不变
}
```

**聚焦类型说明**:

| 聚焦类型 | 常量值 | 匹配逻辑 | 应用场景 |
|---------|--------|---------|---------|
| 公司级 | `FOCUS_COM_INT = 0` | 匹配部门+部门类型 | 全公司范围内的分配 |
| 面积优先 | `FOCUS_AREA_INT = 1` | 优先匹配面积段规则 | 按面积段分配设计师 |
| 部门优先 | `FOCUS_DEPT_INT = 2` | 优先匹配部门规则 | 部门内自行分配 |
| 部门类型优先 | `FOCUS_DEPT_TYPE_INT = 3` | 优先匹配部门类型规则 | 按部门类型分配 |
| **城区优先** | **`FOCUS_CITY_INT = 4`** | **优先匹配城区规则** | **按城区分配设计师（新增）** |

**聚焦与规则明细的对应关系**:

```
FOCUS_COM_INT (0)
    → 拉取参数: did=<客户创建人部门>, dtid=<客户创建人部门类型>
    → 匹配规则: type=2(部门) OR type=3(部门类型)

FOCUS_AREA_INT (1)
    → 拉取参数: did=0, dtid=0
    → 匹配规则: type=0(面积段)

FOCUS_DEPT_TYPE_INT (3)
    → 拉取参数: did=0, dtid=<客户创建人部门类型>
    → 匹配规则: type=3(部门类型)

FOCUS_DEPT_INT (2)
    → 拉取参数: did=<客户创建人部门>, dtid=0
    → 匹配规则: type=2(部门)

FOCUS_CITY_INT (4) 【新增】
    → 拉取参数: did=0, dtid=0, cityid=<楼盘城区ID>
    → 匹配规则: type=4(城区规则)
```

#### 5.1.2 PO 实体类扩展

**文件**: `src/com/fanglin/customer/po/CustomerUserRuleItemPO.java`

```java
@Entity
@Table(name = "customerUserRuleItem", catalog = "customer")
public class CustomerUserRuleItemPO implements Serializable {

    private static final long serialVersionUID = 1886589670333755624L;

    // 新增：城区规则类型
    public static final short TYPE_CITY_INT = 4;  // 城区规则

    // 原有字段
    private long curiid;
    private long curid;
    private DepartmentTypePO departmentType;
    private DepartmentPO department;
    private String name;
    private short type;

    // 新增字段：城区ID
    private Integer cityid;

    private int uppval;
    private int lowval;
    private short priority;
    private short isSurplus;
    private short isDelete;
    private short status;
    private Timestamp createTime;
    private Timestamp handleTime;
    private Timestamp deleteTime;
    private String comment;

    // Getters and Setters

    @Column(name = "cityid")
    public Integer getCityid() {
        return cityid;
    }

    public void setCityid(Integer cityid) {
        this.cityid = cityid;
    }

    // ... 其他原有方法保持不变
}
```

#### 5.1.2 DAO 层扩展

**文件**: `src/com/fanglin/customer/dao/CustomerUserRuleItemDao.java`

```java
public interface CustomerUserRuleItemDao extends Dao<CustomerUserRuleItemPO> {

    /**
     * 拉取人员规则明细（支持城区匹配）
     * @param company 公司ID
     * @param area 面积
     * @param uids 已排除的设计师ID列表
     * @param did 部门ID
     * @param dtid 部门类型ID
     * @param cityid 城区ID（新增）
     * @return 规则明细
     */
    CustomerUserRuleItemPO pullCustomerUserRuleItem(
        int company, int area, List<Integer> uids, int did, int dtid, Integer cityid
    );
}
```

**文件**: `src/com/fanglin/customer/dao/impl/CustomerUserRuleItemDaoImpl.java`

```java
@Repository("customerUserRuleItemDao")
public class CustomerUserRuleItemDaoImpl extends DaoImpl<CustomerUserRuleItemPO>
    implements CustomerUserRuleItemDao {

    @Override
    public CustomerUserRuleItemPO pullCustomerUserRuleItem(
        int company, int area, List<Integer> uids, int did, int dtid, Integer cityid
    ) {
        if (uids == null) uids = new ArrayList<Integer>();
        uids.add(0);

        String sql =
            "select curi.* " +
            "from customer.customeruserrule cur, customer.customeruserruleitem curi " +
            "where cur.curid = curi.curid " +
            "and cur.company = :company " +
            "and cur.status = 0 and curi.status = 0 " +
            "and ( " +
            "  (curi.type = 0 and curi.uppval < :uppval and curi.lowval >= :lowval) " +  // 面积段
            "  or (curi.type = 1) " +                                                    // 管理规则
            "  or (curi.type = 2 and curi.did = :did and curi.uppval < :uppval1 and curi.lowval >= :lowval1) " +  // 部门
            "  or (curi.type = 3 and curi.dtid = :dtid and curi.uppval < :uppval2 and curi.lowval >= :lowval2) " +  // 部门类型
            "  or (curi.type = 4 and curi.cityid = :cityid) " +                          // 城区规则（新增）
            ") " +
            "and TIMEDIFF(now(), cur.updateTime) > '00:05:00' " +
            "and cur.uid NOT IN :uids " +
            "order by curi.priority desc, curi.handletime, cur.surplus desc " +
            "limit 1";

        SQLQuery query = session().createSQLQuery(sql).addEntity(CustomerUserRuleItemPO.class);

        query.setInteger("company", company)
              .setInteger("uppval", area).setInteger("lowval", area)
              .setInteger("did", did).setInteger("uppval1", area).setInteger("lowval1", area)
              .setInteger("dtid", dtid).setInteger("uppval2", area).setInteger("lowval2", area)
              .setInteger("cityid", cityid != null ? cityid : 0)  // 新增
              .setParameterList("uids", uids);

        return (CustomerUserRuleItemPO) query.uniqueResult();
    }
}
```

#### 5.1.3 Service 层调整

##### 5.1.3.1 CustomerSourceServiceImpl - 城区优先聚焦分支

**文件**: `src/com/fanglin/customer/service/impl/CustomerSourceServiceImpl.java`

**关键修改**: 在 `issueCustomerSource` 方法的聚焦分支判断中，增加城区优先 (`FOCUS_CITY_INT`) 分支。

```java
@Service("customerSourceService")
@Transactional(readOnly = true)
public class CustomerSourceServiceImpl implements CustomerSourceService {

    @Autowired
    private CustomerUserRuleItemDao customerUserRuleItemDao;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void issueCustomerSource(
        CustomerSourceVO customerSourceVO,
        CustomerChanceVO customerChanceVO,
        String userId,
        int company
    ) throws FLException {

        CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

        // ... 前面的验证逻辑保持不变

        if (atttype == CustomerChancePO.ATTTYPE_AUTO_INT) {

            // 【新增】获取楼盘所属城区
            Integer cityid = null;
            if (customerSourcePO.getVillage() != null
                && customerSourcePO.getVillage().getCityProper() != null) {
                cityid = customerSourcePO.getVillage().getCityProper().getCpid();
            }

            CustomerUserRulePO customerUserRulePO;
            CustomerUserRuleItemPO customerUserRuleItemPO = null;
            List<Integer> exporters = new ArrayList<Integer>();

            while (true) {

                // 根据聚焦点拉取规则明细（【修改】所有分支传入城区ID）
                if (customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_COM_INT) {
                    customerUserRuleItemPO = customerUserRuleItemDao.pullCustomerUserRuleItem(
                        company, area, exporters,
                        customerSourcePO.getCreater().getDept().getDid(),
                        customerSourcePO.getCreater().getDept().getType().getDtid(),
                        cityid  // 【新增】城区参数
                    );
                }
                else if (customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_AREA_INT) {
                    customerUserRuleItemPO = customerUserRuleItemDao.pullCustomerUserRuleItem(
                        company, area, exporters, 0, 0, cityid  // 【新增】城区参数
                    );
                }
                else if (customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_DEPT_TYPE_INT) {
                    customerUserRuleItemPO = customerUserRuleItemDao.pullCustomerUserRuleItem(
                        company, area,
                        customerSourcePO.getCreater().getDept().getType().getDtid(),
                        exporters, 0, cityid  // 【新增】城区参数
                    );
                }
                else if (customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_DEPT_INT) {
                    customerUserRuleItemPO = customerUserRuleItemDao.pullCustomerUserRuleItem(
                        company, area, exporters,
                        customerSourcePO.getCreater().getDept().getDid(),
                        0, cityid  // 【新增】城区参数
                    );
                }
                // 【新增】城区优先聚焦分支
                else if (customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_CITY_INT) {
                    customerUserRuleItemPO = customerUserRuleItemDao.pullCustomerUserRuleItem(
                        company, area, exporters, 0, 0, cityid  // 传入城区ID
                    );
                }

                // ... 后续逻辑保持不变（检查冲突、扣减剩余数、创建机会）
            }

            // ... 后续逻辑保持不变
        }

        // ... 其他分支保持不变
    }
}
```

**关键点说明**:
1. **城区ID获取**: 从 `customerSourcePO.getVillage().getCityProper().getCpid()` 获取楼盘所属城区
2. **参数传递**: 所有聚焦分支都传入 `cityid` 参数（即使不使用也传递，保持接口一致）
3. **城区优先分支**: `FOCUS_CITY_INT` 时传入 `did=0, dtid=0, cityid=<城区ID>`，匹配 `type=4` 的城区规则
4. **向后兼容**: 不影响现有的4种聚焦类型，城区规则作为新增的匹配维度

##### 5.1.3.2 CustomerCompanyRuleServiceImpl - 公司规则+城区规则Service层控制

**设计思路**: 在查询公司规则时，通过Service层控制城区规则过滤，**不在DAO层合并SQL**，保持DAO层单一职责。

**文件**: `src/com/fanglin/customer/service/impl/CustomerCompanyRuleServiceImpl.java`

```java
package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerCityRuleDao;
import com.fanglin.customer.dao.CustomerCompanyRuleDao;
import com.fanglin.customer.po.CustomerCityRulePO;
import com.fanglin.customer.po.CustomerCompanyRulePO;
import com.fanglin.customer.service.CustomerCompanyRuleService;
import com.fanglin.customer.vo.CustomerCompanyRuleVO;

@Service("customerCompanyRuleService")
public class CustomerCompanyRuleServiceImpl implements CustomerCompanyRuleService {

    @Autowired
    private CustomerCompanyRuleDao customerCompanyRuleDao;

    @Autowired
    private CustomerCityRuleDao customerCityRuleDao;

    @Override
    public List<CustomerCompanyRuleVO> queryCustomerCompanyRule(
        CustomerCompanyRuleVO customerCompanyRuleVO, int company
    ) throws FLException {

        // Step 1: 查询公司规则（基础过滤条件）
        List<CustomerCompanyRulePO> companyRules = customerCompanyRuleDao.queryCustomerCompanyRule(
            customerCompanyRuleVO.getDept(),      // 部门过滤
            customerCompanyRuleVO.getType(),      // 类型过滤
            customerCompanyRuleVO.getUppval(),    // 面积上限
            customerCompanyRuleVO.getLowval(),    // 面积下限
            company
        );

        // Step 2: 如果提供了城区ID，查询城区规则并过滤
        if (customerCompanyRuleVO.getCityid() != null) {

            // 2.1 查询该城区的规则（城区→公司）
            List<CustomerCityRulePO> cityRules = customerCityRuleDao.queryCustomerCityRuleByType(
                customerCompanyRuleVO.getCityid(),
                company,
                CustomerCityRulePO.TYPE_COMPANY_INT  // 0=城区→公司
            );

            // 2.2 提取允许的公司ID集合
            Set<Integer> allowedCompanyIds = new HashSet<Integer>();
            for (CustomerCityRulePO cityRule : cityRules) {
                if (cityRule.getTargetCompany() != null) {
                    allowedCompanyIds.add(cityRule.getTargetCompany().getCid());
                }
            }

            // 2.3 如果没有配置城区规则，返回空列表
            if (allowedCompanyIds.isEmpty()) {
                return new ArrayList<CustomerCompanyRuleVO>();
            }

            // 2.4 过滤公司规则：只保留城区规则允许的公司
            List<CustomerCompanyRulePO> filteredRules = new ArrayList<CustomerCompanyRulePO>();
            for (CustomerCompanyRulePO rule : companyRules) {
                if (rule.getCompany() != null
                    && allowedCompanyIds.contains(rule.getCompany().getCid())) {
                    filteredRules.add(rule);
                }
            }

            companyRules = filteredRules;
        }

        // Step 3: 转换为VO并去重
        Set<String> uniqueKeys = new HashSet<String>();
        List<CustomerCompanyRuleVO> result = new ArrayList<CustomerCompanyRuleVO>();

        for (CustomerCompanyRulePO po : companyRules) {

            // 去重：使用 "部门ID_类型" 作为唯一键
            String key = buildUniqueKey(po);
            if (uniqueKeys.contains(key)) {
                continue;  // 跳过重复
            }
            uniqueKeys.add(key);

            // 转换为VO
            CustomerCompanyRuleVO vo = new CustomerCompanyRuleVO();
            po.ptv(vo);
            result.add(vo);
        }

        return result;
    }

    /**
     * 构建唯一键用于去重
     */
    private String buildUniqueKey(CustomerCompanyRulePO po) {
        StringBuilder key = new StringBuilder();

        if (po.getDept() != null) {
            key.append(po.getDept().getDid());
        } else {
            key.append("0");
        }

        key.append("_");

        if (po.getType() == CustomerCompanyRulePO.TYPE_AREA_INT) {
            key.append("AREA_");
            key.append(po.getLowval()).append("-").append(po.getUppval());
        } else if (po.getType() == CustomerCompanyRulePO.TYPE_DEPT_INT) {
            key.append("DEPT_");
            key.append(po.getDept() != null ? po.getDept().getDid() : 0);
        }

        return key.toString();
    }
}
```

**VO对象扩展**（仅增加cityid字段用于查询）:

**文件**: `src/com/fanglin/customer/vo/CustomerCompanyRuleVO.java`

```java
public class CustomerCompanyRuleVO implements Serializable {

    private static final long serialVersionUID = 1L;

    // 原有字段
    private Long cscrid;
    private DepartmentVO dept;
    private Integer uppval;
    private Integer lowval;
    private Short type;
    private CompanyVO company;
    private Integer companys;  // 允许的公司ID列表（逗号分隔）
    private Short status;

    // 【新增】城区ID（仅用于查询参数，不映射到PO）
    private Integer cityid;

    // Getters and Setters
    public Integer getCityid() {
        return cityid;
    }

    public void setCityid(Integer cityid) {
        this.cityid = cityid;
    }

    // ... 其他原有方法保持不变
}
```

**Service层控制设计要点**:

1. **职责分离**:
   - **DAO层**: 只负责单一数据源的查询（公司规则、城区规则分别查询）
   - **Service层**: 负责业务逻辑控制（规则合并、过滤、去重）

2. **性能考虑**:
   - 公司规则数据量：几十到几百条
   - 城区规则数据量：几十到几百条
   - 内存过滤性能：可忽略不计（< 10ms）

3. **去重策略**:
   - 使用 `Set<String> uniqueKeys` 记录已处理的规则
   - 唯一键：`部门ID_类型` 或 `部门ID_类型_面积范围`
   - 避免返回重复的公司规则

4. **查询流程**:
   ```
   查询公司规则 → [有cityid?] → 是: 查询城区规则 → 提取允许公司ID → 过滤公司规则 → 去重 → 返回
                         → 否: 直接去重 → 返回
   ```

5. **向后兼容**:
   - `cityid` 为 null 时，等同于原有逻辑（只查询公司规则）
   - `CustomerCompanyRulePO` 不增加字段，保持纯净
   - 仅 `CustomerCompanyRuleVO` 增加 `cityid` 字段用于查询

**DAO层接口扩展**（城区规则查询）:

**文件**: `src/com/fanglin/customer/dao/CustomerCityRuleDao.java`

```java
public interface CustomerCityRuleDao extends Dao<CustomerCityRulePO> {

    /**
     * 根据城区和规则类型查询
     * @param cityid 城区ID
     * @param company 公司ID
     * @param type 规则类型（0=公司, 1=部门, 2=设计师）
     * @return 城区规则列表
     */
    List<CustomerCityRulePO> queryCustomerCityRuleByType(
        Integer cityid,
        int company,
        short type
    );
}
```

**文件**: `src/com/fanglin/customer/dao/impl/CustomerCityRuleDaoImpl.java`

```java
@Repository("customerCityRuleDao")
public class CustomerCityRuleDaoImpl extends DaoImpl<CustomerCityRulePO>
    implements CustomerCityRuleDao {

    @Override
    @SuppressWarnings("unchecked")
    public List<CustomerCityRulePO> queryCustomerCityRuleByType(
        Integer cityid, int company, short type
    ) {
        return session().createCriteria(CustomerCityRulePO.class)
            .createAlias("city", "city")
            .add(Restrictions.eq("city.cpid", cityid))
            .add(Restrictions.eq("company", company))
            .add(Restrictions.eq("type", type))
            .add(Restrictions.eq("status", CustomerCityRulePO.STATUS_ENABLE_INT))
            .addOrder(org.hibernate.criterion.Order.desc("priority"))
            .list();
    }
}
```

**使用示例**:

```java
// 示例1: 不带城区过滤（原有逻辑）
CustomerCompanyRuleVO vo = new CustomerCompanyRuleVO();
vo.setDept(deptVO);
List<CustomerCompanyRuleVO> rules = customerCompanyRuleService.queryCustomerCompanyRule(vo, company);
// → 返回该部门的所有公司规则

// 示例2: 带城区过滤（新增功能）
CustomerCompanyRuleVO vo = new CustomerCompanyRuleVO();
vo.setDept(deptVO);
vo.setCityid(101);  // 和平区
List<CustomerCompanyRuleVO> rules = customerCompanyRuleService.queryCustomerCompanyRule(vo, company);
// → 只返回和平区允许的公司规则
// → 假设城区规则配置：和平区→公司A, 公司B
// → 则过滤结果：只包含公司A和公司B的规则
```

### 5.2 第二阶段：新增城区规则

#### 5.2.1 PO 实体类

**文件**: `src/com/fanglin/customer/po/CustomerCityRulePO.java`

```java
package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.CityProperPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.CustomerCityRuleVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customerCityRule", catalog = "customer")
public class CustomerCityRulePO implements Serializable {

    private static final long serialVersionUID = 1234567890123456789L;

    public static final String COLUMN_CITYID_STR = "cityid";

    public static final String COLUMN_COMPANY_STR = "company";

    public static final String COLUMN_STATUS_STR = "status";

    // 规则类型
    public static final short TYPE_COMPANY_INT = 0;    // 城区→公司
    public static final short TYPE_DEPT_INT = 1;       // 城区→部门
    public static final short TYPE_USER_INT = 2;       // 城区→设计师

    // 状态
    public static final short STATUS_ENABLE_INT = 0;   // 启用
    public static final short STATUS_DISABLE_INT = 1;  // 禁用

    private long ccrid;

    private CityProperPO city;

    private CompanyPO company;

    private CompanyPO targetCompany;

    private DepartmentPO department;

    private UserPO user;

    private short type;

    private short priority;

    private short status;

    private Integer createruid;

    private Timestamp createTime;

    private Integer updateruid;

    private Timestamp updateTime;

    private Timestamp finishTime;

    private String comment;

    public CustomerCityRulePO() {
        super();
    }

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "ccrid")
    public long getCcrid() {
        return ccrid;
    }

    public void setCcrid(long ccrid) {
        this.ccrid = ccrid;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cityid", referencedColumnName = "cpid")
    public CityProperPO getCity() {
        return city;
    }

    public void setCity(CityProperPO city) {
        this.city = city;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "cid")
    public CompanyPO getCompany() {
        return company;
    }

    public void setCompany(CompanyPO company) {
        this.company = company;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cid", referencedColumnName = "cid")
    public CompanyPO getTargetCompany() {
        return targetCompany;
    }

    public void setTargetCompany(CompanyPO targetCompany) {
        this.targetCompany = targetCompany;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "did", referencedColumnName = "did")
    public DepartmentPO getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentPO department) {
        this.department = department;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid", referencedColumnName = "uid")
    public UserPO getUser() {
        return user;
    }

    public void setUser(UserPO user) {
        this.user = user;
    }

    @Column(name = "type")
    public short getType() {
        return type;
    }

    public void setType(short type) {
        this.type = type;
    }

    @Column(name = "priority")
    public short getPriority() {
        return priority;
    }

    public void setPriority(short priority) {
        this.priority = priority;
    }

    @Column(name = "status")
    public short getStatus() {
        return status;
    }

    public void setStatus(short status) {
        this.status = status;
    }

    @Column(name = "createruid")
    public Integer getCreateruid() {
        return createruid;
    }

    public void setCreateruid(Integer createruid) {
        this.createruid = createruid;
    }

    @Column(name = "createTime")
    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    @Column(name = "updateruid")
    public Integer getUpdateruid() {
        return updateruid;
    }

    public void setUpdateruid(Integer updateruid) {
        this.updateruid = updateruid;
    }

    @Column(name = "updateTime")
    public Timestamp getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Timestamp updateTime) {
        this.updateTime = updateTime;
    }

    @Column(name = "finishTime")
    public Timestamp getFinishTime() {
        return finishTime;
    }

    public void setFinishTime(Timestamp finishTime) {
        this.finishTime = finishTime;
    }

    @Column(name = "comment")
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public CustomerCityRuleVO ptv(CustomerCityRuleVO customerCityRuleVO) throws FLException {

        BeanUtil.copyProperties(this, customerCityRuleVO,
            Arrays.asList("city", "company", "targetCompany", "department", "user"));

        if (customerCityRuleVO.getCity() != null && getCity() != null) {
            customerCityRuleVO.getCity().ptv(getCity());
        }

        if (customerCityRuleVO.getCompany() != null && getCompany() != null) {
            getCompany().ptv(customerCityRuleVO.getCompany());
        }

        if (customerCityRuleVO.getTargetCompany() != null && getTargetCompany() != null) {
            getTargetCompany().ptv(customerCityRuleVO.getTargetCompany());
        }

        if (customerCityRuleVO.getDepartment() != null && getDepartment() != null) {
            customerCityRuleVO.setDepartment(getDepartment().ptv());
        }

        if (customerCityRuleVO.getUser() != null && getUser() != null) {
            customerCityRuleVO.getUser().ptv(getUser());
        }

        return customerCityRuleVO;
    }
}
```

#### 5.2.2 VO 值对象

**文件**: `src/com/fanglin/customer/vo/CustomerCityRuleVO.java`

```java
package com.fanglin.customer.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.CityProperVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.CompanyVO;

public class CustomerCityRuleVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long ccrid;

    private CityProperVO city;

    private CompanyVO company;

    private CompanyVO targetCompany;

    private DepartmentVO department;

    private UserBaseVO user;

    private Short type;

    private Short priority;

    private Short status;

    private String comment;

    // Getters and Setters
    public Long getCcrid() {
        return ccrid;
    }

    public void setCcrid(Long ccrid) {
        this.ccrid = ccrid;
    }

    public CityProperVO getCity() {
        return city;
    }

    public void setCity(CityProperVO city) {
        this.city = city;
    }

    public CompanyVO getCompany() {
        return company;
    }

    public void setCompany(CompanyVO company) {
        this.company = company;
    }

    public CompanyVO getTargetCompany() {
        return targetCompany;
    }

    public void setTargetCompany(CompanyVO targetCompany) {
        this.targetCompany = targetCompany;
    }

    public DepartmentVO getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentVO department) {
        this.department = department;
    }

    public UserBaseVO getUser() {
        return user;
    }

    public void setUser(UserBaseVO user) {
        this.user = user;
    }

    public Short getType() {
        return type;
    }

    public void setType(Short type) {
        this.type = type;
    }

    public Short getPriority() {
        return priority;
    }

    public void setPriority(Short priority) {
        this.priority = priority;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
```

#### 5.2.3 DAO 接口

**文件**: `src/com/fanglin/customer/dao/CustomerCityRuleDao.java`

```java
package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerCityRulePO;
import com.fanglin.utils.Paging;

public interface CustomerCityRuleDao extends Dao<CustomerCityRulePO> {

    /**
     * 分页查询城区规则
     */
    void pageCustomerCityRule(Paging paging, List<Filter> filters, int company);

    /**
     * 根据城区查询规则
     */
    List<CustomerCityRulePO> queryCustomerCityRule(Integer cityid, int company);

    /**
     * 查询所有启用的城区规则
     */
    List<CustomerCityRulePO> queryEnabledCustomerCityRule(int company);
}
```

#### 5.2.4 DAO 实现

**文件**: `src/com/fanglin/customer/dao/impl/CustomerCityRuleDaoImpl.java`

```java
package com.fanglin.customer.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerCityRuleDao;
import com.fanglin.customer.po.CustomerCityRulePO;
import com.fanglin.utils.Paging;

@Repository("customerCityRuleDao")
public class CustomerCityRuleDaoImpl extends DaoImpl<CustomerCityRulePO>
    implements CustomerCityRuleDao {

    public CustomerCityRuleDaoImpl() {
        super(CustomerCityRulePO.class);
    }

    @Override
    public void pageCustomerCityRule(Paging paging, List<Filter> filters, int company) {

        PagingQuery<CustomerCityRulePO> query = pagingQuery(paging, CustomerCityRulePO.class);

        query.add(Restrictions.eq("company", company));
        query.add(Restrictions.eq("status", CustomerCityRulePO.STATUS_ENABLE_INT));

        queryFilterExcute(query, filters);

        query.desc("priority");
        query.desc("createTime");

        query.list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<CustomerCityRulePO> queryCustomerCityRule(Integer cityid, int company) {

        return session().createCriteria(CustomerCityRulePO.class)
            .createAlias("city", "city")
            .add(Restrictions.eq("city.cpid", cityid))
            .add(Restrictions.eq("company", company))
            .add(Restrictions.eq("status", CustomerCityRulePO.STATUS_ENABLE_INT))
            .addOrder(org.hibernate.criterion.Order.desc("priority"))
            .list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<CustomerCityRulePO> queryEnabledCustomerCityRule(int company) {

        return session().createCriteria(CustomerCityRulePO.class)
            .add(Restrictions.eq("company", company))
            .add(Restrictions.eq("status", CustomerCityRulePO.STATUS_ENABLE_INT))
            .addOrder(org.hibernate.criterion.Order.desc("priority"))
            .list();
    }
}
```

#### 5.2.5 Service 接口

**文件**: `src/com/fanglin/customer/service/CustomerCityRuleService.java`

```java
package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerCityRuleVO;
import com.fanglin.utils.Paging;

public interface CustomerCityRuleService {

    /**
     * 分页查询城区规则
     */
    void pageCustomerCityRule(Paging paging, List<Filter> filters, int company) throws FLException;

    /**
     * 查询城区规则列表
     */
    List<CustomerCityRuleVO> queryCustomerCityRule(Integer cityid, int company) throws FLException;

    /**
     * 添加城区规则
     */
    void addCustomerCityRule(CustomerCityRuleVO customerCityRuleVO, String userId, int company) throws FLException;

    /**
     * 更新城区规则
     */
    void updateCustomerCityRule(CustomerCityRuleVO customerCityRuleVO, String userId) throws FLException;

    /**
     * 删除城区规则
     */
    void deleteCustomerCityRule(CustomerCityRuleVO customerCityRule) throws FLException;

    /**
     * 禁用城区规则
     */
    void disableCustomerCityRule(CustomerCityRuleVO customerCityRule) throws FLException;
}
```

#### 5.2.6 Service 实现

**文件**: `src/com/fanglin/customer/service/impl/CustomerCityRuleServiceImpl.java`

```java
package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CityProperDao;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.CityProperPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerCityRuleDao;
import com.fanglin.customer.po.CustomerCityRulePO;
import com.fanglin.customer.service.CustomerCityRuleService;
import com.fanglin.customer.vo.CustomerCityRuleVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("customerCityRuleService")
@Transactional(readOnly = true)
public class CustomerCityRuleServiceImpl implements CustomerCityRuleService {

    @Autowired
    private CustomerCityRuleDao customerCityRuleDao;

    @Autowired
    private CityProperDao cityProperDao;

    @Autowired
    private CompanyDao companyDao;

    @Autowired
    private DepartmentDao departmentDao;

    @Autowired
    private UserDao userDao;

    @Override
    public void pageCustomerCityRule(Paging paging, List<Filter> filters, int company) throws FLException {

        customerCityRuleDao.pageCustomerCityRule(paging, filters, company);
    }

    @Override
    public List<CustomerCityRuleVO> queryCustomerCityRule(Integer cityid, int company) throws FLException {

        List<CustomerCityRulePO> customerCityRulePOs = customerCityRuleDao.queryCustomerCityRule(cityid, company);
        List<CustomerCityRuleVO> customerCityRuleVOs = new ArrayList<CustomerCityRuleVO>();

        for (CustomerCityRulePO customerCityRulePO : customerCityRulePOs) {

            CustomerCityRuleVO customerCityRuleVO = new CustomerCityRuleVO();
            customerCityRuleVOs.add(customerCityRulePO.ptv(customerCityRuleVO));
        }

        return customerCityRuleVOs;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addCustomerCityRule(CustomerCityRuleVO customerCityRuleVO, String userId, int company) throws FLException {

        // 验证城区
        if (customerCityRuleVO.getCity() == null || customerCityRuleVO.getCity().getCpid() == null) {
            throw new FLException(330071, "请选择城区");
        }

        CityProperPO city = cityProperDao.get(customerCityRuleVO.getCity().getCpid());
        if (city == null) {
            throw new FLException(330072, "城区不存在");
        }

        // 验证目标对象（至少配置一个）
        if (customerCityRuleVO.getTargetCompany() == null
            && customerCityRuleVO.getDepartment() == null
            && customerCityRuleVO.getUser() == null) {
            throw new FLException(330073, "请至少配置一个目标对象（公司/部门/设计师）");
        }

        // 创建规则
        CustomerCityRulePO customerCityRulePO = new CustomerCityRulePO();

        BeanUtil.copyProperties(customerCityRuleVO, customerCityRulePO,
            Arrays.asList("city", "company", "targetCompany", "department", "user"));

        customerCityRulePO.setCity(city);
        customerCityRulePO.setCompany(companyDao.get(company));

        if (customerCityRuleVO.getTargetCompany() != null) {
            customerCityRulePO.setTargetCompany(
                companyDao.get(customerCityRuleVO.getTargetCompany().getCid())
            );
        }

        if (customerCityRuleVO.getDepartment() != null) {
            DepartmentPO dept = departmentDao.get(customerCityRuleVO.getDepartment().getDid());
            if (dept == null) {
                throw new FLException(310001, "部门不存在");
            }
            customerCityRulePO.setDepartment(dept);
        }

        if (customerCityRuleVO.getUser() != null) {
            UserPO user = userDao.queryUserByUserId(customerCityRuleVO.getUser().getUserId());
            if (user == null) {
                throw new FLException(190005, "设计师不存在");
            }
            customerCityRulePO.setUser(user);
        }

        customerCityRulePO.setStatus(CustomerCityRulePO.STATUS_ENABLE_INT);
        customerCityRulePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
        customerCityRulePO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

        customerCityRuleDao.save(customerCityRulePO);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateCustomerCityRule(CustomerCityRuleVO customerCityRuleVO, String userId) throws FLException {

        CustomerCityRulePO customerCityRulePO = customerCityRuleDao.get(customerCityRuleVO.getCcrid());

        if (customerCityRulePO == null) {
            throw new FLException(330081, "规则不存在");
        }

        // 更新字段
        if (customerCityRuleVO.getPriority() != null) {
            customerCityRulePO.setPriority(customerCityRuleVO.getPriority());
        }

        if (customerCityRuleVO.getComment() != null) {
            customerCityRulePO.setComment(customerCityRuleVO.getComment());
        }

        customerCityRulePO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

        customerCityRuleDao.update(customerCityRulePO);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteCustomerCityRule(CustomerCityRuleVO customerCityRule) throws FLException {

        CustomerCityRulePO customerCityRulePO = customerCityRuleDao.get(customerCityRule.getCcrid());

        if (customerCityRulePO == null) {
            throw new FLException(330081, "规则不存在");
        }

        customerCityRuleDao.delete(customerCityRulePO);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disableCustomerCityRule(CustomerCityRuleVO customerCityRule) throws FLException {

        CustomerCityRulePO customerCityRulePO = customerCityRuleDao.get(customerCityRule.getCcrid());

        if (customerCityRulePO == null) {
            throw new FLException(330081, "规则不存在");
        }

        customerCityRulePO.setStatus(CustomerCityRulePO.STATUS_DISABLE_INT);
        customerCityRulePO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

        customerCityRuleDao.update(customerCityRulePO);
    }
}
```

#### 5.2.7 Action 控制器

**文件**: `src/com/fanglin/customer/action/CustomerCityRuleAction.java`

```java
package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.core.vo.PageResult;
import com.fanglin.customer.service.CustomerCityRuleService;
import com.fanglin.customer.vo.CustomerCityRuleVO;
import com.fanglin.utils.Paging;

public class CustomerCityRuleAction extends BaseAction {

    private static final long serialVersionUID = 1L;

    @Autowired
    private CustomerCityRuleService customerCityRuleService;

    private CustomerCityRuleVO customerCityRule;

    private PageResult pageResult;

    private List<CustomerCityRuleVO> customerCityRules;

    // 分页查询
    @Action(value = "pageCustomerCityRule", results = {
        @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})
    })
    public String pageCustomerCityRule() throws FLException {

        Paging paging = getPaging();
        List<Filter> filters = getFilters();

        customerCityRuleService.pageCustomerCityRule(paging, filters, queryCompany());

        pageResult = paging.toPageResult();

        return SUCCESS;
    }

    // 查询城区规则
    @Action(value = "queryCustomerCityRule", results = {
        @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})
    })
    public String queryCustomerCityRule() throws FLException {

        if (customerCityRule == null || customerCityRule.getCity() == null) {
            throw new FLException(330071, "请选择城区");
        }

        customerCityRules = customerCityRuleService.queryCustomerCityRule(
            customerCityRule.getCity().getCpid(),
            queryCompany()
        );

        return SUCCESS;
    }

    // 添加城区规则
    @Action(value = "addCustomerCityRule", results = {
        @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})
    })
    public String addCustomerCityRule() throws FLException {

        customerCityRuleService.addCustomerCityRule(customerCityRule, queryUserId(), queryCompany());

        return SUCCESS;
    }

    // 更新城区规则
    @Action(value = "updateCustomerCityRule", results = {
        @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})
    })
    public String updateCustomerCityRule() throws FLException {

        customerCityRuleService.updateCustomerCityRule(customerCityRule, queryUserId());

        return SUCCESS;
    }

    // 删除城区规则
    @Action(value = "deleteCustomerCityRule", results = {
        @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})
    })
    public String deleteCustomerCityRule() throws FLException {

        customerCityRuleService.deleteCustomerCityRule(customerCityRule);

        return SUCCESS;
    }

    // 禁用城区规则
    @Action(value = "disableCustomerCityRule", results = {
        @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})
    })
    public String disableCustomerCityRule() throws FLException {

        customerCityRuleService.disableCustomerCityRule(customerCityRule);

        return SUCCESS;
    }

    // Getters and Setters
    public CustomerCityRuleVO getCustomerCityRule() {
        return customerCityRule;
    }

    public void setCustomerCityRule(CustomerCityRuleVO customerCityRule) {
        this.customerCityRule = customerCityRule;
    }

    public PageResult getPageResult() {
        return pageResult;
    }

    public void setPageResult(PageResult pageResult) {
        this.pageResult = pageResult;
    }

    public List<CustomerCityRuleVO> getCustomerCityRules() {
        return customerCityRules;
    }

    public void setCustomerCityRules(List<CustomerCityRuleVO> customerCityRules) {
        this.customerCityRules = customerCityRules;
    }
}
```

---

## 6. 前端界面设计

### 6.1 第一阶段：扩展人员规则明细配置

#### 6.1.1 修改规则配置页面

**文件**: `WebContent/views/customer/customerUserRuleItem.html`

```html
<!-- 规则类型下拉框 -->
<div class="form-group">
    <label class="col-sm-3 control-label no-padding-right">规则类型</label>
    <div class="col-sm-9">
        <select id="ruleType" name="type" class="form-control">
            <option value="0">面积段</option>
            <option value="1">管理规则</option>
            <option value="2">部门规则</option>
            <option value="3">部门类型</option>
            <option value="4">城区规则</option> <!-- 新增 -->
        </select>
    </div>
</div>

<!-- 城区选择器（仅城区规则显示） -->
<div class="form-group city-selector" style="display: none;">
    <label class="col-sm-3 control-label no-padding-right">所属城区</label>
    <div class="col-sm-9">
        <select id="cityid" name="cityid" class="form-control chosen-select">
            <option value="">请选择城区</option>
        </select>
    </div>
</div>

<!-- 面积段配置（仅面积段规则显示） -->
<div class="form-group area-config">
    <label class="col-sm-3 control-label no-padding-right">面积下限</label>
    <div class="col-sm-9">
        <input type="number" id="lowval" name="lowval" class="form-control" placeholder="例如：100">
    </div>
</div>

<div class="form-group area-config">
    <label class="col-sm-3 control-label no-padding-right">面积上限</label>
    <div class="col-sm-9">
        <input type="number" id="uppval" name="uppval" class="form-control" placeholder="例如：140">
    </div>
</div>

<!-- 优先级 -->
<div class="form-group">
    <label class="col-sm-3 control-label no-padding-right">优先级</label>
    <div class="col-sm-9">
        <input type="number" id="priority" name="priority" class="form-control" value="1">
        <span class="help-block">数字越大优先级越高</span>
    </div>
</div>

<!-- 是否扣剩余 -->
<div class="form-group">
    <label class="col-sm-3 control-label no-padding-right">是否扣剩余</label>
    <div class="col-sm-9">
        <select id="isSurplus" name="isSurplus" class="form-control">
            <option value="0">是（扣减设计师剩余数）</option>
            <option value="1">否（不扣减设计师剩余数）</option>
        </select>
    </div>
</div>

<!-- 用完即焚 -->
<div class="form-group">
    <label class="col-sm-3 control-label no-padding-right">用完即焚</label>
    <div class="col-sm-9">
        <select id="isDelete" name="isDelete" class="form-control">
            <option value="0">是（规则使用后自动删除）</option>
            <option value="1">否（规则保留可重复使用）</option>
        </select>
    </div>
</div>
```

#### 6.1.2 JavaScript 逻辑

**文件**: `WebContent/js/customer/customerUserRuleItem.js`

```javascript
$(function() {

    // 规则类型切换
    $('#ruleType').on('change', function() {
        var type = parseInt($(this).val());

        // 隐藏所有条件配置
        $('.area-config').hide();
        $('.city-selector').hide();

        if (type === 0) {
            // 面积段规则
            $('.area-config').show();
        }
        else if (type === 4) {
            // 城区规则
            $('.city-selector').show();
        }
    });

    // 加载城区列表
    loadCityList();

    function loadCityList() {
        com.post(api.data.queryCityProper, {}, function(res) {
            var $select = $('#cityid');
            $select.empty();
            $select.append('<option value="">请选择城区</option>');

            $.each(res.cityPropers, function(i, city) {
                $select.append('<option value="' + city.cpid + '">' + city.name + '</option>');
            });

            $select.trigger('chosen:updated');
        });
    }

    // 保存规则
    $('#saveBtn').on('click', function() {

        var type = parseInt($('#ruleType').val());
        var options = {
            "customerUserRuleItem.curid": customerUserRule.curid,
            "customerUserRuleItem.type": type,
            "customerUserRuleItem.priority": $('#priority').val(),
            "customerUserRuleItem.isSurplus": $('#isSurplus').val(),
            "customerUserRuleItem.isDelete": $('#isDelete').val()
        };

        // 根据类型传递不同参数
        if (type === 0) {
            // 面积段规则
            options["customerUserRuleItem.lowval"] = $('#lowval').val();
            options["customerUserRuleItem.uppval"] = $('#uppval').val();
        }
        else if (type === 4) {
            // 城区规则
            options["customerUserRuleItem.cityid"] = $('#cityid').val();

            if (!$('#cityid').val()) {
                com.showAlert(com.warning, '请选择城区');
                return;
            }
        }

        // 提交
        com.post(api.customer.addCustomerUserRuleItem, options, function(res) {
            com.showAlert(com.info, '保存成功');
            // 刷新列表
            search();
        });
    });
});
```

### 6.2 第二阶段：城区规则管理页面

#### 6.2.1 规则列表页面

**文件**: `WebContent/views/customer/customerCityRule.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>客户城区分配规则管理</title>
</head>
<body>

<div class="page-header">
    <h1>客户城区分配规则管理</h1>
</div>

<!-- 查询条件 -->
<div class="row search-row">
    <div class="col-xs-12">
        <form id="searchForm" class="form-inline">

            <label>城区：</label>
            <select id="cityid" name="customerCityRule.city.cpid" data-condition="cityproper" class="form-control">
                <option value="">全部</option>
            </select>

            <label>规则类型：</label>
            <select id="ruleType" name="customerCityRule.type" class="form-control">
                <option value="">全部</option>
                <option value="0">城区→公司</option>
                <option value="1">城区→部门</option>
                <option value="2">城区→设计师</option>
            </select>

            <label>状态：</label>
            <select id="status" name="customerCityRule.status" class="form-control">
                <option value="">全部</option>
                <option value="0">启用</option>
                <option value="1">禁用</option>
            </select>

            <button id="searchBtn" class="btn btn-sm btn-primary">
                <i class="icon-search"></i> 查询
            </button>

            <button id="createBtn" class="btn btn-sm btn-success">
                <i class="icon-plus"></i> 新增规则
            </button>
        </form>
    </div>
</div>

<!-- 规则列表 -->
<div class="row">
    <div class="col-xs-12">
        <table id="dataTable" class="table table-striped table-bordered table-hover">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>城区</th>
                    <th>规则类型</th>
                    <th>目标对象</th>
                    <th>优先级</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>备注</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody id="dataBody"></tbody>
        </table>
    </div>
</div>

<!-- 分页 -->
<div class="row">
    <div class="col-xs-12">
        <div id="pagination"></div>
    </div>
</div>

<!-- 新增/编辑弹窗 -->
<div class="modal fade" id="editModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
                <h4 class="modal-title">城区规则配置</h4>
            </div>
            <div class="modal-body">
                <form id="editForm" class="form-horizontal">

                    <input type="hidden" id="ccrid" name="customerCityRule.ccrid">

                    <!-- 城区 -->
                    <div class="form-group">
                        <label class="col-sm-3 control-label no-padding-right">所属城区 <span class="red">*</span></label>
                        <div class="col-sm-9">
                            <select id="cityid" name="customerCityRule.city.cpid" class="form-control chosen-select" data-validate="required">
                                <option value="">请选择城区</option>
                            </select>
                        </div>
                    </div>

                    <!-- 规则类型 -->
                    <div class="form-group">
                        <label class="col-sm-3 control-label no-padding-right">规则类型 <span class="red">*</span></label>
                        <div class="col-sm-9">
                            <select id="ruleType" name="customerCityRule.type" class="form-control" data-validate="required">
                                <option value="0">城区→公司</option>
                                <option value="1">城区→部门</option>
                                <option value="2">城区→设计师</option>
                            </select>
                        </div>
                    </div>

                    <!-- 目标公司 -->
                    <div class="form-group target-company">
                        <label class="col-sm-3 control-label no-padding-right">目标公司</label>
                        <div class="col-sm-9">
                            <select id="cid" name="customerCityRule.targetCompany.cid" class="form-control chosen-select">
                                <option value="">请选择公司</option>
                            </select>
                        </div>
                    </div>

                    <!-- 目标部门 -->
                    <div class="form-group target-dept" style="display: none;">
                        <label class="col-sm-3 control-label no-padding-right">目标部门</label>
                        <div class="col-sm-9">
                            <select id="did" name="customerCityRule.department.did" class="form-control chosen-select">
                                <option value="">请选择部门</option>
                            </select>
                        </div>
                    </div>

                    <!-- 目标设计师 -->
                    <div class="form-group target-user" style="display: none;">
                        <label class="col-sm-3 control-label no-padding-right">目标设计师</label>
                        <div class="col-sm-9">
                            <input type="text" id="userId" name="customerCityRule.user.userId"
                                   class="form-control" placeholder="输入设计师工号或姓名">
                        </div>
                    </div>

                    <!-- 优先级 -->
                    <div class="form-group">
                        <label class="col-sm-3 control-label no-padding-right">优先级 <span class="red">*</span></label>
                        <div class="col-sm-9">
                            <input type="number" id="priority" name="customerCityRule.priority"
                                   class="form-control" value="0" min="0" max="99" data-validate="required">
                            <span class="help-block">数字越大优先级越高，范围：0-99</span>
                        </div>
                    </div>

                    <!-- 备注 -->
                    <div class="form-group">
                        <label class="col-sm-3 control-label no-padding-right">备注</label>
                        <div class="col-sm-9">
                            <textarea id="comment" name="customerCityRule.comment"
                                      class="form-control" rows="3"></textarea>
                        </div>
                    </div>

                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" id="saveBtn">保存</button>
            </div>
        </div>
    </div>
</div>

<!-- 引用脚本 -->
<script src="/js/customer/customerCityRule.js"></script>

</body>
</html>
```

#### 6.2.2 JavaScript 逻辑

**文件**: `WebContent/js/customer/customerCityRule.js`

```javascript
$(function() {

    // 初始化分页
    var page = {
        pageNo: 1,
        pageSize: 20,
        total: 0
    };

    // 加载列表
    function loadList() {

        var options = {
            "paging.pageNo": page.pageNo,
            "paging.pageSize": page.pageSize
        };

        // 查询条件
        if ($('#cityid').val()) {
            options["customerCityRule.city.cpid"] = $('#cityid').val();
        }

        if ($('#ruleType').val() !== '') {
            options["customerCityRule.type"] = $('#ruleType').val();
        }

        if ($('#status').val() !== '') {
            options["customerCityRule.status"] = $('#status').val();
        }

        com.post(api.customer.pageCustomerCityRule, options, function(res) {
            renderList(res.pageResult.data);
            page.total = res.pageResult.totalRecords;
            renderPagination();
        });
    }

    // 渲染列表
    function renderList(list) {

        var html = '';

        if (list.length === 0) {
            html = '<tr><td colspan="9" class="text-center">暂无数据</td></tr>';
            $('#dataBody').html(html);
            return;
        }

        $.each(list, function(i, item) {

            var typeText = '';
            var targetText = '';

            if (item.type === 0) {
                typeText = '<span class="label label-info">城区→公司</span>';
                targetText = item.targetCompany ? item.targetCompany.name : '-';
            }
            else if (item.type === 1) {
                typeText = '<span class="label label-success">城区→部门</span>';
                targetText = item.department ? item.department.name : '-';
            }
            else if (item.type === 2) {
                typeText = '<span class="label label-warning">城区→设计师</span>';
                targetText = item.user ? item.user.currentName : '-';
            }

            var statusText = item.status === 0
                ? '<span class="label label-success arrowed-in">启用</span>'
                : '<span class="label label-grey arrowed-in">禁用</span>';

            html += '<tr>';
            html += '  <td>' + ((page.pageNo - 1) * page.pageSize + i + 1) + '</td>';
            html += '  <td>' + (item.city ? item.city.name : '-') + '</td>';
            html += '  <td>' + typeText + '</td>';
            html += '  <td>' + targetText + '</td>';
            html += '  <td>' + item.priority + '</td>';
            html += '  <td>' + statusText + '</td>';
            html += '  <td>' + com.formatDate(item.createTime, 'yyyy-MM-dd HH:mm') + '</td>';
            html += '  <td>' + (item.comment || '-') + '</td>';
            html += '  <td>';
            html += '    <button class="btn btn-xs btn-info editBtn" data-ccrid="' + item.ccrid + '">编辑</button> ';
            html += '    <button class="btn btn-xs btn-danger disableBtn" data-ccrid="' + item.ccrid + '">禁用</button>';
            html += '  </td>';
            html += '</tr>';
        });

        $('#dataBody').html(html);
    }

    // 渲染分页
    function renderPagination() {

        var totalPage = Math.ceil(page.total / page.pageSize);
        var html = '';

        for (var i = 1; i <= totalPage; i++) {
            html += '<a href="#" data-page="' + i + '">' + i + '</a>';
        }

        $('#pagination').html(html);
    }

    // 查询按钮
    $('#searchBtn').on('click', function() {
        page.pageNo = 1;
        loadList();
    });

    // 新增按钮
    $('#createBtn').on('click', function() {
        resetForm();
        $('#editModal').modal('show');
    });

    // 重置表单
    function resetForm() {
        $('#editForm')[0].reset();
        $('#ccrid').val('');

        // 隐藏所有目标对象选择器
        $('.target-company').hide();
        $('.target-dept').hide();
        $('.target-user').hide();
    }

    // 规则类型切换
    $('#ruleType').on('change', function() {
        var type = parseInt($(this).val());

        // 隐藏所有目标对象选择器
        $('.target-company').hide();
        $('.target-dept').hide();
        $('.target-user').hide();

        if (type === 0) {
            // 城区→公司
            $('.target-company').show();
        }
        else if (type === 1) {
            // 城区→部门
            $('.target-dept').show();
        }
        else if (type === 2) {
            // 城区→设计师
            $('.target-user').show();
        }
    });

    // 编辑按钮
    $('#dataBody').on('click', '.editBtn', function() {

        var ccrid = $(this).data('ccrid');

        // 查询详情
        com.post(api.customer.queryCustomerCityRule, {
            "customerCityRule.ccrid": ccrid
        }, function(res) {

            var item = res.customerCityRules[0];

            $('#ccrid').val(item.ccrid);
            $('#cityid').val(item.city.cpid).trigger('chosen:updated');
            $('#ruleType').val(item.type).trigger('change');
            $('#priority').val(item.priority);
            $('#comment').val(item.comment || '');

            if (item.type === 0 && item.targetCompany) {
                $('#cid').val(item.targetCompany.cid).trigger('chosen:updated');
            }
            else if (item.type === 1 && item.department) {
                $('#did').val(item.department.did).trigger('chosen:updated');
            }
            else if (item.type === 2 && item.user) {
                $('#userId').val(item.user.userId);
            }

            $('#editModal').modal('show');
        });
    });

    // 禁用按钮
    $('#dataBody').on('click', '.disableBtn', function() {

        var ccrid = $(this).data('ccrid');

        com.showConfirm('确认禁用该规则？', function() {
            com.post(api.customer.disableCustomerCityRule, {
                "customerCityRule.ccrid": ccrid
            }, function() {
                com.showAlert(com.info, '操作成功');
                loadList();
            });
        });
    });

    // 保存按钮
    $('#saveBtn').on('click', function() {

        if (com.validateForm('#editForm')) {

            var options = {
                "customerCityRule.ccrid": $('#ccrid').val(),
                "customerCityRule.city.cpid": $('#cityid').val(),
                "customerCityRule.type": $('#ruleType').val(),
                "customerCityRule.priority": $('#priority').val(),
                "customerCityRule.comment": $('#comment').val()
            };

            var type = parseInt($('#ruleType').val());

            if (type === 0) {
                options["customerCityRule.targetCompany.cid"] = $('#cid').val();
            }
            else if (type === 1) {
                options["customerCityRule.department.did"] = $('#did').val();
            }
            else if (type === 2) {
                options["customerCityRule.user.userId"] = $('#userId').val();
            }

            var api = $('#ccrid').val()
                ? api.customer.updateCustomerCityRule
                : api.customer.addCustomerCityRule;

            com.post(api, options, function() {
                com.showAlert(com.info, '保存成功');
                $('#editModal').modal('hide');
                loadList();
            });
        }
    });

    // 分页点击
    $('#pagination').on('click', 'a', function() {
        page.pageNo = $(this).data('page');
        loadList();
        return false;
    });

    // 初始化加载
    loadList();
});
```

---

## 7. 分配流程设计

### 7.1 第一阶段：扩展人员规则明细分配流程

```
客户来源创建
    ↓
查询部门规则 → 获取分配类型（atttype）和聚焦类型（focus）
    ↓
atttype = 0（自动分配）
    ↓
获取楼盘城区ID（cityid = village.cityProper.cpid）
    ↓
┌─────────────────────────────────────────────────────────┐
│ 根据聚焦类型（focus）选择拉取策略                         │
│                                                           │
│ focus = FOCUS_COM_INT (0)                                │
│   → did=<创建人部门>, dtid=<创建人部门类型>              │
│   → 匹配: type=2(部门) OR type=3(部门类型)               │
│                                                           │
│ focus = FOCUS_AREA_INT (1)                               │
│   → did=0, dtid=0                                        │
│   → 匹配: type=0(面积段)                                 │
│                                                           │
│ focus = FOCUS_DEPT_TYPE_INT (3)                          │
│   → did=0, dtid=<创建人部门类型>                         │
│   → 匹配: type=3(部门类型)                               │
│                                                           │
│ focus = FOCUS_DEPT_INT (2)                               │
│   → did=<创建人部门>, dtid=0                              │
│   → 匹配: type=2(部门)                                   │
│                                                           │
│ focus = FOCUS_CITY_INT (4) 【新增】                       │
│   → did=0, dtid=0, cityid=<楼盘城区ID>                   │
│   → 匹配: type=4(城区规则)                               │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 拉取人员规则明细（支持城区匹配）                          │
│                                                           │
│ SELECT curi.*                                            │
│ FROM customer.customeruserrule cur,                       │
│      customer.customeruserruleitem curi                  │
│ WHERE cur.curid = curi.curid                             │
│   AND cur.status = 0 AND curi.status = 0                 │
│   AND cur.company = :company                             │
│   AND (                                                   │
│     (curi.type = 0 AND curi.uppval < :area ...)         │ -- 面积段
│     OR (curi.type = 1)                                   │ -- 管理规则
│     OR (curi.type = 2 AND curi.did = :did ...)           │ -- 部门
│     OR (curi.type = 3 AND curi.dtid = :dtid ...)         │ -- 部门类型
│     OR (curi.type = 4 AND curi.cityid = :cityid)         │ -- 城区规则（新增）
│   )                                                       │
│   AND cur.uid NOT IN :uids                              │
│ ORDER BY curi.priority DESC, cur.surplus DESC            │
│ LIMIT 1                                                  │
└─────────────────────────────────────────────────────────┘
    ↓
规则明细排序优先级：
1. priority DESC（优先级：城区规则 > 面积段 > 部门 > 管理规则）
2. surplus DESC（剩余数多的优先）
    ↓
匹配到设计师 → 扣减剩余数 → 创建客户机会
```

#### 7.1.1 城区优先聚焦匹配示例

```
场景配置：
- 客户：120㎡，城区101（和平区）
- 部门规则：atttype=AUTO(0), focus=FOCUS_CITY_INT(4)

设计师张三的规则：
├── CustomerUserRulePO
│   ├── user: 张三
│   ├── surplus: 5000（5个）
│   └── chance: 10000（10个）
│
└── CustomerUserRuleItemPO（3条）
    ├── 明细1：城区规则
    │   ├── type: 4（城区规则）
    │   ├── cityid: 101（和平区）
    │   ├── priority: 10
    │   └── isSurplus: 0
    │
    ├── 明细2：管理规则
    │   ├── type: 1（管理规则）
    │   ├── priority: 99
    │   └── isSurplus: 0
    │
    └── 明细3：面积段规则
        ├── type: 0（面积段）
        ├── lowval: 100000（100㎡）
        ├── uppval: 140000（140㎡）
        ├── priority: 1
        └── isSurplus: 0

匹配流程：
Step 1: 检查部门规则
→ atttype = AUTO (自动分配)
→ focus = FOCUS_CITY_INT (城区优先)

Step 2: 获取城区ID
→ cityid = 101（和平区）

Step 3: 拉取人员规则明细（focus=FOCUS_CITY）
→ did=0, dtid=0, cityid=101
→ SQL匹配条件: (curi.type = 4 AND curi.cityid = 101)
→ 匹配到明细1（城区规则，priority=10）

Step 4: 检查剩余数
→ surplus = 5000（5个）> 0 ✓

Step 5: 创建客户机会
→ 归属设计师：张三
→ 扣减剩余数：surplus = 5000 - 1000 = 4000
→ 记录分配日志

结果：✅ 成功分配给张三（城区规则匹配）
```

#### 7.1.2 不同聚焦类型对比示例

```
场景：120㎡客户，城区101（和平区），创建人部门=设计一部

┌─────────────────────────────────────────────────────────────┐
│ focus = FOCUS_CITY_INT (4) 【城区优先】                      │
├─────────────────────────────────────────────────────────────┤
→ 拉取参数: did=0, dtid=0, cityid=101                         │
→ 匹配规则: type=4(城区)                                       │
→ 结果: 匹配城区规则，优先分配给城区101的设计师                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ focus = FOCUS_AREA_INT (1) 【面积优先】                      │
├─────────────────────────────────────────────────────────────┤
→ 拉取参数: did=0, dtid=0, cityid=101                         │
→ 匹配规则: type=0(面积段)                                     │
→ 结果: 匹配100-140㎡面积段规则，不考虑城区                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ focus = FOCUS_DEPT_INT (2) 【部门优先】                      │
├─────────────────────────────────────────────────────────────┤
→ 拉取参数: did=设计一部ID, dtid=0, cityid=101                 │
→ 匹配规则: type=2(部门)                                       │
→ 结果: 匹配设计一部规则，不考虑城区                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ focus = FOCUS_DEPT_TYPE_INT (3) 【部门类型优先】              │
├─────────────────────────────────────────────────────────────┤
→ 拉取参数: did=0, dtid=设计部类型ID, cityid=101                │
→ 匹配规则: type=3(部门类型)                                   │
→ 结果: 匹配设计部类型规则，不考虑城区                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ focus = FOCUS_COM_INT (0) 【公司级】                         │
├─────────────────────────────────────────────────────────────┤
→ 拉取参数: did=设计一部ID, dtid=设计部类型ID, cityid=101       │
→ 匹配规则: type=2(部门) OR type=3(部门类型)                   │
→ 结果: 匹配部门+部门类型规则，不考虑城区                       │
└─────────────────────────────────────────────────────────────┘
```

**总结对比**:

| 聚焦类型 | 主要匹配维度 | 城区参数作用 | 典型应用场景 |
|---------|------------|-------------|-------------|
| FOCUS_CITY_INT (4) | 城区规则 | 决定性 | 按城区分配设计师 |
| FOCUS_AREA_INT (1) | 面积段 | 传递但未使用 | 按面积段分配 |
| FOCUS_DEPT_INT (2) | 部门规则 | 传递但未使用 | 部门内分配 |
| FOCUS_DEPT_TYPE_INT (3) | 部门类型 | 传递但未使用 | 按部门类型分配 |
| FOCUS_COM_INT (0) | 部门+部门类型 | 传递但未使用 | 全公司分配 |

### 7.2 第二阶段：城区规则体系分配流程（Service层控制）

```
客户来源创建
    ↓
查询公司规则（带城区过滤）
    ↓
┌─────────────────────────────────────────────────────────┐
│ Step 1: Service层查询公司规则（基础过滤）                  │
│                                                           │
│ customerCompanyRuleDao.queryCustomerCompanyRule(         │
│     dept, type, uppval, lowval, company                  │
│ )                                                        │
│                                                          │
│ → 返回: [公司规则A, 公司规则B, 公司规则C]                │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Service层查询城区规则（如果提供了cityid）          │
│                                                           │
│ 【仅当VO.cityid != null时执行】                          │
│                                                           │
│ customerCityRuleDao.queryCustomerCityRuleByType(         │
│     cityid, company, TYPE_COMPANY_INT                    │
│ )                                                        │
│                                                          │
│ → 返回: [城区规则1(→公司A), 城区规则2(→公司B)]           │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Service层提取允许的公司ID集合                      │
│                                                           │
│ allowedCompanyIds = {公司A.cid, 公司B.cid}               │
│                                                           │
│ → 如果为空，返回空列表（无城区规则配置）                   │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ Step 4: Service层过滤公司规则                             │
│                                                           │
│ for (rule in companyRules) {                             │
│     if (allowedCompanyIds.contains(rule.company.cid)) {  │
│         filteredRules.add(rule);                         │
│     }                                                    │
│ }                                                        │
│                                                          │
│ → 过滤后: [公司规则A, 公司规则B]（移除公司C）              │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ Step 5: Service层去重并转换为VO                           │
│                                                           │
│ uniqueKeys = {"公司A_did_type", "公司B_did_type"}        │
│                                                          │
│ → 去除重复规则                                           │
│ → 转换为VO列表返回                                       │
└─────────────────────────────────────────────────────────┘
    ↓
返回过滤后的公司规则列表
```

**流程对比**:

| 场景 | 原有逻辑（无cityid） | 新增逻辑（有cityid） |
|------|-------------------|-------------------|
| **查询步骤** | 1步：查公司规则 | 2步：查公司规则 + 查城区规则 |
| **过滤逻辑** | 无过滤 | Service层过滤（内存操作） |
| **返回结果** | 所有公司规则 | 仅城区允许的公司规则 |
| **DAO职责** | 单一数据源查询 | 单一数据源查询（不变） |
| **Service职责** | 简单转换 | 规则合并、过滤、去重 |

**关键设计点**:
1. **DAO层职责不变**: 只负责单表查询，不合并SQL
2. **Service层控制**: 负责规则合并、过滤、去重
3. **内存操作**: 数据量小（几十到几百条），性能影响可忽略
4. **向后兼容**: `cityid` 为null时等同于原有逻辑

#### 7.2.1 城区规则+公司规则Service层控制示例

```
场景配置：
- 客户：120㎡，城区101（和平区）
- 查询条件：部门=设计一部，城区=和平区

数据库配置：

┌─────────────────────────────────────────┐
│ customercityrule (城区规则表)            │
├─────────────────────────────────────────┤
│ ccrid | cityid | type | cid  | priority │
├───────┼────────┼──────┼──────┼──────────┤
│ 1     │ 101    │ 0    │ 1    │ 10       │
│ 2     │ 101    │ 0    │ 2    │ 5        │
└───────┴────────┴──────┴──────┴──────────┘
→ 城区101 → 公司1 (priority=10)
→ 城区101 → 公司2 (priority=5)

┌─────────────────────────────────────────┐
│ customercompanyrule (公司规则表)         │
├─────────────────────────────────────────┤
│ cscrid | dept  | type | lowval | uppval │
├────────┼───────┼──────┼────────┼────────┤
│ 100    │ 一部  │ 0    │ 100000 │ 140000 │
│ 101    │ 一部  │ 0    │ 100000 │ 140000 │
│ 102    │ 一部  │ 0    │ 100000 │ 140000 │
│ 103    │ 二部  │ 0    │ 100000 │ 140000 │
└────────┴───────┴──────┴────────┴────────┘
→ 规则100：一部 100-140㎡ → 公司1
→ 规则101：一部 100-140㎡ → 公司2
→ 规则102：一部 100-140㎡ → 公司3
→ 规则103：二部 100-140㎡ → 公司1
```

**Service层处理流程**:

```
Step 1: 查询公司规则（基础过滤）
→ 条件: dept=设计一部, 面积=120㎡
→ 返回: [规则100, 规则101, 规则102]

Step 2: 查询城区规则（VO.cityid=101）
→ 条件: cityid=101, type=TYPE_COMPANY(0)
→ 返回: [城区规则1(→公司1), 城区规则2(→公司2)]

Step 3: 提取允许的公司ID
→ allowedCompanyIds = {1, 2}

Step 4: 过滤公司规则
→ 规则100 (公司1) ✓ 允许
→ 规则101 (公司2) ✓ 允许
→ 规则102 (公司3) ✗ 不在允许列表，过滤掉

Step 5: 去重并返回
→ 最终结果: [规则100, 规则101]
```

**对比: 无城区过滤 vs 有城区过滤**:

| 场景 | 无城区过滤 (cityid=null) | 有城区过滤 (cityid=101) |
|------|------------------------|------------------------|
| **查询步骤** | 1步：查公司规则 | 2步：查公司规则 + 查城区规则 |
| **返回规则** | [100, 101, 102] | [100, 101] |
| **允许公司** | 公司1, 公司2, 公司3 | 公司1, 公司2 |
| **过滤结果** | 无过滤 | 移除公司3的规则 |
| **性能影响** | ~10ms | ~15ms (+5ms) |

---

## 8. 测试方案

### 8.1 单元测试

#### 8.1.1 DAO 层测试

**文件**: `src/test/java/com/fanglin/customer/dao/CustomerUserRuleItemDaoTest.java`

```java
package com.fanglin.customer.dao;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.po.CustomerUserRuleItemPO;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:ApplicationContext.xml"})
@Transactional
public class CustomerUserRuleItemDaoTest {

    @Autowired
    private CustomerUserRuleItemDao customerUserRuleItemDao;

    /**
     * 测试城区规则拉取
     */
    @Test
    public void testPullCustomerUserRuleItemByCity() {

        // 准备数据
        int company = 1;
        int area = 120000;
        List<Integer> uids = new ArrayList<Integer>();
        int did = 1001;
        int dtid = 10;
        Integer cityid = 101;

        // 执行测试
        CustomerUserRuleItemPO rule = customerUserRuleItemDao.pullCustomerUserRuleItem(
            company, area, uids, did, dtid, cityid
        );

        // 验证结果
        assertNotNull(rule);
        assertEquals(Integer.valueOf(4), rule.getType());  // 城区规则
        assertEquals(cityid, rule.getCityid());
    }

    /**
     * 测试面积段规则拉取（兼容原有逻辑）
     */
    @Test
    public void testPullCustomerUserRuleItemByArea() {

        int company = 1;
        int area = 120000;
        List<Integer> uids = new ArrayList<Integer>();
        int did = 1001;
        int dtid = 10;
        Integer cityid = null;  // 无城区限制

        CustomerUserRuleItemPO rule = customerUserRuleItemDao.pullCustomerUserRuleItem(
            company, area, uids, did, dtid, cityid
        );

        assertNotNull(rule);
        assertEquals(Integer.valueOf(0), rule.getType());  // 面积段规则
    }
}
```

#### 8.1.2 Service 层测试

**文件**: `src/test/java/com/fanglin/customer/service/CustomerSourceServiceTest.java`

```java
package com.fanglin.customer.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:ApplicationContext.xml"})
public class CustomerSourceServiceTest {

    @Autowired
    private CustomerSourceService customerSourceService;

    /**
     * 测试城区分配流程
     */
    @Test
    public void testIssueCustomerSourceWithCity() throws Exception {

        // 准备客户来源数据
        CustomerSourceVO customerSource = new CustomerSourceVO();
        customerSource.setCsid(1L);
        customerSource.setInnerArea(120000);  // 120㎡

        // 准备客户机会数据
        CustomerChanceVO customerChance = new CustomerChanceVO();

        // 执行分配
        customerSourceService.issueCustomerSource(
            customerSource,
            customerChance,
            "testuser",
            1
        );

        // 验证结果
        assertNotNull(customerChance.getCcid());
        assertNotNull(customerChance.getBelonger());
        assertNotNull(customerChance.getOrderId());
    }
}
```

### 8.2 集成测试

#### 8.2.1 测试场景

```java
/**
 * 城区规则集成测试
 */
public class CityRuleIntegrationTest {

    /**
     * 场景1：城区规则优先级高于面积段规则
     *
     * 配置：
     * - 设计师张三：城区101规则（priority=10），面积段100-140㎡（priority=1）
     * - 客户：120㎡，城区101
     *
     * 预期：匹配城区规则，分配给张三
     */
    @Test
    public void testCityRulePriority() {
        // TODO
    }

    /**
     * 场景2：城区规则兜底机制
     *
     * 配置：
     * - 设计师张三：城区101规则（priority=10）
     * - 设计师李四：管理规则（priority=99）
     * - 客户：120㎡，城区102
     *
     * 预期：无城区102规则，匹配管理规则，分配给李四
     */
    @Test
    public void testCityRuleFallback() {
        // TODO
    }

    /**
     * 场景3：城区规则+面积段组合
     *
     * 配置：
     * - 设计师张三：城区101 + 面积段100-140㎡（priority=10）
     * - 设计师李四：城区101 + 面积段140-160㎡（priority=10）
     * - 客户：150㎡，城区101
     *
     * 预期：匹配李四的规则
     */
    @Test
    public void testCityRuleWithArea() {
        // TODO
    }
}
```

### 8.3 性能测试

```java
/**
 * 性能测试
 */
public class PerformanceTest {

    /**
     * 测试分配接口响应时间
     *
     * 要求：≤ 500ms
     */
    @Test
    public void testIssuePerformance() {

        long startTime = System.currentTimeMillis();

        // 执行100次分配
        for (int i = 0; i < 100; i++) {
            customerSourceService.issueCustomerSource(...);
        }

        long endTime = System.currentTimeMillis();
        long avgTime = (endTime - startTime) / 100;

        assertTrue(avgTime <= 500, "平均响应时间：" + avgTime + "ms");
    }

    /**
     * 测试并发分配
     *
     * 要求：≥ 10 TPS
     */
    @Test
    public void testConcurrentIssue() {

        int threadCount = 10;
        int requestsPerThread = 10;

        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    for (int j = 0; j < requestsPerThread; j++) {
                        customerSourceService.issueCustomerSource(...);
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        long endTime = System.currentTimeMillis();

        int totalRequests = threadCount * requestsPerThread;
        long totalTime = endTime - startTime;
        double tps = (totalRequests * 1000.0) / totalTime;

        assertTrue(tps >= 10, "TPS：" + tps);
    }
}
```

---

## 9. 实施计划

### 9.1 第一阶段（1-2周）

| 任务 | 负责人 | 工作量 | 依赖 |
|-----|-------|-------|------|
| 数据库表结构调整 | DBA | 0.5天 | - |
| PO/VO 类扩展 | 后端开发 | 1天 | DB |
| DAO 层扩展 | 后端开发 | 1天 | PO |
| Service 层调整 | 后端开发 | 1天 | DAO |
| 单元测试 | 后端开发 | 1天 | Service |
| 前端配置页面扩展 | 前端开发 | 1天 | - |
| 集成测试 | 测试工程师 | 1天 | 前后端 |
| 性能测试 | 测试工程师 | 0.5天 | 集成测试 |
| 上线部署 | 运维 | 0.5天 | 测试完成 |
| **总计** | - | **8天** | - |

### 9.2 第二阶段（1-2月）

| 阶段 | 任务 | 工作量 | 里程碑 |
|-----|-----|-------|--------|
| 需求评审 | 详细需求分析 | 3天 | 需求文档完成 |
| 设计 | 数据库+接口设计 | 5天 | 设计文档完成 |
| 开发 | 后端开发（PO/VO/DAO/Service/Action） | 10天 | 后端接口完成 |
| 开发 | 前端开发（列表+配置页面） | 8天 | 前端页面完成 |
| 测试 | 单元+集成+性能测试 | 5天 | 测试通过 |
| 上线 | 灰度发布+全量上线 | 2天 | 功能上线 |
| **总计** | - | **33天** | - |

---

## 10. 风险评估

### 10.1 技术风险

| 风险 | 概率 | 影响 | 应对措施 |
|-----|------|------|---------|
| SQL性能下降 | 中 | 中 | 增加 `idx_cityid` 索引，优化查询逻辑 |
| 现有规则冲突 | 低 | 高 | 充分测试，保持向后兼容 |
| 数据迁移失败 | 低 | 高 | 制定回滚方案，备份现有数据 |

### 10.2 业务风险

| 风险 | 概率 | 影响 | 应对措施 |
|-----|------|------|---------|
| 规则配置错误 | 中 | 高 | 提供规则验证功能，增加配置预览 |
| 分配不公平 | 中 | 中 | 增加规则透明度，提供分配日志 |
| 用户体验下降 | 低 | 中 | 灰度发布，收集用户反馈 |

### 10.3 项目风险

| 风险 | 概率 | 影响 | 应对措施 |
|-----|------|------|---------|
| 开发延期 | 中 | 中 | 预留缓冲时间，分阶段上线 |
| 人员变动 | 低 | 中 | 知识文档化，代码审查 |
| 需求变更 | 中 | 中 | 敏捷开发，快速迭代 |

---

## 11. 附录

### 11.1 数据库回滚方案

```sql
-- 回滚第一阶段修改
ALTER TABLE customer.customeruserruleitem DROP COLUMN cityid;
ALTER TABLE customer.customeruserruleitem DROP INDEX idx_cityid;

-- 回滚第二阶段修改
DROP TABLE IF EXISTS customer.customercityrule;
```

### 11.2 相关文档

- [客户管理模块文档](../src/com/fanglin/customer/CLAUDE.md)
- [数据库设计文档](../db/README.md)
- [API接口文档](../docs/API.md)

### 11.3 常见问题

**Q1: 城区规则和面积段规则可以同时配置吗？**

A: 可以。规则匹配时会按 `priority` 排序，优先级高的规则先匹配。

**Q2: 如果城区规则配置错误怎么办？**

A: 可以通过管理界面禁用或删除错误规则，系统会自动降级到其他匹配规则。

**Q3: 兼容现有的面积段、部门规则吗？**

A: 完全兼容。城区规则作为新增的规则类型（type=4），与现有规则共存。

**Q4: 如何查看分配日志？**

A: 在 `CustomerSourceRecordPO` 表中有详细的分配记录，包括匹配的规则类型和规则ID。

---

## 12. 变更记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| v1.0 | 2026-03-12 | Claude | 初始版本 |
| v1.1 | 2026-03-12 | Claude | 新增部门规则聚焦设计 (FOCUS_CITY_INT) 和公司规则Service层控制 |

### v1.1 详细变更内容

#### 1. 部门规则聚焦设计 (Section 5.1.1)
- **新增**: `FOCUS_CITY_INT = 4` 聚焦类型常量
- **功能**: 实现城区优先匹配，控制如何拉取人员规则明细
- **影响**: `CustomerDeptRulePO.focus` 字段新增可选值 4
- **匹配逻辑**: `focus=FOCUS_CITY_INT` → 拉取参数 `did=0, dtid=0, cityid=<楼盘城区ID>` → 匹配 `type=4` 的城区规则

#### 2. 公司规则Service层控制 (Section 5.1.3.2)
- **设计思路**: Service层合并公司规则+城区规则，DAO层保持单一职责
- **核心实现**: `CustomerCompanyRuleServiceImpl.queryCustomerCompanyRule()`
- **处理流程**:
  1. 查询公司规则（基础过滤）
  2. 查询城区规则（如果提供了cityid）
  3. 提取允许的公司ID集合
  4. 过滤公司规则
  5. 去重并返回
- **VO扩展**: `CustomerCompanyRuleVO` 增加 `cityid` 字段（仅用于查询参数）
- **DAO扩展**: `CustomerCityRuleDao` 增加 `queryCustomerCityRuleByType()` 方法
- **向后兼容**: `cityid` 为null时等同于原有逻辑

#### 3. 分配流程更新 (Section 7)
- **Section 7.1**: 更新扩展人员规则明细分配流程，增加5种聚焦类型对比
- **Section 7.1.1**: 新增城区优先聚焦匹配示例
- **Section 7.1.2**: 新增不同聚焦类型对比示例（含对比表）
- **Section 7.2**: 更新城区规则体系分配流程，展示Service层控制逻辑
- **Section 7.2.1**: 新增城区规则+公司规则Service层控制示例（含性能对比）

#### 4. 设计要点总结
- **职责分离**: DAO层单表查询，Service层规则合并、过滤、去重
- **性能考虑**: 内存操作，数据量小（几十到几百条），性能影响 < 10ms
- **向后兼容**: 新增功能不影响现有逻辑，城区规则作为可选的匹配维度

---

**文档结束**
