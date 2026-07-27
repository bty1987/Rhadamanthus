# P2 · 并发预加载 + approval 模块魔法数收敛

> 实施日期：2026-07-27
> 状态：P2-a ✅ 已完成 / P2-b ✅ approval 模块已完成（示范）

---

## P2-a：登录后并发预加载

### 设计决策（已与你确认）
**选择"仅并发预加载"，不引入 localStorage。** 理由：
- 常量是低频变更、高频读取数据，但缓存不失效会导致业务显示错误数据
- localStorage 的失效机制（MAX(updateTime) 版本号接口或构建号）引入复杂度和风险
- P0（菜单异步预取）+ P2-a（登录后并发预取）已能消除竞态和大部分卡顿
- 刷新页面的成本只是 16 个**并发非阻塞**请求（而非 N 次同步阻塞），可接受

### 改动点

**`WebContent/js/com/constant.js`**：
- 提取 `MODULES` 常量复用（init/preload 共享，避免两份清单漂移）
- 新增 `preload(opts)` 方法：对每个模块调 `handle(module, null, null, {async:true})`，并发异步拉取
- 注释说明安全前提：必须在业务页面加载之前调用（登录回调/切公司回调末尾）

**`WebContent/js/index.js`**：
- 登录回调 `Constant().init()` 之后调 `Constant().preload()`（index.js:120 后）
- 切公司回调 `Constant().init()` 之后调 `Constant().preload()`（index.js:447 后）

### 工作机制
```
登录成功
  → Constant().init()        同步：重建访问器 + 同步加载施工节点
  → Constant().preload()     异步：并发派发 16 个 queryConstant 请求（不阻塞 UI）
  → 用户阅读菜单（数秒窗口）
  → 用户点击菜单
     → index.js:966 Constant().module(module, {async:true})  该模块大概率已 preload 完成
  → 业务页面加载
     → constant.decoration().decoration.typeness.keys[x]
        → handle("decoration") 命中 load=true 同步返回分支，零阻塞
```

### 竞态安全性
异步预取期间 `load` 标志已置位但数据可能未填满。此时若同步访问会拿到未填满对象。
**安全保证**：preload 仅在业务页面加载前调用（登录回调/切公司回调），该窗口内无业务访问。
即使极端情况预取未完成用户就点菜单，最坏退化为原有的同步请求行为（P0 兜底），不会出错。

---

## P2-b：approval 模块 status 魔法数收敛（示范）

### 背景
全库 `.status == 0/1` 魔法数共 317 处。approval 模块作为示范，建立替换范式。

### 🔴 关键语义发现（避免 bug）
替换前必须区分两种 status：

| 常量路径 | key=0 | key=1 | 用途 |
|---|---|---|---|
| `constant.approval().approval.status` | **初始** | **审批通过** | 审批流程状态（不能用于启停判断！）|
| `constant.approval().process.status` | 启用 | 禁用 | process 专属启停 |
| `constant.data().common.status` | 启用 | 禁用 | 通用启停 |

⚠️ 若误用 `constant.approval().approval.status` 替换 flow/form 的启停判断，
会把"初始/审批通过"当成"启用/禁用"，数值碰巧相同但语义完全错误。

### 替换策略
| 文件 | 处数 | 选用常量 | 理由 |
|---|---|---|---|
| `process.js` | 3 | `constant.approval().process.status` | process 有专属启停常量，语义最准 |
| `approvalFlow.js` | 3 | `constant.data().common.status` | flow 无专属常量，用通用启停 |
| `approvalForm.js` | 3 | `constant.data().common.status` | form 无专属常量，用通用启停 |
| `approvalFormCreate.js` | 1 | `constant.data().common.status` | flow 启停判断 |
| `approvalTask.js` | 1 | `constant.data().common.status` | flow 启停判断 |

共 **11 处**，全部收敛。

### 替换范式（三种典型写法）

**① 显示中文（三元 → keys 翻译）**
```diff
- prop: function(v) { return v.status == 0 ? "启用" : "禁用"; },
+ prop: function(v) { return constant.approval().process.status.keys[v.status]; },
```

**② 判断启用（魔法数 → field 常量）**
```diff
- init: function(v) { return v.status == 0; },
+ init: function(v) { return v.status == constant.approval().process.status.STATUS_ENABLE_INT; },
```

**③ 切换状态（魔法数三元 → field 常量三元）**
```diff
- "process.status": v.status == 0 ? 1 : 0
+ "process.status": v.status == constant.approval().process.status.STATUS_ENABLE_INT
+     ? constant.approval().process.status.STATUS_DISABLE_INT
+     : constant.approval().process.status.STATUS_ENABLE_INT
```

### 验证
- [x] 5 个文件 `node --check` 语法通过
- [x] approval 目录 `status == 0/1` 残留清零（11 处 → 0）
- [x] 语义核对：process 用专属常量，flow/form 用通用常量，未误用 approval.approval.status

### 待续
其余模块（balance/building/decoration 等）的 status 魔法数按此范式分批推进。
建议每次一个模块、单独提交，便于回归。

---

## P2-b 续：balance + building 模块收敛

> 实施日期：2026-07-27
> 策略：严格逐处核对 clazz 语义，查对应专属常量替换

### 🔴 关键认知：status 语义因业务对象而异
深挖后发现，`.status == 0` 在不同业务对象里含义千差万别，**绝不能机械替换**：

| 业务对象 | status==0 含义 | status==1 含义 | 对应常量 |
|---|---|---|---|
| balance.balanceDccount | 有效 | 无效 | `constant.balance().balanceDccount.status` |
| balance.balanceCutpay | 初始 | 绑定 | `constant.balance().balanceCutpay.status` |
| building.buildingHouse | 待审核 | 签约 | `constant.building().building.status`（5状态） |
| building.buildingCustomer | 启用 | 禁用 | 无专属，用 `common.status` |
| building.buildingNode | 启用 | （禁用） | 无专属，用 `common.status` |
| building.buildingSchedule | 初始 | （完结=2） | 无专属，语义不符，**保留** |

⚠️ 教训：approval.approval.status 的 0/1 是"初始/审批通过"，若误用于启停判断会数值相同语义错误。
building 同样：building.building.status 的 0=待审核，不是"启用"。

### balance 模块（2 处）
| 文件:行 | 对象 | 替换 |
|---|---|---|
| balanceCutpay.js:128 | balanceDccount | `STATUS_VALID_SHORT`（有效） |
| balanceCutpay.js:148 | balanceCutpay | `STATUS_INIT_INT`（初始） |

注意：同一文件两处 status==0，因 v 来自不同接口（res.balanceDccountes vs res.balanceCutpays），
对应不同 clazz 的不同常量——逐处核对的必要性印证。

### building 模块（16 处：15 替换 + 1 保留）
| 文件 | 处数 | 对象 | 常量来源 |
|---|---|---|---|
| buildingHouse.js | 4 | buildingHouse | `constant.building().building.status`（5状态审核流程） |
| buildingHouse4advance.js | 11 | buildingHouse | 同上 |
| buildingCustomer.js | 1(+1) | buildingCustomer | `common.status`（二元启停，无专属） |
| buildingNode.js | 1(+1) | buildingNode | `common.status`（二元启停，无专属） |
| buildingSchedule.js | 0(保留2) | buildingSchedule | **保留+注释**（初始/完结，语义不符） |

buildingHouse/buildingHouse4advance 用局部变量 `var ST = constant.building().building.status;`
缓存常量引用，避免重复访问器调用，可读性更好。

buildingSchedule.status（0=初始/2=完结）与 common.status（启用/禁用）语义不符，且库里无
building.buildingSchedule 专属常量，强行替换会引入语义错误，故保留字面量并加注释说明。

### 验证
- [x] 6 个文件 `node --check` 语法通过
- [x] balance 模块 status 魔法数清零（2 处 → 0）
- [x] building 模块 status 魔法数替换 15 处，保留 1 处（语义不符，已注释）
- [x] 语义核对：每个 v.status 都确认了所属 clazz 和对应常量

---

## 总验证

- [x] constant.js / index.js 语法通过
- [x] approval 5 个文件语法通过
- [x] balance 1 个文件语法通过
- [x] building 5 个文件语法通过
- [x] approval 模块 status 魔法数清零
- [x] balance 模块 status 魔法数清零
- [x] building 模块 status 魔法数清零（保留 buildingSchedule 语义不符项）
- [ ] 人工冒烟：登录后观察 Network 面板，确认 16 个 queryConstant 并发请求
- [ ] 人工冒烟：approval/balance/building 各列表状态显示、操作按钮显隐、状态切换正常

## 回滚
- P2-a：git revert constant.js 的 preload 方法 + index.js 的两处 preload 调用
- P2-b approval：git revert approval 目录 5 个文件
- P2-b balance+building：git revert balance 1 个文件 + building 5 个文件
