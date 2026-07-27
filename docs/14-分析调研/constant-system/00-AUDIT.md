# 00 · 前台常量体系审计报告

> 审计日期：2026-07-27
> 审计范围：前台 `WebContent/` 常量系统、后台 `communion.constant` 表及 PO/DAO/Service/Action 全链路
> 目的：为后续分批优化提供事实基线

---

## 一、常量系统架构（加载 → 缓存 → 使用 链路）

```
[index.html] 引入 js/com/constant.js（定义 window.constant + window.Constant）
       ↓
[index.js:120] 登录后调用 Constant().init()   （重建 constant 为按模块访问器 + 预加载施工节点）
       ↓
[业务页面] 调用 constant.decoration().decoration.typeness.keys[xxx]
       ↓ （首次调用该模块时触发）
[com/constant.js handle()] 检查 constant[module]["load"] 标志
       ↓ 未加载
[com.post(api.data.queryConstant, ...false)] 同步 AJAX 请求 queryConstant.do
       ↓
[后端 ConstantAction.queryConstant → ConstantServiceImpl]
       ↓ 查 communion.constant 表
返回 List<ConstantVO>（每条含 module/clazz/type/field/key/value/status）
       ↓
[com/constant.js] 写入 constant[module][clazz][type] = { datas/keys/values }
       ↓ 同时把 field 作为常量值挂到 constant[module][clazz][field] = key
       ↓
[业务代码] 两种消费方式：keys[key] 取中文 / datas 喂给 bindData
```

**关键特征**：常量系统是**数据库驱动**的（不是写死在 JS 里的），通过后台 `communion.constant` 表配置，前台按 module/clazz/type 三级维度动态加载。

---

## 二、核心文件清单（绝对路径）

| 角色 | 绝对路径 | 关键行号 |
|------|---------|---------|
| 常量核心引擎 | `D:\ERP\Rhadamanthus\WebContent\js\com\constant.js` | 全文 1-259 |
| API 定义 | `D:\ERP\Rhadamanthus\WebContent\js\api\data.js` | 2119-2121 (queryConstant), 628 (queryConstructionNode) |
| 初始化入口 | `D:\ERP\Rhadamanthus\WebContent\js\index.js` | 120, 441, 962-963 |
| 脚本引入 | `D:\ERP\Rhadamanthus\WebContent\index.html` | 318 |
| 后台 Action | `D:\ERP\Rhadamanthus\src\com\fanglin\communion\action\ConstantAction.java` | 40-46 (queryConstant) |
| 后台 Service | `D:\ERP\Rhadamanthus\src\com\fanglin\communion\service\impl\ConstantServiceImpl.java` | 46-63 |
| PO（表结构） | `D:\ERP\Rhadamanthus\src\com\fanglin\communion\po\ConstantPO.java` | 14, 19-21, 23-39 |
| 常量管理页 | `WebContent\views\data\constant.html` + `WebContent\js\data\constant.js` | CRUD 界面 |
| AJAX 内核 | `D:\ERP\Rhadamanthus\WebContent\js\com\core.js` | 119 (post), 167-172 (async), 227-232 (ajax) |

---

## 三、前台缓存机制详解

### 缓存位置
**单例全局对象 `window.constant`**，整个页面生命周期内驻留。无持久化、无跨页/跨刷新保留。constant.js 中完全没有 `localStorage`/`sessionStorage`/`$.cookie` 调用。

### 内存结构（加载后）
```javascript
constant = {
  // 调用 init() 后，每个模块被替换为"访问器函数"
  decoration: function() { return handle("decoration"); },

  // handle() 加载后写入：
  decoration: {
    "load": true,                          // 模块级"已加载"标志
    "decoration": {
      "typeness":     {keys:{0:"半包",...}, values, datas},
      "projectStatus":{keys:{0:"初始",1:"开工",2:"完工",...}}  // 特殊：见下
    }
  }
}
```

### 三索引一次构建（`constant.js:77-88`）
同一行数据同时建立两个索引——`keys`（key→value，用于显示中文）和 `values`（value→key，反查）；数字 key 会 `parseInt`。纯数字的 key（如 `"0"`）会被转成数字 `0`。

### 特殊镜像——projectStatus（`constant.js:142-216`）
- 施工节点来自**独立的另一个接口** `api.data.queryConstructionNode`，不走 queryConstant
- 前置硬编码 3 个状态：`0=初始 / 1=开工 / 2=完工`（行 194-214）
- 同时镜像到 `constant.data.construction.node` 和 `constant.decoration.decoration.projectStatus`

### 缓存去重标志
- **模块级 `load` 标志**（constant.js:36, 39, 92）：`constant[module]["load"] = true` 表示已发过请求。`handle()` 在 `!clazz && !type` 且 `load=true` 时直接返回缓存。
- **类型节点懒初始化**（constant.js:65-75）：`constant[module][clazz][type]` 不存在时才创建 `{datas:[], keys:{}, values:{}}` 容器。

### 失效/刷新
- 无显式失效 API。
- 切公司时会重新 `Constant().init()`（index.js:441），但 init() 只重建访问器函数 + 重拉施工节点，**不会显式清空已加载模块的 load 标志**——靠访问器函数被整体覆盖来丢弃旧数据。
- 无持久化，F5 刷新或重开标签页就要重新懒加载。

---

## 四、常量使用方式（量化统计）

### 数据规模
- **345 个文件**引用了 `constant.<module>` API
- **3076 处**调用点已常量化（基线良好）
- **1777 条**常量记录，覆盖 **16 个模块 / 191 个类**（来自 `docs/12-规范标准/CONSTANTS.md`）

### 模块使用频次 Top
| 模块 | 引用次数 |
|------|---------|
| `constant.quotation` | 1039 |
| `constant.data` | 504 |
| `constant.customer` | 387 |
| `constant.decoration` | 358 |
| `constant.sales` | 321 |
| `constant.payment` | 270 |
| `constant.personel` | 239 |
| `constant.building` | 186 |

### 三种调用范式

**范式 A：`.keys[key]` 把数字 key 翻成中文（最主流）**
```javascript
// WebContent/js/api/decoration.js:1007
var typeness = constant.decoration().decoration.typeness.keys[decoration.typeness];
```

**范式 B：`.<FIELD_NAME>` 取常量值（直接当枚举量用）**
```javascript
// WebContent/js/sales/sales.js:715
return v.fullpayStatus == constant.sales().sales.FULLPAYSTATUS_INIT_SHORT;
```

**范式 C：`.datas` 喂给 `bindData` 填下拉框**
```javascript
// WebContent/js/data/constant.js:29
constants.items.status.bindData(constant.data().common.status.datas, "key", "value");
```
condition/ 下拉框数据源 196 处用 `.datas`。

### 🔴 新增只读 API 基本未被采用
`Constant().get / valueOf / keyOf / datas`（`constant.js:97-139`）虽然在文件头注释里标榜"推荐新代码使用"，但全代码库**只有 constant.js 自己的注释**引用了它们——**业务代码 0 处使用**。

---

## 五、魔法数 vs 常量对照（量化）

| 维度 | 数据 | 评价 |
|---|---|---|
| 已采用 `constant.xxx()` 常量路径的调用点 | **3076 处** / 345 个文件 | ✅ 基线良好 |
| 仍裸写的 `.status == 0`（"启用"） | **174 处** | 🔴 最泛滥 |
| 仍裸写的 `.status == 1`（"禁用"） | **67 处** | 🔴 |
| status 类魔法数比较总计 | **317 处** | 🔴 |
| 既写魔法数又用 constant 的"混合文件" | 47 个 | ⚠️ 风格不统一 |
| `Constant().get/valueOf/...` 业务调用 | **0 处** | 🔴 形同虚设 |

### 🔴 反例：status 魔法数（最普遍）
```javascript
// WebContent/js/approval/approvalFlow.js:37
prop: function(v) { return v.status == 0 ? "启用" : "禁用"; },

// WebContent/js/sales/sales.js:797  (同一表达式里一半常量一半魔法数)
return [0, 5].indexOf(v.status) != -1 && [1, 2].indexOf(v.fullpayStatus) != constant.sales().sales.FULLPAYSTATUS_INIT_SHORT;

// WebContent/js/decoration/decoration4account.js:1227 等6处
accountBasic.addOwing = utils.accAdd(accountBasic.addOwing, v.status == 0 || v.status == 1 ? v.total : 0);
```

### ✅ 正例：折扣标志完全常量化（标杆）
```javascript
// WebContent/js/quotation/addReducePart.js:341
if ([constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_INT,
     constant.quotation().addReduceItem.DISCOUNT_NODISCOUNT_NON_INT].indexOf(_discountFlag) != -1)
```

---

## 六、后台 `communion.constant` 表结构

### 现有 DDL（来自 `dbs/communion.sql:259-272`）
```sql
CREATE TABLE `constant` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '常量ID',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `module` varchar(64) NULL COMMENT '模块',
  `clazz` varchar(64) NULL DEFAULT '' COMMENT '对象',
  `type` varchar(64) NULL COMMENT '类型',
  `field` varchar(64) NULL COMMENT '字段名',
  `key` varchar(64) NULL COMMENT '键',
  `value` varchar(64) NULL COMMENT '值',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1926 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='常量表';
```

### PO 字段定义（`ConstantPO.java`）
| Java 字段 | 类型 | `@Column` | 备注 |
|---|---|---|---|
| `cid` | `long` | `@Id @GeneratedValue(IDENTITY)` | 主键 |
| `name` | `String` | `name` | 中文名 |
| `module` | `String` | `module` | 模块（quotation/decoration） |
| `clazz` | `String` | `clazz` | 业务对象（quotationAssignUserRule） |
| `type` | `String` | `type` | 字段名（status/priority） |
| `field` | `String` | `field` | 后端 PO 常量名（STATUS_AVAILABLE_INT） |
| `key` | `String` | `` `key` `` | 业务枚举值（反引号转义） |
| `value` | `String` | `value` | 前端显示中文 |
| `status` | `short` | `status` | 0=启用/初始，1=禁用 |

静态常量：`STATUS_ENABLE_INT = 0`、`STATUS_DISABLE_INT = 1`。

### CRUD 链路
`ConstantPO/VO` ↔ `ConstantDao(Impl)` ↔ `ConstantService(Impl)` ↔ `ConstantAction`，Action 暴露 6 个端点：
`pageConstant / queryConstant / addConstant / updateConstant / updateConstantForStatus / deleteConstant`。

### 数据模型
**四元组扁平定位的枚举翻译字典**（非树形、无 parent/group 字段）：
```
module  → clazz  → type    → key   =  value
模块      业务对象   字段名     枚举值    显示文案
```
`field` 列存后端 Java PO 里的常量名，`key` 是实际枚举值，`value` 是前端显示中文。

### 数据灌入
无 Java 代码初始化器，所有种子/增量数据通过 `sqls/` 下按模块组织的 SQL 脚本灌入：
- `sqls/migrate-constants/`（专门迁移子目录）
- `sqls/quotation/50_quotationassign_constant_data.sql`
- `sqls/customer/`、`sqls/construction/`、`sqls/inventory/`、`sqls/material/` 下各有增量脚本
- 文档：`docs/12-规范标准/CONSTANTS.md`（1777 条全量导出）

### 同 schema 相关表
- `constantback`：备份表，结构同 constant（无 updateTime）
- `keyvalue`：注释为"字典表"，字段更精简，**无 PO 对应**
- `systemconfig`：运行时配置表（带 group/company 维度），PO 是 `SystemConfigPO`

---

## 七、🔴 发现的问题清单

### 表结构问题

#### 问题 1：PO 漏映射 `updateTime` 列
DDL 有 `updateTime`，但 `ConstantPO.java` 只映射 9 字段。后果：
- Hibernate 永不维护这列，停在 `DEFAULT CURRENT_TIMESTAMP`（建表瞬间）
- 新增/更新时 updateTime 不会被刷新
- 想审计"谁何时改的"无法实现

#### 问题 2：缺业务唯一约束（数据完整性隐患）
业务键是 `(module, clazz, type, key)` 四元组，但表上**只有主键 cid，无唯一约束**。`sqls/quotation/50_quotationassign_constant_data.sql:8` 注释明确指出此问题。

直接 INSERT 会造出重复 key 脏数据，前台 `constant[module][clazz][type].keys[key]` 会被后插入的覆盖，行为难以排查。

#### 问题 3：`name` 列语义模糊、查询索引缺失
- `name varchar(32) NOT NULL COMMENT '姓名'` —— 注释是"姓名"但实际存"常量集中文名"，注释误导
- `ConstantServiceImpl.queryConstant(module, clazz, type)` 走 `module/clazz/type/status` 组合查询，**这几个列没有联合索引**，表大后全表扫

### 前台缓存性能问题

#### 痛点 1：同步 AJAX 阻塞主线程（最严重）
`constant.js:59` 的 `com.post(..., false)` → `core.js:167-172` → `$.ajax({async:false})`。
首次点击某模块菜单时浏览器整个 UI 冻结，现代浏览器控制台报警告 `Synchronous XMLHttpRequest on the main thread is deprecated`。

#### 痛点 2：切公司后缓存刷新依赖覆盖语义
`index.js:441` 切公司时调 `Constant().init()`，重建访问器函数会丢弃旧数据对象（这点是对的），但 `loadConstructionNodes()` 是异步的，切公司后立即访问 `projectStatus` 可能拿到旧数据。

#### 痛点 3：`index.js:962-963` 标志位不一致
```javascript
if (module && (!constant[module] || !constant[module]["update"])) {
```
检查的是 `["update"]` 标志，但 constant.js 实际只设 `["load"]` 标志。`!constant[module]["update"]` 几乎恒为 true，靠 handle() 内部 load 标志二次去重才不重复发请求——"名字写错却侥幸不爆炸"的雷。

#### 痛点 4：无持久化，刷新即重拉
F5 刷新或重开标签页就要重新懒加载，配合同步阻塞，每次刷新都卡一遍。

### 已做对的（无需改）
- ✅ 模块级 `load` 去重（`constant.js:39-41`）—— 不会重复请求
- ✅ 整模块一次性拉取 —— 请求次数可控（16 模块最多 16 次）
- ✅ `keys/values/datas` 三索引一次构建 —— 后续读取 O(1)

---

## 八、CLAUDE.md 与实现的不一致点（值得记录）

1. CLAUDE.md 行 258 把 `Constant().init()` 描述成 index.html `<head>` 里的 `$(function(){})` 调用，**实际**是在 index.js 的登录回调里调用（index.js:120）。
2. CLAUDE.md 行 556-558 / 1431-1433 描述 queryConstant 带 `cache: "constantData"`，**实际未实现**（api/data.js:2119 无此属性，所有 API 定义文件里都没有 `cache` 关键字）。常量去重完全靠 constant.js 自己的 `load` 标志。
3. CLAUDE.md 把 `ds/*.json` 当作"数据字典"，但实际 `WebContent/ds/` 下除 construction.json/help.json 等少数有真实数据外，decoration.json/data.json 等都是空占位（`{"errorCode":0}`），**与常量系统无关**。常量真实数据完全来自 `communion.constant` 表。

---

## 附：易混淆点

`src/com/fanglin/utils/Constant.java` 是一个 **Java 接口**（`public interface Constant`），定义的是**编译期硬编码常量**（如 `COOKIE_AUTHENTICATION`、`COMMA`、`COLON` 等），与 `communion.constant` 数据库表**完全无关**，仅名字相同。
