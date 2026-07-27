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
其余模块（balance/building/decoration 等）的 status 魔法数（约 306 处）按此范式分批推进。
建议每次一个模块、单独提交，便于回归。优先级：balance > building > decoration（按魔法数密度）。

---

## 验证

- [x] constant.js / index.js 语法通过
- [x] approval 5 个文件语法通过
- [x] approval 模块 status 魔法数清零
- [ ] 人工冒烟：登录后观察 Network 面板，确认 16 个 queryConstant 并发请求
- [ ] 人工冒烟：approval 流程/表单/过程列表的状态显示、启停切换正常

## 回滚
- P2-a：git revert constant.js 的 preload 方法 + index.js 的两处 preload 调用
- P2-b：git revert approval 目录 5 个文件的改动
