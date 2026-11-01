# Operation 纯三元组权限治理 · 总方案(定案版)

> 2026-11-01 拍板。本文档为唯一执行依据,取代 OPERATION_COLLECT_CUTOVER_SOP.md 中与本文冲突的部分(SOP 的收集期章节作废——机制实锤从未生效,详见文末附录A)。
>
> **最终目标(验收标准,三条全满足即终态达成)**:
> 1. 全部业务接口 `through=0` 强制校验(豁免: type=1 迁移组 198 个永久 `through=1`;type=2 免登通道 90 个、type=3 钉钉 1 个维持现状)
> 2. `communion.roleoperation` 中 `company=0` 行数为 **0**——全部授权为显式 `(rid, oid, company)` 三元组
> 3. 建司流程内置"授权种子"步骤(新公司开张即具备标准授权,不依赖通配)

---

## 一、现状基线(2026-11-01 生产实查)

| 项 | 数值 | 说明 |
|---|---|---|
| operation 总数 | 1,528 | through=0:82 已关 / through=1:1,355 / through=2:90 / through=3:1 |
| 待关闸业务接口 | **1,157**(type=0, through=1) | 其中 1,155 有覆盖,2 个零覆盖(oid 1626/1627) |
| 永久放行组 | 198(type=1) | login/common→base 迁移组,无认证态,**永不关闸** |
| roleoperation 总量 | 301,339 行 | 其中 company=0 通配 **4,184 行**(1,067 oid / 256 rid) |
| 通配在已关闸接口上 | 1,368 行 | 过渡期承重,逐步退役 |
| 已验证 | 82 个接口关闸生产运行数周 | 闸门机制(含 oid/company 参数修复后)有实跑记录 |

## 二、核心机制(方案成立的基础)

1. **关闸即收集**: fillOperation 在 `through=0` 且校验通过后执行,写入显式 `(rid=主角色, oid, company=用户公司)` 行。**关一批,该批的显式授权自动沉淀**——这是"显式化"阶段的引擎,无需额外动作。
2. **通配自动失重**: 经 `company=0` 放行的调用会落公司专属行;活跃组合逐步显式化,通配行从"承重"变"冗余",按核验删除。
3. **终态零代码依赖**: 校验逻辑现为 `company=用户公司 OR company=0`,删光通配行即纯三元组;第六阶段仅做一处防御性代码收口(移除 OR 分支)。

## 三、六阶段路线图

### 阶段 1:分批关闸(本周启动,预计 2026-12 中完成业务接口)

**批次划分(已定案,按此执行)**:

| 批次 | 范围 | 接口数(约) | 时间 |
|---|---|---|---|
| 批1 | 纯查询(page*/query*,覆盖≥199 行、覆盖≥73 公司),清单见 28号SQL | 40 | 本周,D0 |
| 批2 | 其余纯查询 + 报价/定额域(含零覆盖 oid 1626/1627,先补授权再关) | ~200 | D0+1周 |
| 批3 | 装修/客户/合同域写操作 | ~300 | 批2 验收后 |
| 批4 | 销售/辅料/施工/审批域 | ~400 | 批3 验收后 |
| 批5 | 财务/结算/支付域 | ~200 | **2027-01-04 后**(需覆盖 12-31 季结) |
| 豁免 | type=1×198 永久 through=1;type=2×90、type=3×1 维持 | 289 | 不参与 |

**每批执行纪律(SOP 纪律,不可省)**:
- 关闸前:跑该批自检 SQL(28号内置)——零覆盖接口先补授后关
- 关闸后:48h 观察窗口,盯日志关键字 `无操作权限` / `-2`
- 误杀处置:单接口回滚 `UPDATE operation SET through=1 WHERE oid=?`(即时生效,无需重启);或直接补一行 `(rid, oid, company)` 授权(实时生效)——**优先补授权不回滚**,回滚会退回无收集状态

### 阶段 2:显式化沉淀(每批关闸后 2~4 周,与后续批次并行)

- 每批关闸满 2 周,跑显式化核验 SQL(30号,见下):该批接口的活跃 (rid, company) 组合显式行覆盖率
- 覆盖率 ≥ 活跃组合 100%(以关闸后 fill 沉淀为准)+ 零"无操作权限"新增报错连续 7 天 → 该批进入阶段 3

### 阶段 3:通配退役(分批随阶段 2 验收推进)

每批的退役脚本(30号模式):
```sql
-- 前置核验: 该 oid 上仍依赖通配的组合(有通配行、且无任何显式行对应的活跃调用)
SELECT ro.rid, ro.oid, COUNT(*) FROM communion.roleoperation ro
WHERE ro.company=0 AND ro.oid IN (批内oid清单)
  AND NOT EXISTS (SELECT 1 FROM communion.roleoperation x
                  WHERE x.rid=ro.rid AND x.oid=ro.oid AND x.company<>0)
GROUP BY ro.rid, ro.oid;
-- ↑ 返回的 (rid,oid) = 通配仍是唯一授权的组合,业务确认后补显式行,再删通配
-- 退役:
DELETE ro FROM communion.roleoperation ro
WHERE ro.company=0 AND ro.oid IN (批内oid清单)
  AND EXISTS (SELECT 1 FROM communion.roleoperation x
              WHERE x.rid=ro.rid AND x.oid=ro.oid AND x.company<>0);
```
- 首刀(批1同窗执行):删系统管理员(rid=86)全部 49 行通配——super 角色在 checkOperation 已旁路,纯冗余,零风险
- 游客(rid=82)26 行通配:随批退役;若有匿名访问需求,改走 `through=2` 通道显式登记,**不允许保留通配**

### 阶段 4:建司授权种子(立即生效,写进建司 SOP)

- 模板:29号 SQL。新公司 `@CID` 开张,从参考公司 `@REF`(默认 1=方林总部)整矩阵复制:`INSERT (rid,oid,@CID) SELECT rid,oid FROM roleoperation WHERE company=@REF`(NOT EXISTS 防重)
- 参考公司矩阵本身已含该公司的业务实况,新公司获得与参考公司同等的操作面;差异授权开司后按需增删
- **25号上海建司(101-103)补种**:上海目前零授权行,须在批1关闸前补种(从参考公司复制),否则上海员工撞上批1即被闸——已列入执行清单第 0 项

### 阶段 5:财务批关闸 + 全量收口

- 2027-01-04 后:批5(财务/结算/支付)关闸 → 全部业务接口 through=0
- 终态巡检:`SELECT COUNT(*) FROM operation WHERE type=0 AND through<>0` 应=0

### 阶段 6:代码收口(✅ 已实现,2026-11-01 baa5bdc20)

已按**配置开关**方式实现(比原定硬删分支更安全——jar 可提前部署,激活/回滚免发版):

```java
// RoleOperationDaoImpl.queryRoleOperation(List<Integer>, int, int):
if (SystemConfig.getInt("operationPureTriple", 0) != 0) {
    criteria.add(Restrictions.eq("company", company));                        // 终态: 纯三元组严格匹配
} else {
    criteria.add(Restrictions.or(Restrictions.eq("company", company), Restrictions.eq("company", 0)));  // 过渡期: 双匹配(现网行为)
}
```

- **部署时机:随时**。缺省(无配置键)= 过渡期双匹配,与现网行为完全一致,零影响
- **激活(终态)**:`INSERT INTO communion.systemconfig (\`key\`,value,company) VALUES ('operationPureTriple','1',0);` —— 🔴 前置:`roleoperation` 中 `company=0` 行数=0
- **回滚**:改 value='0' 或删该行,实时生效(SystemConfig 每次实时读库)
- jar:`fanglin-system-8.3.030`(120387B,RoleOperationDaoImpl.class 指纹 `4cb41dea2db9b9db5ab1c12b0d95f300`)

## 四、运维终态(长期机制)

| 场景 | 动作 |
|---|---|
| 新接口上线 | 自动登记 through=1(现有机制)→ **周巡检**(28号尾内置巡检 SQL)发现 → 补授权 → 一周后关闸 |
| 用户报"无操作权限" | 查角色/公司 → `INSERT roleoperation(rid,oid,company)` 一行,实时生效;工单模板见 SOP 六-1 |
| 新公司开张 | 建司 SQL 必含 29号授权种子段(参考公司整矩阵复制) |
| 接口下线 | `UPDATE operation SET status=1`(禁用,授权行保留审计) |

## 五、红线

1. **不批量一键全关**——每批 ≤50 接口,48h 窗口,出批内回滚不出全局回滚
2. **不臆测补授**——除参考公司复制与报错驱动补授外,不凭猜测插授权行(上次"补数据"事故的教训:补授来源只有三个:参考公司矩阵、关闸后 fill 沉淀、工单驱动)
3. **type=1 永不动**;type=2/3 的 91 个接口的通配行**保留**(它们不走 checkOperation 的角色校验,通配行是唯一授权记录,删了丢审计基线)

---

## 附录A:收集期机制作废说明(2026-11-01 实锤)

AccessInterceptor 全仓唯一 `fillOperation` 调用点 = L200(through=0 分支、校验通过后);through=1 PASS 分支(L96-97)直接放行不收集(L127 的 through=2 调用已被注释)。SOP 原设计的"每个已登录请求自动补全 roleoperation"对 1,157 个 through=1 接口**从未发生**——现有 301k 行全部来自 10-02(22.9万)与 10-12(2.6万)两次批量回填。actionlog 仅 1.4 万行(logFlag=1 才记),不可作为使用矩阵来源。因此本方案**不依赖收集期**:以回填矩阵为基线 + 关闸后 fill 沉淀为增量 + 工单驱动兜底,三源合一推进到终态。
