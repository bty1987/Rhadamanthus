# 外销单操作记录 - 快速开始指南

## 🚀 5分钟快速部署

### 第一步: 执行数据库脚本 (1分钟)

```bash
# 登录数据库
mysql -u root -p

# 执行两个脚本
source database/oalesrecord.sql
source database/constant_oalesRecord.sql
```

### 第二步: 编译项目 (2分钟)

```bash
# 方式1: 使用命令行
mvn clean compile

# 方式2: 使用IDE
# Eclipse: Project -> Build All
```

### 第三步: 重启服务 (1分钟)

```bash
# 重启Tomcat
$TOMCAT_HOME/bin/shutdown.sh
sleep 3
$TOMCAT_HOME/bin/startup.sh
```

### 第四步: 验证 (1分钟)

在浏览器控制台执行：
```javascript
console.log(constant.sales.oalesRecord.type.datas);
```

应该看到15条操作类型数据。

---

## 📋 验证清单

执行以下命令验证部署：

```sql
-- 1. 检查表是否创建
USE sales;
SHOW TABLES LIKE 'oalesrecord';
-- 预期: 显示 oalesrecord

-- 2. 检查配置是否插入
USE communion;
SELECT COUNT(*) FROM `constant`
WHERE module='sales' AND clazz='oalesRecord';
-- 预期: 15

-- 3. 测试查询接口
# curl 或 Postman 测试
POST http://localhost:8080/Rhadamanthus/pageOalesRecord.do
{
  "paging": {"page": 1, "size": 10}
}
```

---

## 💡 快速使用

### 场景1: 查看外销单的所有操作记录

```javascript
// 前端调用
api.post('/pageOalesRecord.do', {
  paging: { page: 1, size: 20 },
  oid: 12345  // 指定外销单ID
}).then(res => {
  console.log('操作记录:', res.rows);
});
```

### 场景2: 显示操作类型名称

```html
<!-- 表格列定义 -->
<script type="text/html" id="typeTpl">
  {{#
    var typeMap = {
      1: '新增', 2: '更新', 3: '提交', 4: '取消',
      5: '确认', 6: '驳回', 7: '复核', 8: '完结',
      9: '废单', 10: '退款', 11: '删除', 12: '活动',
      13: '添加支付', 14: '更新支付', 15: '删除支付'
    };
    return typeMap[d.type] || '未知';
  #}}
</script>

<!-- 或使用 constant 配置 -->
<script type="text/html" id="typeTpl">
  {{#
    var types = constant.sales.oalesRecord.type.datas;
    var type = types.find(t => t.key == d.type);
    return type ? type.value : '未知';
  #}}
</script>
```

### 场景3: 筛选特定操作类型

```javascript
// 只查看确认操作
api.post('/pageOalesRecord.do', {
  paging: { page: 1, size: 20 },
  filters: {
    'type': 5  // 5-确认
  }
});
```

---

## 🔍 验证自动记录

### 测试步骤

1. **创建外销单**
   - 通过前端创建一个外销单
   - 查询操作记录，应该有1条 type=1 的记录

2. **提交外销单**
   - 提交刚创建的外销单
   - 查询操作记录，应该新增1条 type=3 的记录
   - 记录的 beforeStatus=0, afterStatus=1

3. **添加支付**
   - 为外销单添加支付记录
   - 查询操作记录，应该新增1条 type=13 的记录
   - 记录的 opid 字段有值

### 验证SQL

```sql
-- 查看最新10条操作记录
SELECT r.orid, r.oid, o.no, r.type, r.comment,
       r.operateTime, u.name AS operator
FROM sales.oalesrecord r
LEFT JOIN sales.oales o ON r.oid = o.oid
LEFT JOIN personel.user u ON r.ouid = u.uid
ORDER BY r.operateTime DESC
LIMIT 10;
```

---

## ⚠️ 常见错误

### 错误1: 表不存在

**现象**: `Table 'sales.oalesrecord' doesn't exist`

**解决**:
```sql
USE sales;
source /path/to/database/oalesrecord.sql
```

### 错误2: 常量未定义

**现象**: `constant.sales.oalesRecord.type.datas is undefined`

**解决**:
```sql
USE communion;
source /path/to/database/constant_oalesRecord.sql
```

然后重启应用。

### 错误3: 接口404

**现象**: `pageOalesRecord.do not found`

**解决**:
1. 检查 OalesRecordAction.java 是否已编译
2. 重新编译项目
3. 清空Tomcat缓存并重启

---

## 📚 更多文档

- **完整功能说明**: [OALES_RECORD_IMPLEMENTATION.md](./OALES_RECORD_IMPLEMENTATION.md)
- **前端使用指南**: [OALES_RECORD_CONSTANT_USAGE.md](./OALES_RECORD_CONSTANT_USAGE.md)
- **详细部署文档**: [OALES_RECORD_DEPLOYMENT.md](./OALES_RECORD_DEPLOYMENT.md)

---

**快速开始指南版本**: 1.0.0
**最后更新**: 2026-03-17
