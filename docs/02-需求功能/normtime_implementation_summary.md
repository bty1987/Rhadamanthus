# Normtime 模块开发完成总结

## ✅ 已完成工作

### 1. 数据库表结构
- ✅ **SQL 脚本**: `sql/add_normtime_table.sql`
  - `data.normtime` - 标准工期定额表
  - `quotation.normtimeitem` - 报价单工期明细表

### 2. 后端 Java 代码

#### data.normtime 模块 (标准工期定额)
| 文件 | 路径 |
|------|------|
| **PO** | `src/com/fanglin/data/po/NormtimePO.java` |
| **VO** | `src/com/fanglin/data/quotation/vo/NormtimeVO.java` |
| **DAO** | `src/com/fanglin/data/quotation/dao/NormtimeDao.java` |
| **DAO实现** | `src/com/fanglin/data/quotation/dao/impl/NormtimeDaoImpl.java` |
| **Service** | `src/com/fanglin/data/quotation/service/NormtimeService.java` |
| **Service实现** | `src/com/fanglin/data/quotation/service/impl/NormtimeServiceImpl.java` |
| **Action** | `src/com/fanglin/data/quotation/action/NormtimeAction.java` |

#### quotation.normtimeitem 模块 (报价单工期明细)
| 文件 | 路径 |
|------|------|
| **PO** | `src/com/fanglin/quotation/po/NormtimeItemPO.java` |
| **VO** | `src/com/fanglin/quotation/vo/NormtimeItemVO.java` |
| **DAO** | `src/com/fanglin/quotation/dao/NormtimeItemDao.java` |
| **DAO实现** | `src/com/fanglin/quotation/dao/impl/NormtimeItemDaoImpl.java` |
| **Service** | `src/com/fanglin/quotation/service/NormtimeItemService.java` |
| **Service实现** | `src/com/fanglin/quotation/service/impl/NormtimeItemServiceImpl.java` |
| **Action** | `src/com/fanglin/quotation/action/NormtimeItemAction.java` |

### 3. 前端文件
- ✅ **HTML**: `WebContent/views/data/normtime.html`
- ✅ **JavaScript**: `WebContent/js/data/normtime.js`
- ✅ **API 定义**: 已添加到 `WebContent/js/api/data.js`
- ✅ **查询条件配置**: 已添加到 `WebContent/js/condition/data.js` (新增 4 个查询条件)

### 4. 数据库常量数据
- ✅ **SQL 脚本**: `sql/add_normtime_status_constant.sql` (新建)
  - 定义了 normtime.status 字段的数据字典常量（0: 有效, 1: 无效）

---

## 🔑 核心修改对比

| 项目 | normrice (工费定额) | normtime (工期定额) |
|------|---------------------|---------------------|
| **主键** | `npid` | `ntid` |
| **明细主键** | `npiid` | `ntiid` |
| **金额字段** | `salary` (工费) | `workdays` (工时天数) |
| **额外字段** | `stuff` (材料费) | ~~删除~~ |
| **数据类型** | `int` | `BigDecimal(10,2)` |
| **单位** | 分 (整数) | 天 (支持小数) |

---

## 🔌 API 接口列表

### data.normtime 模块
```
POST /pageNormtime.do            - 分页查询标准工期定额
POST /queryNormtimeByQiid.do     - 根据报价项ID查询工期定额
POST /addNormtime.do             - 新增标准工期定额
POST /deleteNormtime.do          - 删除标准工期定额
```

### quotation.normtimeitem 模块
```
POST /queryNormtimeItem.do       - 查询报价单工期明细
POST /addNormtimeItem.do         - 添加报价单工期明细
POST /deleteNormtimeItem.do      - 删除报价单工期明细
```

---

## ⚙️ 常量定义

### NormtimeItemPO 类型常量
```java
TYPE_OFFER_INT = 0          // 报价项
TYPE_EXPAND_INT = 1         // 增项
TYPE_ADDCUT_INT = 2         // 增减项
TYPE_QUOTA_INT = 3          // 定额

NORMTYPE_WORKDAYS_INT = 0   // 工期型定额
NORMTYPE_ADD_INT = 1        // 附加型定额

ATTTYPE_COLLECTION_INT = 0  // 计入
ATTTYPE_SUB_INT = 1         // 扣减
```

---

## 🚀 部署步骤

### 1. 执行数据库脚本
```bash
mysql -u用户名 -p密码 < sql/add_normtime_table.sql
```

### 2. 编译项目
```bash
mvn clean package
```

### 3. 部署到 Tomcat
```bash
# 复制 WAR 包到 Tomcat webapps 目录
cp target/Rhadamanthus.war /path/to/tomcat/webapps/

# 重启 Tomcat
./bin/shutdown.sh
./bin/startup.sh
```

### 4. 验证接口
```bash
# 分页查询测试
curl -X POST http://localhost:8080/Rhadamanthus/pageNormtime.do \
  -d "page.pageNo=1" \
  -d "page.pageSize=20"

# 新增测试
curl -X POST http://localhost:8080/Rhadamanthus/addNormtime.do \
  -d "normtime.constructionNode.cnid=1" \
  -d "normtime.unit=天" \
  -d "normtime.workdays=2.5"
```

---

## 📝 待配置项

### 1. 导航菜单配置 (可选)
如果需要在系统菜单中显示"定额工期"管理页面，需要在数据库中添加菜单配置：

```sql
-- 示例：添加到系统菜单表
INSERT INTO system_module (mid, name, url, icon, parent_id)
VALUES ('normtime', '定额工期', '/views/data/normtime.html', 'icon-time', 'data_management_id');
```

### 2. 权限配置 (可选)
为不同角色分配定额工期模块的访问权限：

```sql
-- 示例：为管理员角色分配权限
INSERT INTO system_role_module (role_id, module_id)
VALUES (1, 'normtime');
```

### 3. 常量补充 (可选)
如果需要在其他地方引用 normtime 状态常量，可以在以下文件中补充：

**文件**: `WebContent/js/data/constant.js`
```javascript
normtime: {
    status: {
        keys: [
            { key: 0, value: '有效' },
            { key: 1, value: '无效' }
        ]
    }
}
```

---

## 🧪 测试清单

### 功能测试
- [ ] 分页查询标准工期定额
- [ ] 新增标准工期定额
- [ ] 编辑标准工期定额
- [ ] 删除标准工期定额
- [ ] 根据报价项查询工期定额
- [ ] 批量导入工期定额（Excel）
- [ ] 查询报价单工期明细
- [ ] 添加报价单工期明细
- [ ] 删除报价单工期明细

### 数据验证
- [ ] workdays 字段支持小数（如 1.5 天）
- [ ] trannum 转换量计算正确
- [ ] 施工节点关联正确
- [ ] 报价项关联正确
- [ ] 状态过滤有效

### 异常处理
- [ ] 必填字段验证（施工节点、单位、工时天数）
- [ ] 数据类型验证（工时天数为数字）
- [ ] 重复提交拦截
- [ ] 权限控制
- [ ] 登录超时处理

---

## 🐛 已知问题

暂无

---

## 🔍 查询条件配置详解 (2025-12-31 更新)

### 配置位置
**文件**: `WebContent/js/condition/data.js` (第 1977-2029 行)

### 新增查询条件列表

| 条件ID | 标签 | 类型 | 字段名 | 操作符 | 数据源 |
|--------|------|------|--------|--------|--------|
| `normtime-quotationItem` | 报价项 | text | quotationItem.name | eq (精确) | 用户输入 |
| `normtime-quotation-version` | 报价版本 | select | quotationItem.quotationVersion.no | eq (精确) | API动态加载 |
| `normtime-constructionNode` | 施工节点 | text | constructionNode.name | eq (精确) | 用户输入 |
| `normtime-status` | 状态 | select | status | eq (精确) | 常量数据 |

### 配置示例

#### 1. 报价项查询（文本输入）
```javascript
"normtime-quotationItem": {
    label: "报价项",
    type: "text",               // 文本输入框
    submitConfig: {
        name: "quotationItem.name",  // 后台接收的字段名
        op: "eq",                    // 精确匹配
        validate: null
    }
}
```

#### 2. 报价版本查询（下拉选择 - 动态数据源）
```javascript
"normtime-quotation-version": {
    label: "报价版本",
    type: "select",             // 下拉选择框
    submitConfig: {
        name: "quotationItem.quotationVersion.no",
        op: "eq",
        validate: null
    },
    dataSource: {
        url: api.quotation.queryQuotationVersion,  // 后台API
        postData: {},
        listPath: "quotationVersions",  // 响应数据路径
        keyPath: "no",               // 提交值字段
        valuePath: "name"            // 显示值字段
    }
}
```

#### 3. 施工节点查询（文本输入）
```javascript
"normtime-constructionNode": {
    label: "施工节点",
    type: "text",
    submitConfig: {
        name: "constructionNode.name",
        op: "eq",
        validate: null
    }
}
```

#### 4. 状态查询（下拉选择 - 静态常量）
```javascript
"normtime-status": {
    label: "状态",
    type: "select",
    submitConfig: {
        name: "status",
        op: "eq",
        validate: null
    },
    dataSource: {
        url: null,              // 静态数据源
        postData: null,
        listPath: constant.data().normtime.status.datas,  // 从常量获取
        keyPath: "key",
        valuePath: "value"
    }
}
```

### 前端使用方式
在 `normtime.js` 中声明查询条件：
```javascript
searcher.condition([
    "data-normtime-quotationItem",
    "data-normtime-quotation-version",
    "data-normtime-constructionNode",
    "data-normtime-status"
]);
```

### 数据流程
```
用户输入 → condition/data.js 渲染表单 → 前端组装参数
    ↓
后台 Action.getFilters() → List<Filter> 对象
    ↓
Service 层处理 → 转换为 Hibernate Criterion
    ↓
DAO 层执行 SQL 查询 → 返回结果
```

### 常量数据配置
**SQL 脚本**: `sql/add_normtime_status_constant.sql`

```sql
INSERT INTO `constant` (`name`, `module`, `clazz`, `type`, `field`, `key`, `value`, `status`)
VALUES
('有效', 'data', 'normtime', 'status', 'status', '0', '有效', 0),
('无效', 'data', 'normtime', 'status', 'status', '1', '无效', 0);
```

**前端访问**: `constant.data().normtime.status.datas`

**返回格式**:
```javascript
[
    {key: "0", value: "有效"},
    {key: "1", value: "无效"}
]
```

### 后台自动支持
后台无需修改代码，`BaseListAction` 自动处理：
1. 接收前端 filters 参数
2. 转换为 `List<Filter>` 对象
3. Service 层使用 `GenericDaoImpl.PagingQuery` 处理
4. 自动生成 Hibernate Criterion
5. 执行 SQL 查询并返回结果

---

## 📚 相关文档

- **后端架构**: `src/com/fanglin/data/quotation/CLAUDE.md`
- **前端架构**: `WebContent/CLAUDE.md`
- **API 文档**: `docs/API.md`
- **normrice 参考模块**: `src/com/fanglin/data/quotation/dao/NormriceDao.java`

---

## 👥 开发者

- **开发**: AI Assistant (Claude)
- **审核**: 待定
- **测试**: 待定
- **上线**: 待定

---

**最后更新**: 2026-03-08
