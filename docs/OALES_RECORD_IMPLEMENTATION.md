# 外销单操作记录功能实现说明

## 📋 功能概述

为外销单(oales)和外销单支付(oalespay)系统添加了完整的操作记录功能，用于追踪所有关键操作的历史记录。

**实现时间**: 2026-03-17

---

## 🗂️ 数据库表结构

### oalesrecord - 外销单操作记录表

**文件位置**: `database/oalesrecord.sql`

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| orid | BIGINT(20) | 记录ID | 主键，自增 |
| oid | BIGINT(20) | 外销单ID | 外键，关联oales.oid |
| opid | BIGINT(20) | 支付记录ID | 可选，支付操作时填写 |
| ouid | BIGINT(20) | 操作人ID | 外键，关联personel.user.uid |
| operateTime | DATETIME | 操作时间 | 自动记录 |
| type | SMALLINT(6) | 操作类型 | 见下方类型定义 |
| comment | VARCHAR(500) | 备注说明 | 操作详情描述 |
| beforeStatus | SMALLINT(6) | 操作前状态 | 可选 |
| afterStatus | SMALLINT(6) | 操作后状态 | 可选 |
| ip | VARCHAR(50) | 操作人IP | 可选，预留字段 |

**索引**:
- PRIMARY KEY (orid)
- KEY idx_oid (oid) - 支持按外销单查询
- KEY idx_opid (opid) - 支持按支付记录查询
- KEY idx_ouid (ouid) - 支持按操作人查询
- KEY idx_operateTime (operateTime) - 支持按时间排序

---

## 🔢 操作类型定义

| 值 | 常量名 | 说明 | 应用接口 |
|----|--------|------|----------|
| 1 | TYPE_ADD | 新增 | addOales |
| 2 | TYPE_UPDATE | 更新 | updateOales, scaleOales |
| 3 | TYPE_SUBMIT | 提交 | submitOales |
| 4 | TYPE_CANCEL | 取消 | cancelOales |
| 5 | TYPE_CONFIRM | 确认 | confirmOales |
| 6 | TYPE_REJECT | 驳回 | rejectOales |
| 7 | TYPE_CHECK | 复核 | checkOales |
| 8 | TYPE_FINISH | 完结 | finishOales |
| 9 | TYPE_ABATE | 废单 | abateOales |
| 10 | TYPE_REFUND | 退款 | refundOales |
| 11 | TYPE_DELETE | 删除 | deleteOales |
| 12 | TYPE_ACTIVITY | 活动 | activityOales |
| 13 | TYPE_ADD_PAY | 添加支付 | addOalesPay |
| 14 | TYPE_UPDATE_PAY | 更新支付 | updateOalesPay, updateOalesPayForAdvance |
| 15 | TYPE_DELETE_PAY | 删除支付 | deleteOalesPay |

---

## 📁 代码文件清单

### 1. 持久化层 (PO)
- **`src/com/fanglin/sales/po/OalesRecordPO.java`** - 操作记录实体类

### 2. 值对象层 (VO)
- **`src/com/fanglin/sales/vo/OalesRecordVO.java`** - 操作记录值对象

### 3. 数据访问层 (DAO)
- **`src/com/fanglin/sales/dao/OalesRecordDao.java`** - DAO接口
- **`src/com/fanglin/sales/dao/impl/OalesRecordDaoImpl.java`** - DAO实现

### 4. 业务逻辑层 (Service)
- **`src/com/fanglin/sales/service/OalesRecordService.java`** - Service接口
- **`src/com/fanglin/sales/service/impl/OalesRecordServiceImpl.java`** - Service实现

### 5. 控制器层 (Action)
- **`src/com/fanglin/sales/action/OalesRecordAction.java`** - 记录查询控制器

### 6. 修改的现有文件

#### OalesService 相关
- **`src/com/fanglin/sales/service/OalesService.java`** - 接口添加userId参数
- **`src/com/fanglin/sales/service/impl/OalesServiceImpl.java`** - 集成记录逻辑
- **`src/com/fanglin/sales/action/OalesAction.java`** - 传入userId参数

#### OalesPayService 相关
- **`src/com/fanglin/sales/service/OalesPayService.java`** - 接口添加userId参数
- **`src/com/fanglin/sales/service/impl/OalesPayServiceImpl.java`** - 集成记录逻辑
- **`src/com/fanglin/sales/action/OalesPayAction.java`** - 传入userId参数

---

## 🔌 API 接口

### 1. 分页查询操作记录
```
POST /pageOalesRecord
参数：
  - paging: 分页对象
  - filters: 过滤条件
  - oid: 外销单ID（可选）
返回：JSON { success: boolean, rows: OalesRecord[], total: number }
```

### 2. 根据外销单ID查询操作记录
```
POST /queryOalesRecordByOid
参数：
  - oid: 外销单ID
返回：JSON { success: boolean, oalesRecords: OalesRecord[] }
```

---

## 💡 使用示例

### 前端调用示例

```javascript
// 1. 分页查询某外销单的操作记录
api.post('/pageOalesRecord', {
  paging: { page: 1, size: 20 },
  filters: {},
  oid: 12345  // 外销单ID
}).then(res => {
  console.log('操作记录:', res.rows);
});

// 2. 查询所有操作记录（不过滤）
api.post('/pageOalesRecord', {
  paging: { page: 1, size: 50 },
  filters: {
    'type': 5  // 只查询确认操作
  }
}).then(res => {
  console.log('确认记录:', res.rows);
});
```

### 后端记录示例

记录会自动在以下操作时添加：

```java
// 示例1: 新增外销单时自动记录
oalesService.addOales(oalesVO, userId, company);
// 自动添加: type=1, comment="新增外销单"

// 示例2: 状态变更时记录状态前后值
oalesService.submitOales(oales, userId);
// 自动添加: type=3, comment="提交外销单", beforeStatus=0, afterStatus=1

// 示例3: 支付操作记录
oalesPayService.addOalesPay(oalesPayVO, userId, company);
// 自动添加: type=13, comment="添加支付记录", opid=xxx
```

---

## 🔨 部署步骤

### 1. 执行数据库脚本
```bash
mysql -u root -p < database/oalesrecord.sql
```

### 2. 编译Java代码
```bash
# 使用Maven或IDE编译项目
mvn clean compile
```

### 3. 部署到Tomcat
```bash
# 将编译后的WAR包部署到Tomcat
cp target/Rhadamanthus.war $TOMCAT_HOME/webapps/
```

### 4. 重启Tomcat
```bash
$TOMCAT_HOME/bin/shutdown.sh
$TOMCAT_HOME/bin/startup.sh
```

---

## 📊 记录的操作接口清单

### OalesAction (12个接口)
- ✅ addOales - 新增外销单
- ✅ updateOales - 更新外销单
- ✅ submitOales - 提交外销单
- ✅ cancelOales - 取消外销单
- ✅ confirmOales - 确认外销单
- ✅ rejectOales - 驳回外销单
- ✅ checkOales - 复核外销单
- ✅ finishOales - 完结外销单
- ✅ abateOales - 废单
- ✅ refundOales - 退款
- ✅ scaleOales - 标记已对账
- ✅ deleteOales - 删除外销单
- ✅ activityOales - 活动设置

### OalesPayAction (4个接口)
- ✅ addOalesPay - 添加支付记录
- ✅ updateOalesPay - 更新支付记录
- ✅ updateOalesPayForAdvance - 更新预付日期
- ✅ deleteOalesPay - 删除支付记录

---

## 🎯 关键设计特点

### 1. 自动记录
所有操作记录都是自动添加的，无需手动调用。在Service层的业务逻辑执行后会自动记录。

### 2. 状态追踪
对于涉及状态变更的操作，会记录beforeStatus和afterStatus，方便追溯状态流转历史。

### 3. 支付记录关联
支付相关操作会额外记录opid字段，建立与支付记录的关联关系。

### 4. 用户追踪
所有记录都包含操作人ID(ouid)和操作时间(operateTime)，确保操作可追溯。

### 5. 灵活查询
支持按外销单ID、支付记录ID、操作类型等多种维度查询操作记录。

---

## ⚠️ 注意事项

1. **接口签名变更**: OalesService和OalesPayService的部分方法签名已变更，添加了userId参数，需要确保所有调用方都已更新。

2. **兼容性**: 如果有其他模块调用这些Service方法，需要同步更新传入userId参数。

3. **数据库**: 在部署前必须先执行建表SQL脚本，否则会因表不存在导致操作失败。

4. **性能**: 操作记录表会随着业务增长快速增长，建议定期归档历史数据。

---

## 📝 后续优化建议

1. **归档机制**: 实现定期归档历史操作记录的功能
2. **操作详情**: 对于复杂操作，可以考虑添加操作前的快照字段
3. **审计报表**: 开发操作审计报表，统计分析高频操作和操作人
4. **异常告警**: 对于异常操作（如频繁删除）添加告警机制

---

## 📞 技术支持

如有问题，请联系开发团队或查看项目文档：
- 项目文档: `CLAUDE.md`
- 模块文档: `src/com/fanglin/sales/CLAUDE.md`

---

**文档生成时间**: 2026-03-17
**版本**: 1.0.0
