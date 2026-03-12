# DecorationUser 表添加 Type 字段 - 修改总结

> 修改日期：2026-03-12
> 修改目的：为 `decorationuser` 表添加 `type` 字段，区分员工在订单中的具体作用类型

---

## 📋 修改概述

### 问题描述
原 `decorationuser` 表没有 `type` 字段来区分人员类型，导致：
- 同一订单中多个员工无法精确区分具体作用
- 只能靠 `content` 文本描述，无法结构化查询
- 与 `userpartner`、`departmentpartner` 等表的设计不一致

### 解决方案
添加 `type` 字段，采用与 `UserPartnerPO` 一致的类型常量设计，并在赋值逻辑中保留类型信息。

---

## ✅ 已完成的修改

### 1. 数据库表结构修改

**文件**：`db/migration/add_decorationuser_type.sql`

**修改内容**：
```sql
-- 添加 type 字段
ALTER TABLE decoration.decorationuser
ADD COLUMN type TINYINT(1) DEFAULT 0
COMMENT '人员类型: 0-业务, 1-装饰, 2-服务, 3-合同, 4-销售, 99-其他'
AFTER isPay;

-- 添加索引便于查询
CREATE INDEX idx_type ON decoration.decorationuser(type);
```

**类型说明**：
- `0` = 业务人员 (TYPE_BUSI_INT)
- `1` = 装饰人员 (TYPE_DECO_INT)
- `2` = 服务人员 (TYPE_SERV_INT)
- `3` = 合同人员 (TYPE_CONT_INT)
- `4` = 销售人员 (TYPE_SALES_INT)
- `99` = 其他人员 (TYPE_OTHER_INT)

---

### 2. 后端实体类修改

#### 2.1 DecorationUserPO.java

**文件路径**：`src/com/fanglin/decoration/po/DecorationUserPO.java`

**修改内容**：
```java
// 添加类型常量
public static final short TYPE_BUSI_INT = 0;   // 业务
public static final short TYPE_DECO_INT = 1;   // 装饰
public static final short TYPE_SERV_INT = 2;   // 服务
public static final short TYPE_CONT_INT = 3;   // 合同
public static final short TYPE_SALES_INT = 4;  // 销售
public static final short TYPE_OTHER_INT = 99; // 其他

// 添加字段
private Short type;

// 添加 Getter/Setter
@Column(name = "type")
public Short getType() {
    return type;
}

public void setType(Short type) {
    this.type = type;
}
```

**位置**：
- 常量定义：第27-33行
- 字段声明：第45行
- Getter/Setter：紧跟在 `isPay` 字段之后

---

#### 2.2 DecorationUserVO.java

**文件路径**：`src/com/fanglin/decoration/vo/DecorationUserVO.java`

**修改内容**：
```java
// 添加字段
private Short type;

// 添加 Getter/Setter
public Short getType() {
    return type;
}

public void setType(Short type) {
    this.type = type;
}
```

**位置**：第21行（字段声明）

---

### 3. 业务逻辑修改

#### 3.1 ConstructionServiceImpl.java

**文件路径**：`src/com/fanglin/construction/service/impl/ConstructionServiceImpl.java`

**修改位置 1**（第233行）：
```java
// 从部门销售合作伙伴创建 DecorationUserPO
DepartmentPartnerPO partnerSO = departmentPartnerDao.queryDepartmentPartner(
    decorationPO.getDesigner().getDept().getDid(),
    DepartmentPartnerPO.TYPE_SALES_INT
);

if (partnerSO != null) {
    DecorationUserPO decorationUserPO = new DecorationUserPO();
    decorationUserPO.setOrderId(decorationPO.getOrderId());
    decorationUserPO.setUser(partnerSO.getPartner());
    decorationUserPO.setType(DecorationUserPO.TYPE_SALES_INT);  // ✅ 新增
    decorationUserDao.save(decorationUserPO);
}
```

**修改位置 2**（第245行）：
```java
// 从城市服务合作伙伴创建 DecorationUserPO
CityProperPartnerPO partnerCPO = cityProperPartnerDao.queryCityProperPartner(
    decorationPO.getHouse().getVillage().getCityProper().getCpid(),
    CityProperPartnerPO.TYPE_SERV_INT
);

if (partnerCPO != null) {
    DecorationUserPO decorationUserPO = new DecorationUserPO();
    decorationUserPO.setOrderId(decorationPO.getOrderId());
    decorationUserPO.setType(DecorationUserPO.TYPE_SERV_INT);  // ✅ 新增
    decorationUserPO.setUser(partnerCPO.getPartner());
    decorationUserDao.save(decorationUserPO);
}
```

---

#### 3.2 DecorationServiceImpl.java

**文件路径**：`src/com/fanglin/decoration/service/impl/DecorationServiceImpl.java`

**修改位置 1**（第1118行）：
```java
// 从部门销售合作伙伴创建 DecorationUserPO
DepartmentPartnerPO partnerSO = departmentPartnerDao.queryDepartmentPartner(
    designer.getDept().getDid(),
    DepartmentPartnerPO.TYPE_SALES_INT
);

if (partnerSO != null) {
    DecorationUserPO decorationUserPO = new DecorationUserPO();
    decorationUserPO.setOrderId(decorationPO.getOrderId());
    decorationUserPO.setUser(partnerSO.getPartner());
    decorationUserPO.setType(DecorationUserPO.TYPE_SALES_INT);  // ✅ 新增
    decorationUserDao.save(decorationUserPO);
}
```

**修改位置 2**（第1134行）：
```java
// 从城市销售合作伙伴创建 DecorationUserPO
CityProperPartnerPO partnerCPO = cityProperPartnerDao.queryCityProperPartner(
    housePO.getVillage().getCityProper().getCpid(),
    CityProperPartnerPO.TYPE_SALES_INT
);

if (partnerCPO != null) {
    DecorationUserPO decorationUserPO = new DecorationUserPO();
    decorationUserPO.setOrderId(decorationPO.getOrderId());
    decorationUserPO.setType(DecorationUserPO.TYPE_SALES_INT);  // ✅ 新增
    decorationUserPO.setUser(partnerCPO.getPartner());
    decorationUserDao.save(decorationUserPO);
}
```

---

## 📊 修改文件清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `db/migration/add_decorationuser_type.sql` | 新增 | 数据库迁移脚本 |
| `src/com/fanglin/decoration/po/DecorationUserPO.java` | 修改 | 添加 type 字段和常量 |
| `src/com/fanglin/decoration/vo/DecorationUserVO.java` | 修改 | 添加 type 字段 |
| `src/com/fanglin/construction/service/impl/ConstructionServiceImpl.java` | 修改 | 赋值时保留 type |
| `src/com/fanglin/decoration/service/impl/DecorationServiceImpl.java` | 修改 | 赋值时保留 type |

---

## 🔄 业务流程变更

### 修改前
```
userpartner (有 type) → 自动赋值 → decorationuser (无 type ❌)
```

### 修改后
```
userpartner (有 type) → 自动赋值 → decorationuser (保留 type ✅)
```

**好处**：
- 类型信息不再丢失
- 可按 type 精确筛选订单人员
- 与其他 Partner 表设计一致
- 便于后续扩展和统计

---

## 📝 使用示例

### SQL 查询示例

```sql
-- 查询订单的所有服务人员
SELECT * FROM decoration.decorationuser
WHERE orderId = 'D202501010001' AND type = 2;

-- 统计订单各类型人员数量
SELECT type, COUNT(*) as count
FROM decoration.decorationuser
WHERE orderId = 'D202501010001'
GROUP BY type;

-- 查询某人参与的所有订单（作为服务人员）
SELECT d.orderId, d.customerName
FROM decoration.decorationuser du
JOIN decoration.decoration d ON du.orderId = d.orderId
WHERE du.user = 12345 AND du.type = 2;
```

### Java 代码示例

```java
// 创建订单人员时指定类型
DecorationUserPO user = new DecorationUserPO();
user.setOrderId("D202501010001");
user.setUser(userPO);
user.setType(DecorationUserPO.TYPE_SERV_INT);  // 服务人员
decorationUserDao.save(user);

// 查询特定类型的订单人员
List<DecorationUserPO> servants = decorationUserDao.queryByOrderIdAndType(
    "D202501010001",
    DecorationUserPO.TYPE_SERV_INT
);
```

---

## ⚠️ 注意事项

### 1. 数据库迁移
- ✅ **生产环境部署前必须执行** `add_decorationuser_type.sql`
- ✅ 字段默认值为 0，不会影响现有数据
- ✅ 添加了索引 `idx_type` 优化查询性能

### 2. 兼容性
- ✅ `type` 字段为 `Short` 类型，可为 NULL
- ✅ 旧代码仍然可以正常工作
- ✅ `content` 字段继续保留，作为补充说明

### 3. 前端修改
- ⚠️ **待修改**：前端表单需要添加类型选择下拉框
- ⚠️ **待修改**：前端列表页可以添加类型筛选功能
- ⚠️ **待修改**：前端详情页可以显示类型标签

### 4. 后续优化建议
1. 在 `DecorationUserDao` 中添加按类型查询的方法
2. 在 `DecorationUserService` 中添加按类型查询的业务方法
3. 前端类型选择器使用 `constant.personel().userPartner.type` 配置
4. 统计报表中添加按类型分组的统计功能

---

## 🎯 测试建议

### 1. 单元测试
- 测试 `DecorationUserPO` 的 getter/setter
- 测试 `DecorationUserVO` 的 getter/setter
- 测试赋值逻辑是否正确设置 type

### 2. 集成测试
- 测试创建订单时是否正确自动设置 type
- 测试按 type 查询订单人员
- 测试按 type 统计订单人员数量

### 3. 数据验证
```sql
-- 验证新字段是否创建成功
SHOW COLUMNS FROM decoration.decorationuser LIKE 'type';

-- 验证索引是否创建成功
SHOW INDEX FROM decoration.decorationuser WHERE Key_name = 'idx_type';

-- 查看现有数据的 type 值
SELECT type, COUNT(*) FROM decoration.decorationuser GROUP BY type;
```

---

## 📚 相关文档

- [UserPartnerPO.java](../src/com/fanglin/personel/po/UserPartnerPO.java) - 参考 type 常量定义
- [DepartmentPartnerPO.java](../src/com/fanglin/communion/po/DepartmentPartnerPO.java) - 参考 type 常量定义
- [CLAUDE.md](../CLAUDE.md) - 项目主文档
- [docs/KNOWLEDGE_BASE.md](../docs/KNOWLEDGE_BASE.md) - 项目知识库

---

## ✅ 完成检查清单

- [x] 数据库迁移脚本创建
- [x] DecorationUserPO.java 修改完成
- [x] DecorationUserVO.java 修改完成
- [x] ConstructionServiceImpl.java 赋值逻辑修改完成
- [x] DecorationServiceImpl.java 赋值逻辑修改完成
- [ ] **待执行**：数据库迁移脚本在测试环境执行
- [ ] **待执行**：数据库迁移脚本在生产环境执行
- [ ] **待修改**：前端表单添加类型选择
- [ ] **待修改**：前端列表添加类型筛选
- [ ] **待测试**：单元测试和集成测试
- [ ] **待更新**：API 文档更新

---

**修改完成时间**：2026-03-12
**修改人员**：AI Assistant
**审核状态**：待审核
