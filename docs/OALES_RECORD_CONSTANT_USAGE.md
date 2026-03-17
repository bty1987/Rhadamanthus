# 外销单操作记录 - 前端使用说明

## 📋 概述

外销单操作记录的操作类型已配置到 `communion.constant` 表中，前端可通过 `constant.sales.oalesRecord.type.datas` 获取。

**更新日期**: 2026-03-17

---

## 🗂️ 数据库配置

### Constant 表配置

**表名**: `communion.constant`

**配置参数**:
- `module`: sales
- `clazz`: oalesRecord
- `type`: type
- `field`: type

**SQL 文件**: `database/constant_oalesRecord.sql`

### 配置数据

| key | value | 说明 |
|-----|-------|------|
| 1 | 新增 | 新增外销单 |
| 2 | 更新 | 更新外销单/对账 |
| 3 | 提交 | 提交外销单 |
| 4 | 取消 | 取消外销单 |
| 5 | 确认 | 确认外销单 |
| 6 | 驳回 | 驳回外销单 |
| 7 | 复核 | 复核外销单 |
| 8 | 完结 | 完结外销单 |
| 9 | 废单 | 废单 |
| 10 | 退款 | 退款 |
| 11 | 删除 | 删除外销单 |
| 12 | 活动 | 活动设置 |
| 13 | 添加支付 | 添加支付记录 |
| 14 | 更新支付 | 更新支付记录 |
| 15 | 删除支付 | 删除支付记录 |

---

## 💻 前端使用示例

### 1. 获取操作类型列表

```javascript
// 获取所有操作类型
const typeOptions = constant.sales.oalesRecord.type.datas;

// 结果示例:
// [
//   { key: '1', value: '新增' },
//   { key: '2', value: '更新' },
//   { key: '3', value: '提交' },
//   ...
// ]
```

### 2. 操作类型筛选

```javascript
// 使用 LayUI 表单选择器
form.on('select(recordType)', function(data) {
  // data.value 为操作类型的 key (如 '1', '2', '3')
  console.log('选择的操作类型:', data.value);
});
```

### 3. 操作类型显示

```javascript
// 表格列定义
table.render({
  cols: [[
    { field: 'type', title: '操作类型', templet: function(d) {
      // 根据类型值获取显示文本
      const typeMap = constant.sales.oalesRecord.type.datas;
      const typeItem = typeMap.find(item => item.key == d.type);
      return typeItem ? typeItem.value : '未知';
    }}
  ]]
});
```

### 4. 操作类型筛选示例

```javascript
// 表格工具栏 - 操作类型筛选
<table id="recordTable" lay-filter="recordTable"></table>

<script>
layui.use(['table', 'form'], function() {
  var table = layui.table;
  var form = layui.form;

  // 操作类型筛选下拉框
  form.render('select');

  // 监听筛选
  form.on('submit(filterRecords)', function(data) {
    table.reload('recordTable', {
      where: {
        type: data.field.type  // 传递选中的操作类型
      }
    });
    return false;
  });
});
</script>
```

### 5. 完整页面示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>外销单操作记录</title>
</head>
<body>
  <!-- 筛选表单 -->
  <form class="layui-form" lay-filter="filterForm">
    <div class="layui-form-item">
      <div class="layui-inline">
        <label class="layui-form-label">操作类型</label>
        <div class="layui-input-inline">
          <select name="type" lay-search>
            <option value="">全部</option>
            <!-- 动态加载操作类型 -->
            {{# each constant.sales.oalesRecord.type.datas }}
            <option value="{{ this.key }}">{{ this.value }}</option>
            {{/ each }}
          </select>
        </div>
      </div>
      <div class="layui-inline">
        <button class="layui-btn" lay-submit lay-filter="filter">查询</button>
      </div>
    </div>
  </form>

  <!-- 数据表格 -->
  <table id="recordTable" lay-filter="recordTable"></table>

  <script>
  layui.use(['table', 'form'], function() {
    var table = layui.table;
    var form = layui.form;

    // 渲染表格
    table.render({
      elem: '#recordTable',
      url: '/pageOalesRecord.do',
      cols: [[
        { field: 'orid', title: '记录ID', width: 100 },
        { field: 'oales.no', title: '外销单号', width: 150 },
        {
          field: 'type',
          title: '操作类型',
          width: 120,
          templet: function(d) {
            // 使用 constant 配置转换
            const types = constant.sales.oalesRecord.type.datas;
            const type = types.find(t => t.key == d.type);
            return type ? type.value : '未知';
          }
        },
        { field: 'operate.name', title: '操作人', width: 120 },
        {
          field: 'operateTime',
          title: '操作时间',
          width: 180,
          templet: '<div>{{ d.operateTime }}</div>'
        },
        { field: 'comment', title: '备注', minWidth: 200 }
      ]],
      page: true
    });

    // 监听筛选
    form.on('submit(filter)', function(data) {
      table.reload('recordTable', {
        where: data.field
      });
      return false;
    });
  });
  </script>
</body>
</html>
```

---

## 🔧 后端接口说明

### 1. 分页查询操作记录

```
POST /pageOalesRecord.do
```

**请求参数**:
```javascript
{
  paging: {
    page: 1,
    size: 20
  },
  filters: {
    // 可选：按操作类型筛选
    'type': 5,
    // 可选：按外销单ID筛选
    'oid': 12345
  }
}
```

**响应数据**:
```javascript
{
  "success": true,
  "rows": [
    {
      "orid": 1,
      "oid": 12345,
      "opid": null,
      "ouid": 10001,
      "operateTime": "2026-03-17 10:30:00",
      "type": 5,  // 注意：返回的是数字，不返回文字
      "comment": "确认外销单",
      "beforeStatus": 1,
      "afterStatus": 2,
      "operate": {
        "uid": 10001,
        "name": "张三"
      },
      "oales": {
        "oid": 12345,
        "no": "FL170301001"
      }
    }
  ],
  "total": 100
}
```

**注意**:
- `type` 字段返回的是**数字类型** (1-15)
- 前端需要使用 `constant.sales.oalesRecord.type.datas` 进行转换显示
- 后端**不返回** typeName 字段

---

## 📝 数据字典路径

完整的常量配置路径：
```
constant.sales.oalesRecord.type.datas
```

路径结构说明：
- `constant` - 常量根对象
- `sales` - 销售模块
- `oalesRecord` - 外销单操作记录
- `type` - 操作类型
- `datas` - 数据数组

---

## ⚠️ 重要说明

### 1. 数据转换位置
- ❌ **后端不转换**: 后端直接返回数字类型
- ✅ **前端转换**: 前端通过 constant 配置转换为显示文本

### 2. 常量配置优先级
前端应以 `constant` 表配置为准，**不要硬编码**类型映射关系。

### 3. 后端常量保留
虽然后端不转换，但 `OalesRecordPO.java` 中仍保留了常量定义供后端业务逻辑使用：
```java
public static final short TYPE_ADD = 1;
public static final short TYPE_UPDATE = 2;
// ...
```

### 4. 扩展操作类型
如需新增操作类型：
1. 在 `communion.constant` 表中插入新记录
2. 前端自动获取新配置，无需修改代码

---

## 🚀 部署步骤

### 1. 执行 SQL 脚本

```bash
# 执行操作类型配置 SQL
mysql -u root -p < database/constant_oalesRecord.sql
```

### 2. 重启应用

```bash
# 重启 Tomcat 使配置生效
$TOMCAT_HOME/bin/shutdown.sh
$TOMCAT_HOME/bin/startup.sh
```

### 3. 前端验证

在浏览器控制台测试：
```javascript
console.log(constant.sales.oalesRecord.type.datas);
// 应该输出 15 个操作类型的数组
```

---

## 📖 相关文档

- [完整功能实现文档](./OALES_RECORD_IMPLEMENTATION.md)
- [数据库建表脚本](../database/oalesrecord.sql)
- [Constant 表结构说明](../src/com/fanglin/communion/po/ConstantPO.java)

---

**文档生成时间**: 2026-03-17
**版本**: 2.0.0 (使用 constant 表配置)
