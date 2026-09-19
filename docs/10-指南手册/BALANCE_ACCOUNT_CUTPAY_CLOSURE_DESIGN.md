# 结算单 × 账户/扣款 闭环调整方案

> 2026-09-19 定稿 | 状态：**批次A+B+C 已实施（2026-09-19，jar=fanglin-balance-8.3.031.000 已构建），批次D 未做**
> 实施红线（用户拍板）：①补回手工建单按钮 ②BalanceSelection belonger 口径维持现状 ③**不碰生产在跑的前半段**——上游三域状态机、`payedBalance`(isPay标识流) 一行未动；完结状态激活改放在从未执行过的 `balanceBalance/payBalance` 内。
> 实施偏差（相对原稿）：生产 `balancecutpay.money` 实测已是 bigint，DDL 缩为仅 `total`；错误码实收 350004/350008/350009（余额不足复用既有 350030/350003）；结算弹窗双账户提交在新语义下合法（一步付清），无需改 4balance 页 JS。
> 范围：`src/com/fanglin/balance` + `WebContent/views|js/balance` + `js/api/balance.js`
> 前提：销售结算(BalanceSales)/外销结算(BalanceOales)/选材结算(BalanceSelection)与结算单(BalancePO)生成链路**视为稳定域，本方案不动其状态机**，只在其下游收口。

---

## 1. 背景与目标

上游三域把应付金额汇成结算单 `balance.balance` 后，下游"结算入账 → 账户 → 扣款 → 出纳付款 → 已付"链路**代码建成但从未投产**（生产实证见 §2.2）。本方案目标：

1. 把结算单→账户→扣款→付款的**资金闭环修直并投产**；
2. 账户/扣款的**结算主体从厂商扩展到人员（员工/工人）**，复用既有 `communion.user` 主体体系，零新主体表；
3. 清理闭环上的死代码与口径不一致，使每笔钱在 `balancedetail` 流水里可追溯。

---

## 2. 现状盘点

### 2.1 链路现状（代码还原）

```
[销售结算 BalanceSales 54739]  ──balanceBalanceSales──▶ 生成/重算 BalancePO
[选材结算 BalanceSelection 13282] ──balanceBalanceSelection──▶ 生成 BalancePO   (belonger=creater)
[外销结算 BalanceOales 398]   ──balanceBalanceOales──▶ 生成 BalancePO(amount=0, 纯归档)
                                                     │  type=0 支出, amount=payment, surplus=amount
                                                     ▼
              ┌──────────────────── 生产实际用法：直接 payedBalance 打 isPay=1 ────────────────────┐
              │                                                                                      │
              ▼ (以下三步生产 0 执行)                                                                │
   ① submitBalanceCutpay 扣款绑定: balance.surplus-=, cutpay+= (status 0→1)                        │
   ② balanceBalance 结算入账: 结算单余额 → 归属人账户(type=0) + 出纳账户(type=1), 写流水/分摊      │
   ③ payBalance 出纳付款: balance.surplus-=, 记流水 (但不动任何账户金额 ← 断点)                     │
```

### 2.2 生产实证（2026-09-19 只读库）

| 表 | 行数 | 结论 |
|---|---|---|
| balance.balance | 64,731 | 全部 type=0；**sum(surplus)==sum(amount) 分毫不差** → ①②③从未执行 |
| balance.balanceaccount | **0** | 账户体系未投产 |
| balance.balancedetail / apportdetail | **0** / **0** | 无任何资金流水/分摊 |
| balance.balancedccount | **0** | 扣款池未投产 |
| balance.balancecutpay | **3** | 扣款仅试水（balancepicture 9 行配套） |
| balance.isPay | 66,983/69,501 =1 | "已付标识"是生产唯一在用的收尾动作（payeder 有值 12,832） |
| belonger 主体 | type=0 员工 55,236 / type=1 厂商 14,265 | 厂商结算单已大量存在 |
| communion.user | type=1 厂商 4,397；brand 18,100（10,063 挂 supplier） | 厂商主体成熟 |
| salary.workerbalance | 34,661 | 工人(质保金/工费)账户独立体系，在用 |
| 菜单 | mid=463 结算单 / 892 扣款 / 893 结算账户 / 721 扣款账户 | 页面入口全都在，非菜单问题 |

**定性：闭环卡在"账户语义没想清楚 + 出纳付款断链 + 扣款口径不对称"，不是缺入口。**

### 2.3 代码缺陷清单（闭环投产前必须修）

| # | 位置 | 问题 |
|---|---|---|
| D1 | `BalanceServiceImpl.balanceBalance` :154-155 | 支出单结算入账写 `realMoney+=`，与前端标签"referMoney=应付额/realMoney=实付额"**方向相反**（实为资金池语义，两套语义混用） |
| D2 | `BalanceServiceImpl.payBalance` :193-232 | 不动出纳账户/归属账户任何金额，:211 是空 update → 付款后账户余额不变，链路断裂；且无余额校验、无归属校验 |
| D3 | `BalanceCutpayServicerImpl.addBalanceCutpay` :138-148 | 直接带 balance 创建时**不置 status=1、不扣 balance.surplus**，与 submitBalanceCutpay(:165-197) 口径不一致 |
| D4 | `unbindBalanceCutpay` :201-232 | 解绑回冲 balance 双字段，但**不回补 dccount.surplus**（池资金永久丢失）；submit/unbind 均不区分 type 0扣款/1返款 |
| D5 | `deductBalanceCutpay` :236-271 | 抵扣/返款时 `balance.cutpay-=money` 但**不回加 balance.surplus**，不更新父记录 total |
| D6 | `BalanceCutpayPO.money` 是 **int**（其余金额全 long），214 万厘≈2.1 万元上限，溢出风险 |
| D7 | 金额全为读-改-写，无原子 SQL、无版本列 → 并发 lost-update |
| D8 | `BalancePO.status`（0初始/1完结）**死字段**：全库无 setStatus(FINISH) |
| D9 | `payedBalance` :236-256 无幂等校验 |
| D10 | 前端死按钮：`balance.js:260` `#addBalance` 元素不存在（手工建单不可达）；`balance.js:218` `apportDetailIndex` 未定义（分摊明细死键，应为 `balanceApportIndex`）；`balanceCutpay.js` `#saveAddBtn` 无 click 处理器（扣款账户弹窗确认死）；`api/balance.js:20` `balanceSalesBalancePrint` 指向不存在页面 |
| D11 | 孤儿代码：`service/BalanceAccountesService.java`（无实现无引用）；`BalanceDao.queryBalance(String no)` 无调用方；`BalanceDaoImpl:82` creater 分支 alias 写错 |
| D12 | 稳定域已知 quirk（**本方案不动，仅登记**）：BalanceSelection 结算时 belonger=creater 与创建时 =brand.supplier 不一致；BalanceOales 生成的结算单 amount 恒 0；BalanceSelection 金额 ÷10⁶ 与 BalanceSales 不换算并存（投产前需抽样核对两类结算单在 balance 表内的单位一致性） |

---

## 3. 目标模型（拍板）

### 3.1 账户语义统一为"应付/实付"（与前端标签一致，弃资金池语义）

| 账户类型 | referMoney 应付额 | realMoney 实付额 | surplus 余额=surplus公式 | 语义 |
|---|---|---|---|---|
| **type=0 结算账户**（厂商/人员） | 结算入账时 += | 付款时 += | refer−real = **欠付余额** | "我们还欠他多少" |
| **type=1 出纳账户**（公司） | 收款/入金时 += | 付款时 += | refer−real = **可用余额** | 公司对外付款的资金池 |

### 3.2 闭环时序（目标动作链·实施版）

```
结算单(上游生成, amount=应付, surplus=amount)
  ├─(可选) 扣款绑定 submitBalanceCutpay/addBalanceCutpay(带balance): status=1, 按type方向
  │         balance.surplus∓m / cutpay±m (两条路径已统一为 bindBalanceCutpay 私有方法同口径)
  │         解绑 unbind: 双向回冲 + 🔴回补池surplus(挂池时); 抵扣 deduct: 子流水+父total核减+balance双向回冲
  ├─(可选/可拆) 结算入账 balanceBalance, 按账户类型分流:
  │    type=0 结算账户(台账腿): 归属校验350007, 支出单 surplus>=m(350030)+提款单拒绝350009,
  │           account.referMoney+=m(应付↑, 原子), 写流水, balance.surplus-=m(带守卫原子UPDATE)
  │    type=1 出纳账户(现金腿, 与payBalance同构 payCash): 支出/提款单 realMoney+=m+余额守卫350030,
  │           支出单另自动定位/懒开归属人结算账户 realMoney+=m(实付↑, 不设守卫允许预付),
  │           收款单 referMoney+=m(入金); 不消耗 balance.surplus
  │    → 结算弹窗双账户提交 = 台账+现金一步付清; balance2balance 弹页 = 纯台账; 两种UI形态均合法
  ├─(可选拆步) 出纳付款 payBalance: 每账户走 payCash 现金腿, 置 balancer/balanceTime
  └─已付标识 payedBalance: 🔴 未改动(生产在用, isPay+payeder+payedTime 原样)
完结激活: balanceBalance 中 surplus==0 时 status=1; payBalance 无条件 status=1 (均位于从未投产的接口内)
账户提款 withdrawBalanceAccount: 改原子UPDATE(realMoney+=/surplus-=带守卫, 350003), 删除顺手改写company的旧行
```

### 3.3 主体矩阵（打通人员/厂商，零新表零主体DDL）

| 主体 | user.type | 进入闭环的方式 | 依托现状 |
|---|---|---|---|
| **厂商** | 1 | 销售/选材结算单 belonger=brand.supplier（已 14,265 行）；结算入账时**自动懒开户**（无账户则建 name=供应商名，银行信息后补） | SupplierAction 全链路成熟；账户页"添加结算"typeahead 已用 querySupplierByPinyin |
| **员工** | 0 | 手工开户（账户页已有"添加"）；适用内部往来/报销/返佣类支出单 | belonger 无 type 校验，天然支持 |
| **工人** | 0（duty 区分） | 同员工——**不与 salary.workerbalance 合并**（34,661 行在用、深度嵌入工费审批链，语义=质保金池非往来账户）；工人若走 balance 结算（如外辅班组）以 user 直接开户 | constructer→user 已通 |
| 商户/驻店 | 2/4 | 预留，暂不启用 | — |

主体区分**不加列**：列表/筛选按 `belonger→user.type` join 实现（权威在 user 表，冗余列必漂移）；constant 补 `balanceAccount` 主体类型字典仅用于前端展示翻译。

### 3.4 扣款池（dccount）定位拍板

池=与厂商的扣款额度协议（如"入场费 X 分 N 期"）：`cutpay`=协议额度、`surplus`=未圈额度；**录入扣款=圈额**（surplus−=，已有）、**绑定结算单=执行**（只动 balance，池不动）、**解绑=退圈**（池 surplus+=，修 D4）、**抵扣(返款)=部分退回**。type 0扣款/1返款 在 submit/unbind/deduct 中按方向取加减号。

---

## 4. 实施批次

### 批次A：死代码与死按钮清理（✅已实施）

| 改动 | 文件:位置 |
|---|---|
| 补 `#addBalance` 按钮（手工建完结单，配 pageBtn 权限键 `balanceAdd`）或删除 addModal——**拍板：补按钮** | `views/balance/balance.html`（工具栏）+ `balance.js:260` |
| 分摊明细死键 `apportDetailIndex`→`balanceApportIndex` | `js/balance/balance.js:218`；顺带给 `balanceApport.html` 挂菜单或从行按钮进入 |
| `#saveAddBtn` 补 click：调 `addBalanceCutpay` 带 `dccount.bdid`（与 balanceDccessDetail.js:85 同款） | `js/balance/balanceCutpay.js:12,67` |
| 删 `balanceSalesBalancePrint` index | `js/api/balance.js:20-22` |
| 删孤儿接口 `BalanceAccountesService.java`；删 `BalanceDao.queryBalance(String no)` | `service/BalanceAccountesService.java`、`BalanceDaoImpl.java:37,51` |
| 修 creater 过滤 alias | `BalanceDaoImpl.java:82`（`query.alias("creater","creater")`） |
| 清理 BalanceSelection 死代码（L268 置 null 后 L272 必真；`new BrandPO(gid)` 冒充 bid）——仅删除死分支不改行为 | `BalanceSelectionServiceImpl.java:268-305` |

### 批次B：闭环语义修直（✅已实施，含原子UPDATE DAO×5：updateBalanceForSurplus守卫/updateBalanceAccountForRefer带符号/updateBalanceAccountForReal守卫/updateBalanceAccountForRealUncheck/updateBalanceDccountForSurplus带符号）

**DDL（1 条，表仅 3 行无迁移风险）**

```sql
ALTER TABLE balance.balancecutpay MODIFY COLUMN money bigint NOT NULL DEFAULT 0 COMMENT '金额(厘)';
```

**后端改动**

| 修 | 位置 | 内容 |
|---|---|---|
| D1 | `BalanceServiceImpl.balanceBalance` :154-155 | type=0 支出单：归属账户 `realMoney+=` → **`referMoney+=`**（应付↑）；收款单维持 referMoney+=；同步修注释 |
| D2 | `BalanceServiceImpl.payBalance` :193-232 | ①删 :211 空 update；②出纳账户（入参账户，仅允许 type=1）`realMoney+=m, surplus=refer−real`，余额不足抛 FLException(码见 §6)；③按 `balance.belonger` 定位 type=0 有效结算账户同步 `realMoney+=m`（无账户则跳过，兼容纯标识流）；④`balance.surplus-=m` 保留，双账户各写一条 balancedetail |
| D3 | `BalanceCutpayServicerImpl.addBalanceCutpay` :138-148 | 带 balance 路径补 `status=1`、`balance.surplus-=money`，与 submit 完全同口径（抽私有方法复用） |
| D4 | `unbindBalanceCutpay` :201-232 | 挂池时回补 `dccount.surplus+=money`；submit/unbind 按 `cutpay.type` 0/1 取方向 |
| D5 | `deductBalanceCutpay` :236-271 | 补 `balance.surplus+=money`（返款回加欠付）；更新父记录 total |
| D6 | `BalanceCutpayPO.money` int→long + VO/Action 同步 | 编译期暴露所有调用点 |
| D7 | 新增原子 SQL DAO（先例：advancepayment 原子UPDATE） | `balanceaccount`/`balance`/`balancedccount` 三表 `UPDATE ... SET surplus=surplus±? WHERE ... AND surplus(条件)`，受影响行数=0 时抛余额不足；替换 balanceBalance/payBalance/withdraw/addBalanceCutpay/submit/unbind/deduct 中的读-改-写 |
| D8/D9 | `payedBalance` :236-256 | isPay 幂等（已 isPay=1 直接返回）；`surplus==0` 时 `status=STATUS_FINISH_INT` |

**前端配套**：`balance2balance.js` 双向校验文案对齐新语义；`balanceCutpay2print` 表头 `balance.surplus` 含义改为"扣款后应付余额"复核。

**回归矩阵（dev 库全流程）**：结算单(支出/收款) × 账户(结算/出纳/无归属账户) × 扣款(无/绑/绑+抵扣/解绑) × 付款(足额/不足额) —— 16 组合各验：balance.surplus、账户三字段、池 surplus、流水行数、完结状态。

### 批次C：主体打通投产（✅已实施：懒开户落位payCash/utype列+筛选(带硬编码兜底)/updateBalanceAccount编辑弹窗；C-4扣款创建弹窗本就用querySupplierByPinyin无需双源）

1. **厂商自动懒开户**：`balanceBalance` 归属校验(:149-151, 350007)前置一步——`balance.belonger` 无有效 type=0 账户时自动创建（name=supplier.userName，company 同单据），消除"先去账户页手工开户"的推广阻力；
2. **账户列表主体化**：`pageBalanceAccount` join `user.type` 返回主体类型；前端加"归属人类型"列+条件组件筛选；constant 补字典（`module=balance, field=utype, key=0/1, value=员工/厂商`）；
3. **厂商银行信息维护**：账户页行"编辑"补 address/phone/bank/bankno（现仅状态开关），打印对账单时带出；
4. **扣款录入主体化**：`balanceCutpay.js` 创建弹窗归属人 typeahead 切 `querySupplierByPinyin`（厂商）与员工查询双数据源（按 atttype 场景）。

### 批次D：增强（⬜未实施，按业务节奏）

- 厂商自助对账 `pageBalanceAccountForSupplier`（先例：`pageBalanceSalesForSupplier` 按登录 uid 过滤）+ 账户流水打印；
- `balanceapport` 分摊语义启用评估（现 comment 恒"支出/收款"且 money 存操作后余额——若启用需先修语义为发生额）；
- 工人/外辅班组走 balance 结算试点评估（workerbalance 不动）。

---

## 5. 存量数据策略

- 6.4 万存量结算单**不入账、surplus 不回填**：视为账户体系启用前的历史台账（sum(surplus)==sum(amount) 恰好自洽）；
- 新结算单起走完整闭环；存量单若需补入账，后置提供按 bid 的批量补账工具（批次D），不做一刀切 SQL；
- balancecutpay 3 行试水数据：`money int→bigint` ALTER 原值保留，无需清洗。

## 6. 错误码登记（error.md 已更新，段 350）

| 码 | 消息 | 状态 |
|---|---|---|
| 350004 | 扣款账户不存在 | 新收编(原reserved; 扣款池不存在/归属人缺失两处) |
| 350008 | 仅允许操作出纳类型账户 | 新收编(原reserved; payCash非出纳账户) |
| 350009 | 提款单不能结算入账 | 新收编(原reserved; 提款单走台账腿拒绝) |
| 350030 | 帐户余额不足 | 既有复用(台账腿/出纳腿余额守卫) |
| 350003 | 账户金额不足 | 既有复用(提款/扣款圈额守卫) |
| 350007 | 结算归属不一致 | 既有复用(台账腿归属校验) |

## 7. 上线顺序与发版物（实施版）

```
🔴BALANCE_ACCOUNT_CUTPAY_CLOSURE.sql 先行:
   ALTER balancecutpay.total → bigint(10) (生产money已是bigint, 语句为no-op兜底)
   constant 2行(balanceAccount.utype 员工/厂商, NOT EXISTS幂等)
→ fanglin-balance-8.3.031.000.jar (2026-09-19已构建, 108 class, 仅balance一枚)
→ 前端7文件随WebContent发版(balance/balanceAccount/balanceCutpay三页+api/condition)
→ dev库全流程回归(见§4批次B回归矩阵) → 生产
```

存量策略不变：6.4万存量结算单不入账、surplus不回填；balancecutpay 3行试水数据原值保留。

## 8. 待定夺项（已拍板收口 2026-09-19）

1. ~~手工建结算单按钮~~ → **拍板补回**：balance.js buttons 工厂新增「添加完结单」(与「付款」按钮同等页面级权限，不设pageBtn门控)；
2. ~~厂商自动开户 vs 手工~~ → **拍板自动**：payCash 支出单现金腿内 locateOrCreateAccount 懒开户；
3. ~~BalanceSelection belonger 口径~~ → **拍板维持现状不改**；
4. ~~外销结算单 amount=0 归档定位~~ → 保留。
