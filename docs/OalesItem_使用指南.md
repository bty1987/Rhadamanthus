# OalesItem - 外销单项目明细 使用指南

> 创建时间：2026-03-17
> 模块：sales（主材销售）
> 功能：其他销售单（外销单）的项目明细管理

---

## 📦 已创建文件清单

### 后端文件

#### 1. 数据模型层
- `src/com/fanglin/sales/po/OalesItemPO.java` - 持久化对象
- `src/com/fanglin/sales/vo/OalesItemVO.java` - 值对象

#### 2. 数据访问层（DAO）
- `src/com/fanglin/sales/dao/OalesItemDao.java` - DAO 接口
- `src/com/fanglin/sales/dao/impl/OalesItemDaoImpl.java` - DAO 实现

#### 3. 业务逻辑层（Service）
- `src/com/fanglin/sales/service/OalesItemService.java` - Service 接口
- `src/com/fanglin/sales/service/impl/OalesItemServiceImpl.java` - Service 实现

#### 4. 控制器层（Action）
- `src/com/fanglin/sales/action/OalesItemAction.java` - Action 控制器

#### 5. 数据库
- `sql/create_oalesitem_table.sql` - 建表 SQL 语句

### 前端文件

- `WebContent/js/api/sales.js` - 已添加 OalesItem 相关 API 定义（line 382-418）

---

## 🗄️ 数据库表结构

```sql
CREATE TABLE `oalesitem` (
  `oiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `oid` int(11) NOT NULL COMMENT '外销单ID（关联oales.oid）',
  `name` varchar(200) NOT NULL COMMENT '商品名称',
  `format` varchar(100) DEFAULT NULL COMMENT '规格',
  `color` varchar(100) DEFAULT NULL COMMENT '颜色',
  `model` varchar(100) DEFAULT NULL COMMENT '型号',
  `price` int(11) NOT NULL DEFAULT '0' COMMENT '价格（单位：分）',
  `num` bigint(10) NOT NULL DEFAULT '0' COMMENT '数量',
  `total` bigint(10) NOT NULL DEFAULT '0' COMMENT '小计（价格×数量，单位：分）',
  `comment` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`oiid`),
  KEY `index_oid` (`oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='外销单项目明细表';
```

---

## 🔌 API 接口说明

### 1. 分页查询外销单项目明细

**接口**: `pageOalesItem.do`

**前端调用示例**:
```javascript
com.post(api.oalesItem.pageOalesItem, {
    "page.pageNo": 1,
    "page.pageSize": 20,
    "oalesItem.oid": 123  // 外销单ID
}, function(res) {
    console.log('项目明细列表:', res.oalesItems);
    console.log('总记录数:', res.page.total);
});
```

**后端方法**:
```java
// OalesItemAction.pageOalesItem()
// 调用 oalesItemService.pageOalesItem(paging, filters, oalesItem)
```

---

### 2. 查询外销单的所有项目明细

**接口**: `queryOalesItem.do`

**前端调用示例**:
```javascript
com.post(api.oalesItem.queryOalesItem, {
    "oalesItem.oid": 123  // 外销单ID
}, function(res) {
    console.log('所有项目明细:', res.oalesItems);
});
```

**后端方法**:
```java
// OalesItemAction.queryOalesItem()
// 调用 oalesItemService.queryOalesItem(oalesItem)
```

---

### 3. 添加外销单项目明细

**接口**: `addOalesItem.do`

**前端调用示例**:
```javascript
com.post(api.oalesItem.addOalesItem, {
    "oales.oid": 123,           // 外销单ID
    "oalesItem.name": "瓷砖",   // 商品名称（必填）
    "oalesItem.format": "800×800",  // 规格
    "oalesItem.color": "白色",  // 颜色
    "oalesItem.model": "FL-001", // 型号
    "oalesItem.price": 50000,   // 价格（500元，单位：分）
    "oalesItem.num": 10,        // 数量（10件）
    "oalesItem.comment": "备注信息"
}, function(res) {
    console.log('新创建的项目ID:', res.oalesItem.oiid);
    com.showAlert(com.info, '添加成功');
});
```

**后端方法**:
```java
// OalesItemAction.addOalesItem()
// 调用 oalesItemService.addOalesItem(oales, oalesItem)
```

**业务规则**:
- ✅ 验证外销单是否存在
- ✅ 验证外销单状态（只有初始状态可操作）
- ✅ 验证商品名称、价格、数量的合法性
- ✅ 自动计算小计（price × num）
- ✅ 自动更新外销单总金额

---

### 4. 删除外销单项目明细

**接口**: `deleteOalesItem.do`

**前端调用示例**:
```javascript
com.post(api.oalesItem.deleteOalesItem, {
    "oalesItem.oiid": 456  // 项目明细ID
}, function(res) {
    com.showAlert(com.info, '删除成功');
});
```

**后端方法**:
```java
// OalesItemAction.deleteOalesItem()
// 调用 oalesItemService.deleteOalesItem(oalesItem)
```

**业务规则**:
- ✅ 验证项目明细是否存在
- ✅ 验证外销单状态（只有初始状态可删除）
- ✅ 自动更新外销单总金额

---

## 💡 完整使用示例

### 示例1：创建外销单并添加项目明细

```javascript
// 步骤1：创建外销单（假设已有接口）
com.post(api.oales.addOales, {
    "oales.orderId": "2024010001",
    "oales.cid": 123,
    "oales.hid": 456,
    // ... 其他字段
}, function(res) {
    var oid = res.oales.oid;

    // 步骤2：添加项目明细
    addOalesItemDemo(oid);
});

function addOalesItemDemo(oid) {
    com.post(api.oalesItem.addOalesItem, {
        "oales.oid": oid,
        "oalesItem.name": "瓷砖",
        "oalesItem.format": "800×800",
        "oalesItem.color": "白色",
        "oalesItem.model": "FL-001",
        "oalesItem.price": 50000,
        "oalesItem.num": 10
    }, function(res) {
        console.log('添加成功，项目ID:', res.oalesItem.oiid);
    });
}
```

---

### 示例2：分页查询外销单项目明细

```javascript
function loadOalesItems(oid, pageNo) {
    com.post(api.oalesItem.pageOalesItem, {
        "page.pageNo": pageNo || 1,
        "page.pageSize": 20,
        "oalesItem.oid": oid
    }, function(res) {
        // 渲染列表
        var html = '';
        $.each(res.oalesItems, function(i, item) {
            html += '<tr>';
            html += '<td>' + item.oiid + '</td>';
            html += '<td>' + item.name + '</td>';
            html += '<td>' + item.format + '</td>';
            html += '<td>' + item.color + '</td>';
            html += '<td>' + item.model + '</td>';
            html += '<td>' + (item.price / 100).toFixed(2) + '元</td>'; // 分转元
            html += '<td>' + item.num + '</td>';
            html += '<td>' + (item.total / 100).toFixed(2) + '元</td>'; // 分转元
            html += '<td>';
            html += '  <button class="btn btn-xs btn-danger delete-btn" data-oiid="' + item.oiid + '">删除</button>';
            html += '</td>';
            html += '</tr>';
        });
        $('#itemList').html(html);

        // 更新分页信息
        console.log('总记录数:', res.page.total);
    });
}
```

---

### 示例3：删除项目明细

```javascript
$('#itemList').on('click', '.delete-btn', function() {
    var oiid = $(this).data('oiid');

    com.showConfirm('确认删除该项目明细？', function() {
        com.post(api.oalesItem.deleteOalesItem, {
            "oalesItem.oiid": oiid
        }, function(res) {
            com.showAlert(com.info, '删除成功');
            // 重新加载列表
            loadOalesItems(currentOid, currentPageNo);
        });
    });
});
```

---

### 示例4：表格编辑并保存

```javascript
// 编辑项目明细
function editOalesItem(oiid) {
    com.post(api.oalesItem.queryOalesItem, {
        "oalesItem.oid": currentOid
    }, function(res) {
        var item = res.oalesItems.find(function(i) {
            return i.oiid === oiid;
        });

        // 填充表单
        $('#name').val(item.name);
        $('#format').val(item.format);
        $('#color').val(item.color);
        $('#model').val(item.model);
        $('#price').val(item.price / 100); // 分转元
        $('#num').val(item.num);

        // 显示编辑对话框
        $('#editModal').modal('show');
    });
}

// 保存编辑
$('#saveBtn').on('click', function() {
    // 先删除原记录（因为当前没有更新接口）
    com.post(api.oalesItem.deleteOalesItem, {
        "oalesItem.oiid": currentOiid
    }, function() {
        // 再添加新记录
        com.post(api.oalesItem.addOalesItem, {
            "oales.oid": currentOid,
            "oalesItem.name": $('#name').val(),
            "oalesItem.format": $('#format').val(),
            "oalesItem.color": $('#color').val(),
            "oalesItem.model": $('#model').val(),
            "oalesItem.price": parseFloat($('#price').val()) * 100, // 元转分
            "oalesItem.num": parseInt($('#num').val())
        }, function(res) {
            com.showAlert(com.info, '保存成功');
            $('#editModal').modal('hide');
            loadOalesItems(currentOid, currentPageNo);
        });
    });
});
```

---

## 📊 字段说明

### 前端 ↔ 后端 字段映射

| 前端字段 | 后端字段 | 类型 | 说明 | 示例 |
|---------|---------|------|------|------|
| `oalesItem.oiid` | `oiid` | Long | 主键ID | 456 |
| `oalesItem.oid` | `oid` | Long | 外销单ID | 123 |
| `oalesItem.name` | `name` | String | 商品名称 | "瓷砖" |
| `oalesItem.format` | `format` | String | 规格 | "800×800" |
| `oalesItem.color` | `color` | String | 颜色 | "白色" |
| `oalesItem.model` | `model` | String | 型号 | "FL-001" |
| `oalesItem.price` | `price` | Integer | 价格（单位：分） | 50000（500元） |
| `oalesItem.num` | `num` | Long | 数量 | 10 |
| `oalesItem.total` | `total` | Long | 小计（单位：分） | 500000（5000元） |
| `oalesItem.comment` | `comment` | String | 备注 | "备注信息" |

### 金额转换

```javascript
// 前端显示（元） → 后端存储（分）
var priceYuan = 500.50;  // 前端：500.50元
var priceFen = Math.round(priceYuan * 100);  // 后端：50050分

// 后端存储（分） → 前端显示（元）
var priceFen = 50050;  // 后端：50050分
var priceYuan = (priceFen / 100).toFixed(2);  // 前端：500.50元
```

---

## ⚠️ 注意事项

### 1. 状态控制
- 只有**初始状态（STATUS_INIT_INT = 0）**的外销单可以添加/删除项目明细
- 其他状态操作会抛出异常：`外销单状态不可操作`

### 2. 金额单位
- 所有金额字段单位为**分**，前端需要转换
- 前端显示时除以100，后端保存时乘以100

### 3. 数值精度
- 使用 `Arith` 工具类进行精确计算，避免 JavaScript 浮点数精度问题
- 小计自动计算：`total = price × num`

### 4. 必填字段
添加项目明细时，以下字段必填：
- `oales.oid` - 外销单ID
- `oalesItem.name` - 商品名称
- `oalesItem.price` - 价格
- `oalesItem.num` - 数量（必须 > 0）

### 5. 自动更新
- 添加/删除项目明细后，外销单总金额（`oales.total`）会自动更新
- 事务控制：添加失败会回滚，不会产生脏数据

---

## 🔍 错误码说明

| 错误码 | 错误信息 | 说明 | 解决方案 |
|-------|---------|------|---------|
| 400001 | 外销单不存在 | 指定的oid不存在 | 检查oid是否正确 |
| 400002 | 外销单状态不可操作 | 外销单不是初始状态 | 确认外销单状态 |
| 400003 | 商品名称不能为空 | name字段为空 | 填写商品名称 |
| 400004 | 价格不能为空且不能小于0 | price字段不合法 | 检查price值 |
| 400005 | 数量必须大于0 | num字段不合法 | 检查num值 |
| 400006 | 项目明细不存在 | 指定的oiid不存在 | 检查oiid是否正确 |

---

## 🚀 快速开始

### Step 1: 执行数据库建表
```bash
# 使用数据库查询工具
D:/Python/Python38/python.exe .claude/skills/simple_query.py test "$(cat sql/create_oalesitem_table.sql)" sales
```

### Step 2: 验证后端接口
```bash
# 测试分页查询接口
curl -X POST http://localhost:8080/Rhadamanthus/pageOalesItem.do \
  -d "page.pageNo=1&page.pageSize=20&oalesItem.oid=123"
```

### Step 3: 前端集成
```javascript
// 确保API已加载（Api().init()会自动加载）
// 直接调用接口
com.post(api.oalesItem.pageOalesItem, {
    "page.pageNo": 1,
    "page.pageSize": 20,
    "oalesItem.oid": 123
}, callback);
```

---

## 📚 相关文档

- [Sales 模块文档](../../src/com/fanglin/sales/CLAUDE.md)
- [OalesPO 定义](../../src/com/fanglin/sales/po/OalesPO.java)
- [API 接口规范](../../docs/API.md)
- [前端架构文档](../../WebContent/CLAUDE.md)

---

## 📝 变更记录

| 日期 | 版本 | 变更内容 |
|------|------|---------|
| 2026-03-17 | 1.0.0 | 初始版本，完成 OalesItem 完整功能开发 |

---

**维护者**: AI Assistant
**技术支持**: 参考项目根目录 CLAUDE.md
