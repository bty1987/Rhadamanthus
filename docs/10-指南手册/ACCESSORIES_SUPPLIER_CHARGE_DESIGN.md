# 辅料单厂商配送费用(charge)链路设计方案

> 版本: v1.0 定稿(2026-10-23,五项拍板已收敛)
> 模块: inventory(辅料单 accessories)
> 参照系: 外辅单 occcessories 的 配送→配置厂商→生成charge 链路
> 状态: 方案定稿,未落码

---

## 1. 背景与目标

辅料单(accessories)现有链路:创建 → 预出(1) → 出货(2) → 到货(6) → 审批(7),全程无厂商参与、无费用概念。外辅单(occessories)已有完整的"配置厂商 → 配送 → 费用(charge)"链路。本次为辅料单引入同构能力:

- 辅料单可配置**厂商**,厂商有专属视角只看自己的单;
- 辅料单有**费用额(charge)**,到货时**由系统按关联辅材的费用模板自动计算**,无任何人工填报。

## 2. 拍板记录(2026-10-23)

| # | 议题 | 拍板 |
|---|------|------|
| 1 | 改派厂商的角色限制 | **没有限制**,任意可操作者均可配置/改派 |
| 2 | 售后辅料单(TYPE_POST)是否参与厂商链 | **不参与**,整条链路直接跳过 |
| 3 | 费用字段结构 | **不需要 rcharge,现阶段仅一个 charge 费用额**(单头一个总额,不建费用明细表) |
| 4 | 费用下游 | **不考虑**,charge 仅单据展示与打印,不进任何结算/薪资模块 |
| 5 | 费用生成方式 | **不是手工填报,由关联辅材的费用模板自动计算**,计算方式参考外辅单(aoodscharge 模板 × 数量) |

## 3. 参照系:外辅单链路实证

外辅单状态机 `INIT(0)→BIND(1)→DELIVE(2)→RECEIVE(3)→BALANCE(4)→FINISH(5)`(作废 6),参照点:

| 环节 | 外辅实现 | 本方案取舍 |
|---|---|---|
| 配置厂商 | `bindOccessories`:typeahead 选厂商(`personel.querySupplierByPinyin`),setSupplier+status→1,给监理发消息 | 旁挂到辅料单 {0,1} 态,不动状态 |
| 厂商视角 | `pageOccessoriesForSupplier` 按登录 uid 圈单 + 页面 pageType="supplier" 只留查看/打印 | 同构移植 |
| 费用来源 | 项关联辅材 `caid→aoods`,费用模板 `data.aoodscharge`(name/price/surplus/type/status/sort),创建时人工填费用数量 num | **人工填数量改为全自动**:数量直接取辅料项数量 |
| 费用汇总 | `itemCharge=Σ(price+(isExceed==0?surplus:0))×num` → item.charge → occcessories.charge | 单头一个总额,surplus 不参与(辅料无超阶语义) |
| 费用锁定 | `checkOccessoriesEditable` 状态闸 | 审批(7)及之后状态无改动入口(到货即算定,见 §6.2) |

费用来源数据链已实证:辅料项 `accessoriesitem.caid = aoods.aid`(生产 1768 万项中 856 万有关联,约 48% 无关联项费用按 0 计);`queryAoodsChargeByAid` 接口现成。

## 4. 数据层(最小 DDL,只加不改,幂等)

```sql
-- inventory.accessories 加 2 列(幂等:只加不删改)
ALTER TABLE inventory.accessories ADD COLUMN supplier INT NULL COMMENT '厂商uid(communion.user)';
ALTER TABLE inventory.accessories ADD COLUMN charge BIGINT NOT NULL DEFAULT 0 COMMENT '费用总额(×1000),到货时按关联辅材费用模板自动计算';
```

- **不建** accessoriescharge 明细表(拍板 3:仅一个费用额;计算时 join aoodscharge 聚合,不落明细);
- 老数据零影响:supplier NULL / charge 0,存量已到货单**不回填**(如需回填另出一次性 SQL,待业务提出)。

## 5. 后端改动(inventory 模块,新增 2 接口 + 1 处自动计算)

### 5.1 bindAccessories(配置厂商)

- 签名:`bindAccessories(AccessoriesVO)`,入参 `accessories.aid + accessories.supplier.uid`;
- 校验:单据存在;`type != TYPE_POST_INT`(拍板 2,新错误码或复用);`status ∈ {INIT(0), ADVANCE(1)}`;
- 行为:setSupplier,可重复调用改派(拍板 1 无角色限制,同外辅 BIND 后可重 bind);可选给监理发消息(镜像 `OccessoriesServiceImpl.bindOccessories` 的 sendMessageAfterCommit)。

### 5.2 pageAccessoriesForSupplier(厂商视角)

- 镜像 `pageOccessoriesForSupplier`:按 `queryUserId()` 解析 uid,DAO 强制 `supplier=uid` 过滤;
- 服务端过滤是硬约束,前端变体只做体验。

### 5.3 deliveAccessories 内自动计算 charge(拍板 5)

出货→到货(`deliveAccessories`,2→6)成功后追加计算:

```
charge = Σ_items ( Σ_aoodscharge(caid, status=0 启用) price × item.num )
```

- 无关联辅材(caid=0)或无启用模板的项按 0 计;
- `surplus` 不参与(辅料单无外辅 isExceed 超阶语义);TYPE_POST 单整链跳过(其到货不进本逻辑,直接走原路);
- 到货即算定;改派厂商不影响(费用来自模板,与厂商无关);
- 金额口径 ×1000 与单价列一致,前端 tranargs 换算。

### 5.4 查询带出

`queryAccessoriesByAid` / 列表 ptv 增带 `supplier` BaseInfo 与 `charge`(镜像外辅 VO 装配的 supplier BaseInfo 写法)。

### 5.5 落码前核实项

`updateAccessoriesItem` 系列接口的状态闸:若允许到货(6)后增删改项,则 item 变动会与已算 charge 漂移——届时在 item 变动接口尾部追加同一计算钩子重算(一行调用,不影响结构);若不允许(预期如此)则无需处理。

## 6. 前端改动(manifest 模块)

### 6.1 accessories.js / accessories.html(内勤/监理视角)

- 新增"分配厂商"行按钮:status∈{0,1} 且 type!=POST 显示;弹 `bindAccessoriesModal`(厂商 typeahead 复用 `querySupplierByPinyin`,镜像外辅 bindOccessoriesModal);
- 列表加"厂商"列(supplier.currentName)与"费用"列(charge,到货后显示,tranargs 换算);
- `accessories4view` 加厂商与费用展示。

### 6.2 厂商视角

`accessories.html?type=supplier` 页面变体(pageType="supplier"):数据源换 `pageAccessoriesForSupplier`,行按钮只留 查看/打印(自动算,厂商无填报动作)。

### 6.3 可选

`accessories2print` 打印页加厂商与费用合计行(默认做,零风险)。

## 7. 权限与菜单

- 厂商菜单 1 条 operation 行(url 指 `accessories.html?type=supplier`)+ rolechainpage 授权(照抄外辅厂商菜单的授权行集合);
- 非幂等 SQL,放 `sqls/inventory/` 按序号递增,头部注明用途与授权来源。

## 8. 发布序

1. DDL(accessories 加 supplier/charge 两列)——先行;
2. inventory jar(bindAccessories / pageAccessoriesForSupplier / deliveAccessories 自动算 / ptv 带出)——次之;
3. 前端 js/html——随 jar 后;
4. 厂商菜单授权 SQL——最后执行生效。

老流程与存量单零影响。

## 9. 边界(写死进实现)

- charge 仅单据展示与打印,不进任何结算/薪资下游(拍板 4);
- 无 rcharge,现阶段仅一个费用额(拍板 3);
- TYPE_POST 售后单整链跳过:不可配厂商、不到货算费(拍板 2);
- 改派无角色限制(拍板 1);
- 到货后不可再改项(见 §5.5,若状态闸与预期不符则 item 变动后重算)。

## 10. 待业务后续(不在本期)

- 存量已到货单 charge 回填 SQL(如需);
- 费用进结算/薪资下游(如需,另立专题);
- 费用明细表(如需逐笔对账,再引入 accessoriescharge 镜像表)。
