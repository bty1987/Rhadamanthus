# 外销单操作记录 - 部署清单

## 📋 部署前检查清单

### 1. 数据库变更

#### ✅ 必须执行的 SQL 脚本

```bash
# 1. 创建操作记录表
mysql -u root -p < database/oalesrecord.sql

# 2. 配置 constant 表数据
mysql -u root -p < database/constant_oalesRecord.sql
```

#### ✅ 验证数据库

```sql
-- 验证表是否创建成功
USE sales;
SHOW TABLES LIKE 'oalesrecord';
DESC oalesrecord;

-- 验证 constant 配置是否插入成功
USE communion;
SELECT * FROM `constant`
WHERE module = 'sales'
  AND clazz = 'oalesRecord'
  AND type = 'type'
ORDER BY `key` ASC;

-- 应该返回 15 条记录
```

### 2. 代码变更检查

#### ✅ 新增文件 (7个)

持久化层:
- [ ] `src/com/fanglin/sales/po/OalesRecordPO.java`
- [ ] `src/com/fanglin/sales/vo/OalesRecordVO.java`

数据访问层:
- [ ] `src/com/fanglin/sales/dao/OalesRecordDao.java`
- [ ] `src/com/fanglin/sales/dao/impl/OalesRecordDaoImpl.java`

业务逻辑层:
- [ ] `src/com/fanglin/sales/service/OalesRecordService.java`
- [ ] `src/com/fanglin/sales/service/impl/OalesRecordServiceImpl.java`

控制器层:
- [ ] `src/com/fanglin/sales/action/OalesRecordAction.java`

#### ✅ 修改的文件 (6个)

Oales 模块:
- [ ] `src/com/fanglin/sales/service/OalesService.java` - 添加 userId 参数
- [ ] `src/com/fanglin/sales/service/impl/OalesServiceImpl.java` - 集成记录逻辑
- [ ] `src/com/fanglin/sales/action/OalesAction.java` - 传入 userId

OalesPay 模块:
- [ ] `src/com/fanglin/sales/service/OalesPayService.java` - 添加 userId 参数
- [ ] `src/com/fanglin/sales/service/impl/OalesPayServiceImpl.java` - 集成记录逻辑
- [ ] `src/com/fanglin/sales/action/OalesPayAction.java` - 传入 userId

### 3. 编译检查

```bash
# 使用 Maven 编译
cd /path/to/Rhadamanthus
mvn clean compile

# 或使用 IDE 编译
# 检查是否有编译错误
```

**预期结果**: 无编译错误

### 4. 依赖检查

确认以下依赖已正确注入：

**OalesServiceImpl**:
```java
@Autowired
private OalesRecordService oalesRecordService;  // ✅ 新增
```

**OalesPayServiceImpl**:
```java
@Autowired
private OalesRecordService oalesRecordService;  // ✅ 新增
```

---

## 🚀 部署步骤

### 步骤 1: 备份数据库

```bash
# 备份当前数据库
mysqldump -u root -p --databases sales communion > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 步骤 2: 执行数据库脚本

```bash
# 创建操作记录表
mysql -u root -p sales < database/oalesrecord.sql

# 插入 constant 配置
mysql -u root -p communion < database/constant_oalesRecord.sql
```

### 步骤 3: 编译项目

```bash
# 方式 1: 使用 Maven
mvn clean package -DskipTests

# 方式 2: 使用 IDE
# 1. Eclipse: Project -> Clean -> Clean
# 2. 然后 Project -> Build All
```

### 步骤 4: 部署 WAR 包

```bash
# 停止 Tomcat
$TOMCAT_HOME/bin/shutdown.sh

# 删除旧版本
rm -rf $TOMCAT_HOME/webapps/Rhadamanthus

# 部署新版本
cp target/Rhadamanthus.war $TOMCAT_HOME/webapps/

# 启动 Tomcat
$TOMCAT_HOME/bin/startup.sh
```

### 步骤 5: 验证部署

```bash
# 查看启动日志
tail -f $TOMCAT_HOME/logs/catalina.out

# 等待看到 "Server startup in [x] ms"
```

---

## ✅ 部署后验证

### 1. 数据库验证

```sql
-- 检查表结构
USE sales;
SHOW CREATE TABLE oalesrecord;

-- 检查索引
SHOW INDEX FROM oalesrecord;

-- 检查 constant 配置
USE communion;
SELECT cid, `key`, value, status
FROM `constant`
WHERE module = 'sales' AND clazz = 'oalesRecord'
ORDER BY `key` ASC;
```

**预期结果**:
- oalesrecord 表存在且有 5 个索引
- constant 表有 15 条配置记录

### 2. API 接口验证

#### 测试 1: 分页查询操作记录

```bash
curl -X POST http://localhost:8080/Rhadamanthus/pageOalesRecord.do \
  -H "Content-Type: application/json" \
  -d '{
    "paging": {"page": 1, "size": 10},
    "filters": {},
    "oid": null
  }'
```

**预期响应**:
```json
{
  "success": true,
  "rows": [],
  "total": 0
}
```

#### 测试 2: 创建外销单并验证自动记录

```bash
# 1. 创建一个外销单（通过前端或 API）
# 2. 查询操作记录
curl -X POST http://localhost:8080/Rhadamanthus/pageOalesRecord.do \
  -H "Content-Type: application/json" \
  -d '{
    "paging": {"page": 1, "size": 10},
    "filters": {},
    "oid": <刚创建的oid>
  }'
```

**预期结果**: 返回 1 条 type=1 的记录（新增）

### 3. 前端验证

#### 验证 1: 常量配置加载

在浏览器控制台执行：
```javascript
console.log(constant.sales.oalesRecord.type.datas);
```

**预期结果**: 输出 15 个操作类型的数组

#### 验证 2: 操作记录查询

1. 登录系统
2. 打开外销单管理页面
3. 查询任意外销单
4. 查看操作记录列表（如果前端已实现）

### 4. 日志验证

检查 Tomcat 日志是否有错误：

```bash
# 查看最近的错误日志
grep -i "error" $TOMCAT_HOME/logs/catalina.out | tail -50

# 查找 OalesRecord 相关日志
grep -i "OalesRecord" $TOMCAT_HOME/logs/catalina.out | tail -50
```

**预期结果**: 无 ERROR 级别的日志

---

## 🧪 功能测试清单

### 测试 1: 外销单操作记录

| 操作 | 预期记录类型 | 预期记录条数 | 状态 |
|------|------------|------------|------|
| 新增外销单 | TYPE_ADD (1) | 1 | ⬜ |
| 更新外销单 | TYPE_UPDATE (2) | 1 | ⬜ |
| 提交外销单 | TYPE_SUBMIT (3) | 1 | ⬜ |
| 确认外销单 | TYPE_CONFIRM (5) | 1 | ⬜ |
| 驳回外销单 | TYPE_REJECT (6) | 1 | ⬜ |
| 复核外销单 | TYPE_CHECK (7) | 1 | ⬜ |
| 完结外销单 | TYPE_FINISH (8) | 1 | ⬜ |
| 废单 | TYPE_ABATE (9) | 1 | ⬜ |
| 删除外销单 | TYPE_DELETE (11) | 1 | ⬜ |

### 测试 2: 支付操作记录

| 操作 | 预期记录类型 | 预期记录条数 | 状态 |
|------|------------|------------|------|
| 添加支付 | TYPE_ADD_PAY (13) | 1 | ⬜ |
| 更新支付 | TYPE_UPDATE_PAY (14) | 1 | ⬜ |
| 删除支付 | TYPE_DELETE_PAY (15) | 1 | ⬜ |

### 测试 3: 记录内容验证

每个操作记录应包含：
- [ ] orid - 记录ID
- [ ] oid - 外销单ID
- [ ] opid - 支付记录ID（如果是支付操作）
- [ ] ouid - 操作人ID
- [ ] operateTime - 操作时间
- [ ] type - 操作类型（数字）
- [ ] comment - 操作说明
- [ ] beforeStatus - 操作前状态（状态变更操作）
- [ ] afterStatus - 操作后状态（状态变更操作）

---

## 🐛 常见问题排查

### 问题 1: 表不存在

**错误信息**:
```
Table 'sales.oalesrecord' doesn't exist
```

**解决方案**:
```sql
-- 检查表是否存在
USE sales;
SHOW TABLES LIKE 'oalesrecord';

-- 如果不存在，重新执行建表脚本
source /path/to/database/oalesrecord.sql
```

### 问题 2: 常量配置未加载

**错误信息**:
```
constant.sales.oalesRecord.type.datas is undefined
```

**解决方案**:
```sql
-- 检查 constant 表配置
USE communion;
SELECT * FROM `constant`
WHERE module = 'sales' AND clazz = 'oalesRecord';

-- 如果没有数据，重新执行配置脚本
source /path/to/database/constant_oalesRecord.sql
```

### 问题 3: 记录未自动创建

**可能原因**:
1. Service 层未注入 OalesRecordService
2. 事务回滚
3. 数据库连接问题

**排查步骤**:
```java
// 1. 检查 Service 是否正确注入
@Autowired
private OalesRecordService oalesRecordService;

// 2. 检查日志是否有异常
grep "OalesRecord" $TOMCAT_HOME/logs/catalina.out

// 3. 检查数据库是否有记录
SELECT * FROM sales.oalesrecord ORDER BY operateTime DESC LIMIT 10;
```

### 问题 4: 接口调用失败

**错误信息**:
```
404 - pageOalesRecord.do not found
```

**解决方案**:
```bash
# 1. 确认 Action 类已编译
find $TOMCAT_HOME/webapps -name "OalesRecordAction.class"

# 2. 检查 Struts 配置
grep "pageOalesRecord" $TOMCAT_HOME/webapps/Rhadamanthus/WEB-INF/classes/struts.xml

# 3. 重新编译部署
mvn clean package && cp target/Rhadamanthus.war $TOMCAT_HOME/webapps/
```

---

## 📊 性能监控

### 1. 表增长监控

```sql
-- 每天检查记录数增长
SELECT COUNT(*) as total_records,
       MIN(operateTime) as first_record,
       MAX(operateTime) as last_record
FROM sales.oalesrecord;

-- 按操作类型统计
SELECT type, COUNT(*) as count
FROM sales.oalesrecord
GROUP BY type
ORDER BY count DESC;
```

### 2. 索引性能检查

```sql
-- 检查索引使用情况
EXPLAIN SELECT * FROM sales.oalesrecord
WHERE oid = 12345
ORDER BY operateTime DESC;

-- Key 列应该显示使用的索引
```

### 3. 建议的归档策略

```sql
-- 归档 6 个月前的数据
CREATE TABLE sales.oalesrecord_archive LIKE sales.oalesrecord;

INSERT INTO sales.oalesrecord_archive
SELECT * FROM sales.oalesrecord
WHERE operateTime < DATE_SUB(NOW(), INTERVAL 6 MONTH);

DELETE FROM sales.oalesrecord
WHERE operateTime < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

---

## 📞 回滚方案

如果部署后出现严重问题，执行以下回滚步骤：

### 1. 停止应用

```bash
$TOMCAT_HOME/bin/shutdown.sh
```

### 2. 恢复数据库

```bash
# 恢复数据库备份
mysql -u root -p < backup_YYYYMMDD_HHMMSS.sql
```

### 3. 恢复旧版本代码

```bash
# 删除新版本
rm -rf $TOMCAT_HOME/webapps/Rhadamanthus

# 恢复旧版本 WAR 包
cp Rhadamanthus-backup.war $TOMCAT_HOME/webapps/Rhadamanthus.war

# 启动 Tomcat
$TOMCAT_HOME/bin/startup.sh
```

---

## ✅ 部署成功标准

- [ ] 所有 SQL 脚本执行成功
- [ ] 项目编译无错误
- [ ] Tomcat 启动无异常
- [ ] API 接口返回正确
- [ ] 前端常量配置加载成功
- [ ] 创建测试数据验证自动记录
- [ ] 所有功能测试通过

---

**部署清单版本**: 1.0.0
**最后更新**: 2026-03-17
