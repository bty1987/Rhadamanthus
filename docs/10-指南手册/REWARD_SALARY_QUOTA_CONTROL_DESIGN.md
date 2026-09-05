# 奖励工费定额控制 — 开发实施方案

> 版本: v5 (终稿, 2026-09-04)
> 状态: 设计定稿, 待实施
> 背景: 油工一级奖励(workerSalary.twotype=3)目前创建不受任何定额约束, 需引入"验收配置奖励 + 定额上限"双重控制, 并将"奖励"泛化为定额体系的通用类型维度。

---

## 1. 需求与设计原则

**业务诉求**: 创建奖励类工费(twotype=3)必须满足:
1. **闸门**: 该订单对应工程节点已配置奖励(排期级标识, 由节点基础数据控制哪些节点启用);
2. **定额**: 发放金额受该节点奖励定额(normrice 体系)上限约束, 校验逻辑与普通工费同构。

**设计原则**(四轮 review 定稿):
- 奖励是**定额体系的正交类型维度**(普通/奖励), 不是特定工种特例;
- 闸门依托 `constructionnode → constructionschedule` 既有"基础数据+单据实例"两层模式;
- 能复用的字段/机制一律复用(normriceitem.normtype 扩值, amountWorkerSalary 复用);
- 未配置的公司/节点行为**完全等于现状**(休眠特性, 无需 systemConfig 总开关);
- twotype=3 语义泛化为通用"奖励工费", 当前展示名"油工一级奖励"不变。

## 2. 总体模型

```
data.constructionnode.isreward        {0无奖励 | 1不验证(DDL默认=现状) | 2待验证}
        ↓ 三态驱动: 排期/验收页奖励区块显隐 + 工费类型下拉过滤 + 是否启用校验
construction.constructionschedule.isreward  {0无奖励(默认) | 1已配置}   ← 每单闸门, 仅节点=2时可勾
        ↓
data.normrice.normtype                {0普通(默认) | 1奖励}
        ↓ makeNormtion 生成(按 npid 查重, 同项目普通/奖励双行各自落库)
quotation.normriceitem.normtype       {0正常工费 | 1增项 | 2奖励←新增枚举值, 复用现有列, 零DDL}
        ↓
addWorkerSalary: twotype ∈ 奖励集合{TWOTYPE_REWARD_INT=3}
    节点=0 无奖励   → 拦 280019
    节点=1 不验证   → 放行(现状行为)
    节点=2 待验证   → schedule.isreward=1 ? 通过闸门 : 拦 280019
                      已用(cid,cnid,{3}) + 新增 ≤ 奖励定额汇总, 否则拦 280020
    普通类{1,2,11}  : 现有校验不动, 定额汇总查询加 normtype!=2 排除(行为中性)
```

## 3. 数据层变更(3条 DDL)

```sql
-- 1. 节点基础数据: 三态控制(注意: 默认值必须是1=不验证, 等于现状, 否则42家在用公司全断)
ALTER TABLE `data`.`constructionnode`
  ADD COLUMN `isreward` tinyint NOT NULL DEFAULT 1 COMMENT '奖励控制(0无奖励/1不验证/2待验证)';

-- 2. 排期实例: 每单闸门(布尔)
ALTER TABLE `construction`.`constructionschedule`
  ADD COLUMN `isreward` tinyint NOT NULL DEFAULT 0 COMMENT '奖励已配置(0无/1有)';

-- 3. 定额库: 类型维度
ALTER TABLE `data`.`normrice`
  ADD COLUMN `normtype` tinyint NOT NULL DEFAULT 0 COMMENT '定额类型(0普通/1奖励)';

-- normriceitem 不加列: 复用现有 normtype 列扩值 2=奖励
```

**复用审计结论**(为什么只剩3条):
- `normriceitem.category` 撤销 → 复用 `normtype` 扩值 2: normtype 本就是"定额类别"轴(0正常/1增项), 奖励同轴; 生产核实 normtype=1 存量仅18行, 扩展面极小; 两千万行大表零 DDL;
- `constructionnode` 既有字段无复用位: mark=开完工标记 / account=结算启用 / checkout=款比例校验开关 / salaryLimit/accessoryLimit=额度, 全部在用。checkout 是本方案的结构先例("节点维度校验开关");
- `constructionschedule` 既有字段无复用位: checkout/status/planStatus/additemStatus/workStatus/scheduleStatus 各有主。

**字段命名说明**: `constructionschedule.isreward` 为布尔, `is` 前缀符合惯例(同表 isUpload 先例); `constructionnode.isreward` 实为三态, 按惯例本应 `rewardStatus`, 经确认统一用 `isreward` —— **使用时严禁布尔化判断**, 必须按枚举三分支处理。

## 4. 后端变更

### 4.1 PO/VO/常量

| 文件 | 变更 |
|---|---|
| `src/com/fanglin/data/po/ConstructionNodePO.java` | + `isreward`(short) + 常量 `ISREWARD_NONE_INT=0 / ISREWARD_SKIP_INT=1 / ISREWARD_CHECK_INT=2` |
| `src/com/fanglin/data/common/vo/ConstructionNodeVO.java` | + isreward 透传 |
| `src/com/fanglin/construction/po/ConstructionSchedulePO.java` | + `isreward`(short) + 常量 `ISREWARD_NONE_INT=0 / ISREWARD_CONFIG_INT=1` |
| `src/com/fanglin/construction/vo/ConstructionScheduleVO.java` | + isreward; 其 ptv 链需带出 `node.isreward` 供前端三态过滤 |
| `src/com/fanglin/data/po/NormricePO.java` | + `normtype`(short) + 常量 `NORMTYPE_NORMAL_INT=0 / NORMTYPE_REWARD_INT=1` |
| `src/com/fanglin/quotation/po/NormriceItemPO.java` | + 常量 `NORMTYPE_REWARD_INT=2`(复用现有 normtype 列, 无新字段) |
| `src/com/fanglin/salary/po/WorkerSalaryPO.java` | 常量改名 `TWOTYPE_OILER_INT` → `TWOTYPE_REWARD_INT`(全库仅1处定义引用; DB 常量 cid=808 field 名本就是 SALARYTWOTYPE_REWARD_INT, 此改名是对齐) |

### 4.2 定额生成链路(quotation 模块)

`NormtionServiceImpl.makeNormtion` **6处** setSalary 拷贝点同步增加 normtype 拷贝(映射: normrice.normtype 0→item 0, 1→item 2):
- 报价重载: 约 814/840 行(已存在行的 update 分支 + 新建行的 save 分支)
- 扩展重载: 约 999/1030 行
- 增减重载: 约 1193/1224 行

`NormriceItemServiceImpl.addNormriceItem` **2处**(约 110 行 normadd 来源 / 129 行 VO 来源): normtype 默认写 0(普通); 奖励增项本期不支持, 预留。

生成兼容性已核实: 关联查询 `QuotationNormriceDaoImpl.queryQuotationFunctionAreaItem`(`quotation/dao/impl/QuotationNormriceDaoImpl.java:40`)为纯 join 无类型过滤; normriceitem 按 `queryNormriceItem(qid, qfaiid, npid, type)` 以 npid 查重, 同项目普通+奖励双行各自落库互不覆盖; data.normrice 存量本就存在同(qiid,cnid)多行先例。

### 4.3 定额查询(quotation 模块)

`NormriceItemDao` / `NormriceItemDaoImpl`:

```java
// 1. 现有方法加排除(行为中性: 存量 normtype∈{0,1})
// amountNormriceItemForSalary (NormriceItemDaoImpl.java:50)
//   原: ((status=0 and type!=3) or (status=2 and type=3 and normtype=1))
//   改: ((status=0 and type!=3 and normtype!=2) or (status=2 and type=3 and normtype=1))

// 2. 新增(与上完全同构, 换字段换过滤)
public int amountNormriceItemForReward(long qid, long cnid);
// SQL: select sum(if(atttype=0, salary, -salary) * if(trannum=0, 1, num/1000*trannum/1000))
//      from quotation.normriceitem
//      where qid=:qid and cnid=:cnid and normtype=2 and status in (0,2) and type!=3
//      （status/type 细则以 ForSalary 最终版为准, 保持同构; 增减带来的奖励定额本期 type!=3 排除）
```

⚠️ 方法排序: 新方法插入到 `amountNormriceItemForSalary` 邻近位置, 按 amount 前缀组排布。

### 4.4 节点/排期维护(construction + data 模块)

`ConstructionScheduleServiceImpl.updateConstructionScheduleForNorm`(约 152 行, 调定额弹窗的保存口)增加 isreward 更新与校验:

```java
// 节点三态=2(待验证) 才允许排期置1, 防止绕过前端直接提交
if (constructionScheduleVO.getIsreward() == ConstructionSchedulePO.ISREWARD_CONFIG_INT
        && constructionSchedulePO.getNode().getIsreward() != ConstructionNodePO.ISREWARD_CHECK_INT) {
    throw new FLException(280021, "工程节点不支持奖励配置");
}
constructionSchedulePO.setIsreward(constructionScheduleVO.getIsreward());
```

放线建排期(DrawLineServiceImpl 各建 schedule 处): isreward 走 DDL 默认 0, 不从节点带默认(奖励是每单人工决策), 无需代码改动。

### 4.5 工费创建闸门(salary 模块, 核心)

`WorkerSalaryServiceImpl.addWorkerSalary`(src\com\fanglin\salary\service\impl\WorkerSalaryServiceImpl.java:166), 在 csid 分支内 280017 已结算检查之后、`twotypes` 白名单定义之前插入:

```java
// 奖励类工费集合(未来新增奖励类 twotype 往这里加)
List<Short> rewardTypes = Arrays.asList(WorkerSalaryPO.TWOTYPE_REWARD_INT);

if (rewardTypes.contains(workerSalaryVO.getTwotype())) {

    short nodeReward = constructionSchedulePO.getNode().getIsreward();

    if (nodeReward == ConstructionNodePO.ISREWARD_NONE_INT) {
        throw new FLException(280019, "工程节点未配置奖励");
    }

    if (nodeReward == ConstructionNodePO.ISREWARD_CHECK_INT) {

        if (constructionSchedulePO.getIsreward() != ConstructionSchedulePO.ISREWARD_CONFIG_INT) {
            throw new FLException(280019, "工程节点未配置奖励");
        }

        // 与普通工费校验(218行)同构: 已用 + 新增 > 定额 → 拦; 不加浮动(奖励纯走定额)
        if (Arith.add(workerSalaryDao.amountWorkerSalary(cid, constructionSchedulePO.getNode().getCnid(), rewardTypes), workerSalaryVO.getMoney())
                > normriceItemDao.amountNormriceItemForReward(quotationPO.getQid(), constructionSchedulePO.getNode().getCnid())) {
            throw new FLException(280020, "奖励工费已达定额上限");
        }
    }
    // nodeReward == ISREWARD_SKIP_INT(不验证): 放行, 等于现状
}
```

要点:
- 已用池**复用**现有 `workerSalaryDao.amountWorkerSalary(cid, cnid, twotypes)`(impl:86, 净额口径 `sum(if(type=0,money,-money))`, status in (0,1)), 传 `rewardTypes`, 零新 SQL;
- `quotationPO` 取自既有 214 行 `queryQuotationForDefaultByOrderId`, 注意闸门代码放在其之后;
- 普通类校验(216-220行)的白名单 `{1,2,11}` **不动**, 奖励不进普通池, 普通不进奖励池;
- 整单总额上限 280007 对所有类型继续生效(现状, 无需改);
- 计划工费校验 280009(239行)白名单不动。

**旁路审计结论**(均不改): `updateWorkerSalary` 只改备注; `deleteWorkerSalary` 只删初始态并回冲总额(净额池自动回退); Excel 导入 csid=0 无订单上下文; 后端无第二处写 twotype=3。

### 4.6 错误码(error.md 先登记后使用)

| 码 | 消息(固定, 通用措辞不含"油工") |
|---|---|
| 280019 | 工程节点未配置奖励 |
| 280020 | 奖励工费已达定额上限 |
| 280021 | 工程节点不支持奖励配置 |

### 4.7 报表文案(可选同步)

`report/dao/impl/SalaryMetricDaoImpl.java:84` CASE 标签 `'油工奖励'` 可同步改为 `'奖励'`(纯展示文案)。

## 5. 前端变更(老版 WebContent 为主, app 版同步)

| 页面 | 变更 |
|---|---|
| `WebContent/views+js/data/constructionNode` | 节点维护加"奖励"三态下拉: 无奖励/不验证/待验证(默认不验证) |
| `WebContent/views+js/data/normrice` | 定额库列表加"类型"列(普通/奖励), 新建/编辑支持类型选择; 奖励行维护 salary(=奖励单价) |
| `WebContent/js/construction/constructionSchedule.js` | 调定额弹窗(#updateNormModal, 约315行回填/429行提交)加"奖励"勾选; 仅 schedule 带出 node.isreward=2 时渲染, 提交带 `constructionSchedule.isreward` |
| `WebContent/js/quotation/normriceItem.js` | 每单定额项目列表展示类型列 |
| `WebContent/js/salary/workerSalary4detail.js` | 类型下拉过滤: schedule 的 node.isreward=0 时隐藏奖励类选项(入口挡错节点; 后端 280019 兜底) |
| 排期/验收详情(supervision4detail / acceptance4detail) | 可选: node.isreward≠0 的节点展示奖励状态标识 |
| app 版对应页面(`app/js/...`) | 同步以上改动 |

**验收页(acceptance4detail)不加字段** —— 闸门在排期不在验收, 需求中"工程验收的奖励选项"由排期详情页的奖励勾选承载(与"节点完工后发奖励"的实际业务时序一致)。

## 6. 兼容性审计矩阵

| 存量对象 | 默认值 | 行为 |
|---|---|---|
| constructionnode.isreward | 1 不验证 | 全部节点保持现状(自由创建), 特性休眠 |
| constructionschedule.isreward | 0 无奖励 | 闸门默认关, 仅节点=2 时有意义 |
| normrice.normtype | 0 普通 | 现有定额行全部普通 |
| normriceitem.normtype | 存量 {0,1} | ForSalary 查询加 normtype!=2 后结果不变 |
| workerSalary twotype=3 存量 | — | 6.7万行/42公司不受影响, 只约束新创建 |
| amountNormriceItemForSalary | — | 加排除过滤, 行为中性 |

生产数据要点(2026-09-04 核实): twotype=3 公司1 有 2.29万条, 99.8% 挂 cnid=11 油工节点, 全走 csid 主通道, 平均单笔约 1148 元, 高频使用中 —— **任何默认值/校验的默认行为都不允许改变现状**, 这就是 node 默认=1 的原因。

## 7. 上线顺序

1. 生产执行 3 条 DDL(全部行为中性, 可先发);
2. error.md 登记 280019/280020/280021(随代码提交);
3. 发 4 个模块 jar: **data / quotation / construction / salary**(注意各 jar 在 8.3.028 基线上累积重打);
4. 发前端(老版+app);
5. 目标公司运营配置(按序):
   a. 节点维护: 油工节点 isreward 置 2 待验证;
   b. 定额库: 给油工节点相关报价项目新增 normtype=1 奖励定额行(页面配或批量 SQL);
   c. 在途单: 重跑 makeNormtion 带出奖励定额行(normriceitem normtype=2), 或暂不勾奖励维持现状逐单过渡;
   d. 监理在排期调定额弹窗按单勾选"奖励"后即可发放(受定额上限约束)。

**在途单救济**: 节点三态=2 时, 未勾奖励的单子发奖励被 280019 拦, 补勾即可, 无数据修复; 已勾但定额不够, 调大定额库奖励单价后重跑 makeNormtion。

## 8. 测试要点

1. **现状回归**: 未配置任何节点的公司, twotype=3 创建行为与线上完全一致(不验证放行);
2. **三态矩阵**: 节点{0,1,2} × schedule.isreward{0,1} × 定额足/不足, 共 12 组合逐一验证 280019/280020/放行;
3. **普通工费不受影响**: 节点=2 且配了奖励定额行后, 普通工费({1,2,11})的 280014 校验数值与配置前一致(奖励行不进普通池);
4. **定额生成**: 同一报价项目同时挂普通+奖励定额行, makeNormtion 生成两行互不覆盖; 重跑 makeNormtion(disable+复活循环)后奖励行不丢不重;
5. **净额池**: 奖励工费删除(status→3)后额度回退; type=1 负向金额正确冲减;
6. **越权提交**: 节点=0/1 时直接调接口提交 constructionSchedule.isreward=1 → 280021;
7. **跨节点**: 在非奖励节点(如保洁)创建 twotype=3 → 280019; 前端下拉已隐藏该选项;
8. **280007 联动**: 奖励发放仍计入整单 salaryTotal, 触发 280007 的行为不变。

## 9. 交付物清单

- SQL: 3 条 DDL(幂等性注意: tinyint ADD COLUMN 需 IF NOT EXISTS 语法或执行前核查)
- 后端: data(NormricePO/ConstructionNodePO) / quotation(NormriceItemPO 常量、makeNormtion 6处、addNormriceItem 2处、DAO 查询) / construction(SchedulePO、updateConstructionScheduleForNorm) / salary(常量改名、addWorkerSalary 闸门) —— 4 个模块 jar
- 前端: 老版 5 个页面 + app 版同步
- 文档: error.md 三码登记
