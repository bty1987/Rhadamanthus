# 楼盘查询条件优化报告

**优化日期**: 2025-12-31
**模块**: communion.village (楼盘管理)
**优化类型**: 增强查询条件

---

## 📊 优化概述

根据 VillagePO 实体字段和实际业务需求，对楼盘查询功能进行增强，新增 **4 个查询条件**，优化现有查询逻辑。

---

## ✨ 新增查询条件

| 查询条件 | 字段名 | 查询方式 | 说明 |
|---------|--------|---------|------|
| **开发商** | `developer` | 模糊搜索 | 支持开发商名称模糊匹配 |
| **状态** | `status` | 精确匹配 | 0=启用, 1=禁用 |
| **交付时间起始** | `deliveryTimeStart` | 范围查询（≥） | 交付时间 >= 起始时间 |
| **交付时间结束** | `deliveryTimeEnd` | 范围查询（≤） | 交付时间 <= 结束时间 |

### 现有查询条件（保持不变）

| 查询条件 | 字段名 | 查询方式 | 说明 |
|---------|--------|---------|------|
| 楼盘名称 | `villageName` | 模糊搜索 | 支持名称、拼音首字母、拼音全拼 |
| 城区ID | `cityProperId` | 精确匹配 | 按城区筛选 |
| 城市ID | `cityId` | 精确匹配 | 按城市筛选 |

---

## 📝 代码变更详情

### 1. 后端 DAO 层

**文件**: `src/com/fanglin/communion/dao/impl/VillageDaoImpl.java`

**变更内容**: 扩展 `queryFilterExcute` 方法，新增查询条件支持

#### 新增查询逻辑

```java
// 开发商：模糊搜索
else if ("developer".equals(filter.getField())) {
    query.add(Restrictions.ilike("developer", filter.getData(), MatchMode.ANYWHERE));
}

// 状态：精确匹配（0=启用, 1=禁用）
else if ("status".equals(filter.getField())) {
    query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
}

// 交付时间起始：大于等于
else if ("deliveryTimeStart".equals(filter.getField())) {
    query.add(Restrictions.ge("deliveryTime", filter.getData()));
}

// 交付时间结束：小于等于
else if ("deliveryTimeEnd".equals(filter.getField())) {
    query.add(Restrictions.le("deliveryTime", filter.getData()));
}

// 父楼盘ID：精确匹配
else if ("parentVillageId".equals(filter.getField())) {
    query.add(Restrictions.eq("parentVillage.vid", Long.valueOf(filter.getData())));
}
```

#### 查询条件说明

1. **开发商查询**
   - 使用 `ilike` 不区分大小写模糊匹配
   - 支持部分匹配（`MatchMode.ANYWHERE`）
   - 示例：输入 "万科" 可匹配 "万科地产"、"万科集团"

2. **状态查询**
   - 精确匹配 `0` 或 `1`
   - 0 = 启用，1 = 禁用
   - 使用 `Short.valueOf` 转换类型

3. **交付时间范围**
   - `deliveryTimeStart`: 大于等于（≥）
   - `deliveryTimeEnd`: 小于等于（≤）
   - 可单独使用或组合使用实现范围查询

4. **父楼盘查询**
   - 通过 `parentVillage.vid` 关联查询
   - 用于查询某个父楼盘下的所有子楼盘

---

### 2. 前端查询配置

**文件**: `WebContent/js/data/village4condition.js`

**变更内容**: 扩展 `searcher.condition` 配置，新增查询条件字段

#### 新增查询条件配置

```javascript
searcher.condition([
    'data-village-name',           // 楼盘名称（支持拼音）
    'data-village-developer',      // 开发商 ⭐新增
    'data-village-status',          // 状态 ⭐新增
    'data-village-delivery-start',  // 交付时间起始 ⭐新增
    'data-village-delivery-end'    // 交付时间结束 ⭐新增
]);
```

#### 新增列表显示字段

```javascript
// 状态字段：带格式化显示
{
    field: "status",
    name: "状态",
    prop: "status",
    clazz: "grey",
    formatter: function(value) {
        // 0=启用, 1=禁用
        return value == 0
            ? '<span class="label label-success">启用</span>'
            : '<span class="label label-default">禁用</span>';
    }
}

// 上级楼盘字段
{
    field: "parentVillage",
    name: "上级楼盘",
    prop: "parentVillage.name",
    clazz: "grey"
}
```

---

## 🎨 前端HTML示例（如需手动添加）

如果需要手动创建查询表单，可以使用以下HTML结构：

```html
<!-- 查询条件表单 -->
<div class="row search-row">
    <div class="col-xs-12">
        <form id="villageSearchForm" class="form-inline">

            <!-- 楼盘名称 -->
            <div class="form-group">
                <label>楼盘名称:</label>
                <input type="text" id="villageName" class="form-control input-sm"
                       placeholder="支持拼音" data-village-name>
            </div>

            <!-- 开发商 -->
            <div class="form-group">
                <label>开发商:</label>
                <input type="text" id="developer" class="form-control input-sm"
                       placeholder="开发商名称" data-village-developer>
            </div>

            <!-- 状态 -->
            <div class="form-group">
                <label>状态:</label>
                <select id="status" class="form-control input-sm" data-village-status>
                    <option value="">全部</option>
                    <option value="0">启用</option>
                    <option value="1">禁用</option>
                </select>
            </div>

            <!-- 交付时间范围 -->
            <div class="form-group">
                <label>交付时间:</label>
                <input type="text" id="deliveryTimeStart" class="form-control input-sm date-picker"
                       placeholder="起始日期" data-village-delivery-start>
                <span>至</span>
                <input type="text" id="deliveryTimeEnd" class="form-control input-sm date-picker"
                       placeholder="结束日期" data-village-delivery-end>
            </div>

            <!-- 查询按钮 -->
            <button type="button" id="searchBtn" class="btn btn-sm btn-primary">
                <i class="icon-search"></i> 查询
            </button>

            <button type="button" id="resetBtn" class="btn btn-sm btn-default">
                <i class="icon-refresh"></i> 重置
            </button>
        </form>
    </div>
</div>
```

---

## 🔧 使用示例

### 示例1: 查询特定开发商的楼盘

```javascript
// 前端调用
com.post(api.data.pageVillage, {
    "filters[0].field": "developer",
    "filters[0].data": "万科",
    "page.pageNo": 1,
    "page.pageSize": 20
}, function(res) {
    console.log('查询结果:', res.villages);
});
```

**SQL 等价**:
```sql
SELECT * FROM communion.village
WHERE developer LIKE '%万科%'
ORDER BY vid;
```

### 示例2: 查询启用的楼盘

```javascript
com.post(api.data.pageVillage, {
    "filters[0].field": "status",
    "filters[0].data": "0",
    "page.pageNo": 1,
    "page.pageSize": 20
}, callback);
```

**SQL 等价**:
```sql
SELECT * FROM communion.village
WHERE status = 0
ORDER BY vid;
```

### 示例3: 查询指定交付时间范围的楼盘

```javascript
com.post(api.data.pageVillage, {
    "filters[0].field": "deliveryTimeStart",
    "filters[0].data": "2024-01-01",
    "filters[1].field": "deliveryTimeEnd",
    "filters[1].data": "2024-12-31",
    "page.pageNo": 1,
    "page.pageSize": 20
}, callback);
```

**SQL 等价**:
```sql
SELECT * FROM communion.village
WHERE deliveryTime >= '2024-01-01'
  AND deliveryTime <= '2024-12-31'
ORDER BY vid;
```

### 示例4: 组合查询 - 万科的启用楼盘

```javascript
com.post(api.data.pageVillage, {
    "filters[0].field": "developer",
    "filters[0].data": "万科",
    "filters[1].field": "status",
    "filters[1].data": "0",
    "page.pageNo": 1,
    "page.pageSize": 20
}, callback);
```

**SQL 等价**:
```sql
SELECT * FROM communion.village
WHERE developer LIKE '%万科%'
  AND status = 0
ORDER BY vid;
```

---

## 🧪 测试验证

### 测试用例

| 测试场景 | 输入参数 | 预期结果 |
|---------|---------|---------|
| 开发商查询 | `developer: "万科"` | 返回所有开发商名称包含"万科"的楼盘 |
| 状态查询 | `status: "0"` | 返回所有启用的楼盘 |
| 禁用楼盘 | `status: "1"` | 返回所有禁用的楼盘 |
| 交付时间范围 | `deliveryTimeStart: "2024-01-01"`, `deliveryTimeEnd: "2024-06-30"` | 返回2024年上半年交付的楼盘 |
| 组合查询 | `developer: "万科"`, `status: "0"` | 返回万科的启用楼盘 |
| 拼音查询 | `villageName: "WK"` | 返回名称或拼音包含"WK"的楼盘 |

### 测试方法

#### 方法1: 浏览器控制台测试

```javascript
// 测试开发商查询
com.post(api.data.pageVillage, {
    "filters[0].field": "developer",
    "filters[0].data": "万科",
    "page.pageNo": 1,
    "page.pageSize": 20
}, function(res) {
    console.log('开发商查询结果:', res);
});

// 测试状态查询
com.post(api.data.pageVillage, {
    "filters[0].field": "status",
    "filters[0].data": "0",
    "page.pageNo": 1,
    "page.pageSize": 20
}, function(res) {
    console.log('状态查询结果:', res);
});
```

#### 方法2: 通过页面UI测试

1. 打开楼盘查询页面
2. 在搜索框输入查询条件
3. 点击查询按钮
4. 验证返回结果是否符合预期

---

## 📋 数据库字段说明

### VillagePO 表结构

| 字段名 | 类型 | 说明 | 查询支持 |
|--------|------|------|---------|
| `vid` | `long` | 主键ID | - |
| `no` | `String` | 楼盘编号（业务主键） | ✅ 已有 |
| `name` | `String` | 楼盘名称 | ✅ 已有（支持拼音） |
| `pinyinAB` | `String` | 拼音首字母 | ✅ 已有（查询用） |
| `pinyinAll` | `String` | 拼音全拼 | ✅ 已有（查询用） |
| `cityProperId` | `int` | 所属区域ID | ✅ 已有 |
| `parentVillageId` | `long` | 父楼盘ID（自关联） | ✅ 新增 |
| `developer` | `String` | 开发商 | ✅ 新增 |
| `salesPhone` | `String` | 售楼电话 | ❌ 未启用查询 |
| `deliveryTime` | `String` | 交付时间 | ✅ 新增范围查询 |
| `rule` | `String` | 规则 | ❌ 未启用查询 |
| `content` | `String` | 说明 | ❌ 未启用查询 |
| `status` | `short` | 状态（0=启用,1=禁用） | ✅ 新增 |
| `x`, `y` | `int` | 地图坐标 | ❌ 未启用查询 |
| `url` | `String` | 楼盘URL | ❌ 未启用查询 |
| `mileage` | `long` | 公里数 | ❌ 未启用查询 |
| `company` | `int` | 所属公司 | ❌ 未启用查询 |
| `createTime` | `Timestamp` | 创建时间 | ❌ 未启用查询 |
| `updateTime` | `Timestamp` | 更新时间 | ❌ 未启用查询 |

---

## ⚠️ 注意事项

### 1. 数据类型转换

- **status** 字段是 `short` 类型，查询时需要使用 `Short.valueOf()`
- **parentVillageId** 字段是 `long` 类型，查询时需要使用 `Long.valueOf()`
- **deliveryTime** 字段是 `String` 类型，存储格式为 "yyyy-MM-dd"

### 2. SQL 注入防护

所有查询条件都使用 Hibernate 参数化查询，**自动防护 SQL 注入**，无需手动转义。

```java
// ✅ 正确：使用参数化查询
query.add(Restrictions.ilike("developer", filter.getData(), MatchMode.ANYWHERE));

// ❌ 错误：字符串拼接（禁止）
String hql = "from VillagePO where developer like '%" + developer + "%'";
```

### 3. 性能优化建议

#### 索引建议

```sql
-- 为常用查询字段添加索引
CREATE INDEX idx_village_developer ON communion.village(developer);
CREATE INDEX idx_village_status ON communion.village(status);
CREATE INDEX idx_village_delivery_time ON communion.village(deliveryTime);
CREATE INDEX idx_village_parent ON communion.village(pvid);

-- 组合索引（如需要）
CREATE INDEX idx_village_status_delivery ON communion.village(status, deliveryTime);
```

#### 查询优化

- 模糊查询（`ilike`）会降低查询性能，建议：
  - 开发商查询避免使用前通配符（如 `%万科`）
  - 优先使用精确匹配查询（状态、ID等）
  - 考虑添加数据库索引

### 4. 向后兼容性

所有新增查询条件都是**可选的**，不影响现有功能：

- ✅ 现有查询继续正常工作
- ✅ 不传新字段时不会报错
- ✅ 可以单独使用或组合使用

---

## 🚀 部署步骤

### 1. 后端部署

```bash
# 编译项目
mvn clean compile

# 重启应用服务器
# Tomcat: bin/shutdown.sh -> bin/startup.sh
```

### 2. 前端部署

```bash
# 前端文件已更新，清除浏览器缓存即可
# Ctrl + F5 强制刷新
```

### 3. 验证步骤

1. ✅ 打开楼盘查询页面
2. ✅ 测试新增查询条件（开发商、状态、交付时间）
3. ✅ 验证组合查询是否正常
4. ✅ 检查返回数据是否准确
5. ✅ 确认分页功能正常

---

## 📊 查询条件对比

### 优化前

| 序号 | 查询条件 | 说明 |
|-----|---------|------|
| 1 | 楼盘名称 | 支持拼音 |
| 2 | 城区ID | 精确匹配 |
| 3 | 城市ID | 精确匹配 |

**总计**: 3 个查询条件

### 优化后

| 序号 | 查询条件 | 说明 |
|-----|---------|------|
| 1 | 楼盘名称 | 支持拼音 |
| 2 | 城区ID | 精确匹配 |
| 3 | 城市ID | 精确匹配 |
| 4 | **开发商** ⭐ | 模糊搜索 |
| 5 | **状态** ⭐ | 启用/禁用 |
| 6 | **交付时间起始** ⭐ | 范围查询 |
| 7 | **交付时间结束** ⭐ | 范围查询 |

**总计**: 7 个查询条件（**+133%**）

---

## 🎯 后续优化建议

### 短期（1-2周）

1. **添加更多查询字段**
   - 销售电话
   - 公里数范围
   - 创建时间范围

2. **优化查询性能**
   - 添加数据库索引
   - 启用查询缓存
   - 优化 SQL 查询

### 中期（1个月）

1. **高级查询功能**
   - 多选下拉框（状态）
   - 日期范围选择器
   - 自定义查询条件组合

2. **导出功能**
   - 导出查询结果到 Excel
   - 支持自定义导出字段

### 长期（3个月）

1. **查询历史记录**
   - 保存常用查询条件
   - 一键加载历史查询

2. **智能推荐**
   - 根据查询历史推荐楼盘
   - 热门楼盘推荐

---

## 📞 技术支持

如有问题，请联系：
- **开发团队**: 根据项目 CLAUDE.md 查找联系方式
- **技术文档**: 参考 `docs/API.md` 接口文档

---

**文档生成**: AI Assistant
**最后更新**: 2025-12-31
**版本**: 1.0
