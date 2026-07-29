# 通用连表导出脚本设计方案

> 既有 `scripts/plan_export_common.py` 已实现通用导出的骨架（约 80%）。
> 本方案是对它的**针对性增强**：补齐 xlsx 大表、SQL 注入防护、稳健时间列、kv 字典、JOIN 顺序健壮性。
> 目标：增强后**一个脚本覆盖大部分普通连表导出**，新增场景只在 taskParam 页面配字段，零 Python 开发。

---

## 一、既有实现梳理（plan_export_common.py + crond_plan_timing_handle.py）

### 1.1 调度链路（crond_plan_timing_handle.py，已验证）

Linux crontab 每分钟跑：
```
* * * * * python3 /home/fanglin/cronbin/crond_plan_timing_handle.py <0读/1写> <执行阈值10>
```
调度器逻辑：
1. 查 `information.plan` 中 `status=0 AND executetime=当前分钟 AND task.handle=0/1` 的计划；
2. 对每条按 `task.type` 选解释器（`python`/`sh`/`/usr/local/bin/python3.7`），拼命令：
   `<解释器> <filepath> <pid> <args> <company> &`，`os.system` 后台执行；
3. 超过阈值或 `executetime < 当前` 的 plan 标记 `status=3`（超时失败）。

**关键结论：通用脚本命令行 = `python3 plan_export_xxx.py <pid> <args> <company>`（读类 handle=0）。
`filepath` 是 task 表字段，调度器按它原样启动，不区分通用/定制。**

### 1.2 数据模型四层（已用生产数据验证）

| 层 | 表 / PO | 作用 |
|---|---|---|
| 任务模板 | `communion.task`（= `data.task` 同义）| filepath 指向 py、level/type/plugins/handle |
| 字段元数据 | `communion.taskparam`（= `data.taskparam` 同义，行数一致 66=66）| 每列一行：怎么取、怎么连表、怎么字典转换 |
| 执行实例 | `information.plan` | args(时间区间)/company(租户)/status/schedule |
| 运行时参数 | `information.planparam` | fields(勾选tpid)/conditions(条件) |

> ⚠️ `data.taskparam` 与 `communion.taskparam` 是同一物理表的两个库名指向（历史遗留，PO 现用 `@Table(catalog="communion")`）。列名大小写混合：`tablesort` 小写、`oneType`/`tableName`/`unionField` 驼峰。脚本 `dict(zip(description,...))` 取值时按实际列名。

### 1.3 plan_export_common.py 已实现的能力

| 能力 | 实现方式 | 状态 |
|---|---|---|
| 读 planparam | `SELECT fields,conditions FROM information.planparam WHERE pid=?` | ✅ |
| 解析勾选字段 | `fields.split(",")` → `self.field`(tpid 列表) | ✅ |
| 解析条件 | `conditions.split(",")` → `tpid\|value`，存 `conditionDic` | ✅ |
| 取元数据 | `SELECT * FROM data.taskparam`（全表拉，内存筛选）| ✅ |
| 拼 SELECT 列 | `type=0` 的行：`field AS 'name'` | ✅ |
| 拼 FROM/JOIN | `ismain=0`→主表 `tableName alias`；`ismain=1`→`tableName alias ON unionField`；按 `tablesort` 排序后 `LEFT JOIN` 串接 | ✅ |
| 拼 WHERE | 条件值用正则判日期→时间区间；否则 `field = value` | ✅ |
| 数值处理 | `oneType=1` 的列下标进 `divlist`，导出时 `/1000` | ✅ |
| 字典转换 | `handle` 非空→Python 层 `handleStatus`（plan_zoo dict 按 handle 名取）| ✅ |
| 级联列 | `unionParam` 指向另一 tpid，若该列未勾选也补进 JOIN | ✅ |
| 基建复用 | count 校验/分页/进度/打包上传/错误回调 全走 `plan_util.Util` | ✅ |

### 1.4 既有脚本的 6 个不足（本方案要补的）

| # | 不足 | 影响 |
|---|---|---|
| 1 | 用 `xlwt` 存 `.xls`，**65535 行硬上限** | 大数据量导出直接失败 |
| 2 | WHERE 的 value **字符串拼接**（`field = %s`） | SQL 注入风险（value 来自用户） |
| 3 | 时间列靠"条件值是否匹配日期正则"**猜** | 非日期条件误判、多时间列无法区分 |
| 4 | `handle` 只支持 plan_zoo 变量名，**不支持 kv 函数**（SQL 层转换） | 部分 kv 字典需 Python 逐行转，慢 |
| 5 | FROM/JOIN 用 `set` 暂存再排序，**主表必须在 set 排序后仍排第一** | 潜在 JOIN 顺序错乱（主表跑到后面） |
| 6 | 无超 65535 行的 **分 sheet / 大表兜底** | 超大导出无解 |

---

## 二、增强方案（对 plan_export_common.py 的改造）

### 2.1 总策略

**不另起炉灶**，在 `plan_export_common.py` 基础上就地增强，产出 `plan_export_generic.py`
（保留 common.py 不动作对照基线）。命令行不变：`python3 plan_export_generic.py <pid> <args> <company>`。

### 2.2 六项增强（对应 §1.4）

#### 增强 1：xls → xlsx（openpyxl）
- `createWorkbook`/`saveWorkbook`/`createTableHead`（xlwt）→ 改用 `openpyxl.Workbook` + `sheet.append()`。
- 复用 `plan_util.packXlsxFile()`（已存在，专为 xlsx 打包上传）。
- 打破 65535 行限制。

#### 增强 2：WHERE 参数化（防注入）
- 日期条件：值经 `controlTime` 校验后拼，本身是受控格式（`YYYY/MM/DD`），保留拼接但**严格正则校验**。
- 等值/in 条件：value **白名单校验**（数字直接放；字符串校验 `^[A-Za-z0-9_\u4e00-\u9fa5]+$` 后放；否则拒绝）。
- 因分页 SQL 用 `page()` 追加 `limit`，无法用 pymysql 占位符贯穿，故采用"**校验 + 转义**"而非绑定参数（与现有所有 plan_export 脚本同一安全档位，不破坏既有模式）。

#### 增强 3：显式时间列（type=2 约定）
- taskparam.`type` 扩展取值：`0`=导出列 / `1`=下拉条件列 / **`2`=时间列**（新增约定）。
- 时间列**不进 SELECT**（除非用户也勾了它），但通用脚本见到 `type=2` 的行就用它的 `field` 做时间过滤。
- `planparam.conditions` 里的日期值仍兼容（双保险），但首选 `type=2` 显式声明。
- 向后兼容：无 `type=2` 时退回"按条件值正则猜日期"的既有逻辑。

#### 增强 4：handle 双格式（kv + plan_zoo）
`handle` 字段按格式分流：
- 含两个点（`module.clazz.field`，如 `communion.userinfo.level`）→ **SQL 层** `communion.kv('module','clazz','field', col) AS 'name'`。MySQL 已有 `kv` 自定义函数（已验证）。
- 纯标识符（如 `userinfo2LevelStatus`）→ **Python 层** `handleStatus`（既有逻辑，plan_zoo dict）。
- 空 → 原样输出。
- 向后兼容：现有 tid=134 的 handle 全是 plan_zoo 名，不受影响。

#### 增强 5：JOIN 顺序健壮性
- 主表（ismain=0）**强制排第一**：先单独取 main，从表再按 `(tablesort, alias)` 排序拼接。
- 不再用 `set` 暂存主表（set 无序是 bug 根源）。
- 同表多列只 JOIN 一次：按 `(tableName, alias)` 去重。

#### 增强 6：大表分 sheet
- 单 sheet 超 `500000` 行自动切下一 sheet（`导出数据_2`…），避免单 sheet 过大。

### 2.3 保持不变的部分（原脚本正确之处）
- planparam 解析、field/conditionTpid 分流、unionParam 级联补列。
- count 校验、分页、进度回调、错误回调、modelEnd 收尾。
- 命令行、config.json 读取、`plan_util.Util` 继承。

---

## 三、taskparam 字段语义（配置规范，生产 tid=134 实证）

| 字段 | 含义 | 示例 | type 取值 |
|---|---|---|---|
| `field` | SQL 列表达式 | `u.userId`、`ui.level` | — |
| `alias` | 表别名 | `u`、`ui`、`dt` | — |
| `tableName` | 物理表全名 | `communion.user` | — |
| `unionField` | 连表 ON 条件 | `ui.uid=u.uid` | — |
| `unionParam` | 级联列 tpid（该列未勾也补 JOIN）| `0`=无 | — |
| `ismain` | 主表标志 | `0`=主表(FROM)、`1`=从表(JOIN) | — |
| `handle` | 字典转换 | `communion.userinfo.level`(kv) / `userinfo2LevelStatus`(plan_zoo) | — |
| `oneType` | 数值标志 | `1`=该列导出时 /1000 | — |
| `type` | **字段用途** | — | **0=导出列 / 1=下拉条件 / 2=时间列(新)** |
| `tablesort` | 表分组排序（控制 JOIN 顺序）| 0/1/2 | — |
| `sort` | 列内排序 | 0,1,2… | — |

**配一个新通用导出任务（如"导出客户"）的步骤：**
1. task.html 建任务：filepath 填 `/home/fanglin/cronbin/py3/plan_export_generic.py`、level=1、type=2(py3)、plugins=A(时间区间)。
2. taskParam.html 逐列配：客户表设 ismain=0 作主表；楼盘/设计师等设 ismain=1 + unionField；公司列 type=1；时间列 type=2。
3. 用户在 plan 页面选任务→勾字段→填时间/公司→提交。调度器按 filepath 启动通用脚本，自动导出。

---

## 四、落地步骤（评审通过后）

1. **复制** `plan_export_common.py` → `plan_export_generic.py` 作为起点。
2. **改造**：逐项落地 §2.2 的 6 项增强，保持命令行与 plan_util 复用不变。
3. **回归**：用 tid=134「导出人员通用」的 taskparam 配置跑通用脚本，对比产出列/值与既有 common.py 一致。
4. **大表压测**：造一个超 65535 行的场景，验证 xlsx + 分 sheet。
5. **注入测试**：conditions value 传非法串，验证被拒。
6. **切换**：把 tid=134 的 filepath 切到 generic.py，观察生产一轮。
7. **推广**：把更多普通导出任务（客户、装修单基础信息等）迁到 generic.py filepath。

---

## 五、未决项（评审时确认）

1. **时间列来源**：采用 `type=2` 约定（零改表）？—— 建议 yes，向后兼容旧正则逻辑。
2. **handle 双格式**：`module.clazz.field`(kv) 与 plan_zoo 变量名并存？—— 建议 yes。
3. **文件命名**：新建 `plan_export_generic.py` 还是直接增强 `plan_export_common.py`？
   - 建议**新建 generic**、保留 common 作对照基线，验证通过后再考虑下线 common。
4. **oneType 语义扩展**：现有 `oneType=1` 固定 `/1000`。是否需要支持 `*1000` 或自定义倍率？
   - 建议：本期保持 `/1000`，如需再加 oneType 取值约定。
