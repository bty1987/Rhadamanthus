-- =============================================================================
-- 装修订单全字段查询报表
-- 按业务报表需求输出装修单全维度数据（60+ 字段）
-- 涉及数据库: decoration / construction / communion / customer / data
-- MySQL 5.6  (列名大小写不敏感，本 SQL 统一按生产库小写写法)
--
-- 主表驱动说明:
--   主表为 customer.customerchance (客户商机),业务类型及之前的字段优先从 cc 表取值;
--   cc 表无的字段(订单类型/状态/派尺时间/房屋类别类型/设计师/业务员/业务部/各时间节点等)仍 JOIN decoration.decoration 获取。
--
-- 字段值单位说明 (重要):
--   * 面积类字段 (buildArea/quoteArea)        : 放大 1000 倍的整数, 130000 = 130 ㎡
--   * 金额类字段 (materialPrice/servicePrice等): 放大 1000 倍的整数, 184499000 = 184499 元
--   * 百分比类字段 (materialRate/serviceRate) : 整数, 100 = 100%
--   * 工期类字段 (timeLimit/designPeriod)     : 放大 1000 倍的整数, 80000 = 80 天
--   * 比例类字段 (paySacle)                   : 整数, 含义见业务定义
-- =============================================================================
SELECT
    -- ==================== 基础信息 (主表 customerchance 驱动) ====================
    c.name                         AS `公司`,              -- communion.company.name (cc.company=c.cid, 实测为明文cid无需decode)
    cc.orderId                     AS `装修单号`,
    communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `订单类型`,          -- 区别于 d.type(0中包/1包料/2大包), typeness 是业务订单类型 [cc表无此字段,仍取d]
    cc_region.name                 AS `区域`,              -- communion.department.name (cc.rdid=region.did) 客户商机关联的区域部门
    v.name                         AS `楼盘`,              -- communion.village.name
    h.houseNumber                  AS `楼号`,              -- communion.house.houseNumber (门牌/楼号)
    communion.kv('decoration', 'decoration', 'status', d.status) AS `订单状态`,          -- 0初始/1定金/2预签/3签约/4重签/5废单/6终止/7决算/8完工/20待审/30可终止... [cc表无此字段,仍取d]
    d.measureTime                  AS `派尺时间`,          -- decoration.measureTime [cc表无此字段,仍取d]
    cc.readTime                    AS `已读时间`,          -- customer.customerchance.readTime
    h.buildArea/1000               AS `派尺面积`,          -- communion.house.buildArea (放大1000倍, 130000=130㎡)
    h.innerarea/1000               AS `计价面积`,          -- communion.house.quoteArea (放大1000倍, 注意: 生产数据多为0)
    d.houseClass                   AS `房屋类别`,          -- [cc表无此字段,仍取d]
    d.houseType                    AS `房屋类型`,          -- [cc表无此字段,仍取d]

    -- ==================== 设计/业务归属 ====================
    dd_parent.name                 AS `设计中心`,          -- 设计部(dd)的父部门(fatherDept) = 设计中心/大区
    dd.name                        AS `设计部`,            -- communion.department.name (cc.ddid=dd.did)
    designer.currentName           AS `设计师`,            -- communion.user.currentName (d.dsuid=designer.uid) [cc表无此字段,仍取d]
    sd_parent.name                 AS `业务中心`,          -- 业务部(sd)的父部门(fatherDept) = 业务中心/大区
    sd.name                        AS `业务部`,            -- communion.department.name (d.sdid=sd.did) [cc表无此字段,仍取d]
    salesman.currentName           AS `业务员`,            -- communion.user.currentName (d.smuid=salesman.uid) [cc表无此字段,仍取d]
    bt.name                        AS `业务类型`,          -- data.decorationbusitype.name (cc.dbid=bt.dbid)

    -- ==================== 关键时间节点 ====================
    d.createTime                   AS `创建时间`,
    da.meetTime                    AS `到店时间`,          -- decorationaddition.meetTime
    d.depositTime                  AS `定金时间`,
    d.contractTime                 AS `签单时间`,
    d.precontractTime              AS `预签时间`,

    -- ==================== 开户行/账号 (cc.cid → communion.customer) ====================
    -- 生产实测 76万客户中约 9.2万有值(非仅法人客户), 取 companyBank/companyBankno
    cust.companyBank               AS `开户行`,          -- communion.customer.companyBank (cc.cid=cust.cid)
    cust.companyBankno             AS `开户账号`,        -- communion.customer.companyBankno

    d.terminalTime                 AS `终止时间`,
    d.paySacle/1000                AS `工程付款比例`,      -- 注意拼写 Sacle

    -- ==================== 主材/服务费 (按 type 分布三张子表, COALESCE 合并) ====================
    -- type=0 中包(decorationmidpack)  : 有 materialRate/materialPrice/materialPaidup/serviceRate/servicePrice/servicePaidup
    -- type=1 包料(decorationinclusive): 仅有 materialPaidup, 无其它金额
    -- type=2 大包(decorationholonomy) : 有 materialPrice/materialPaidup/serviceRate/servicePrice/servicePaidup (无materialRate)
    COALESCE(mid.materialRate,  NULL)/1000  AS `主材额百分比`,  -- 仅中包有此字段
    COALESCE(mid.materialPrice, hol.materialPrice)/1000               AS `主材总额`,
    COALESCE(mid.materialPaidup, inc.materialPaidup, hol.materialPaidup)/1000 AS `实收主材额`,
    COALESCE(mid.servicePrice, hol.servicePrice)/1000                  AS `服务费`,
    COALESCE(mid.servicePaidup, hol.servicePaidup)/1000                AS `实收服务费`,
    COALESCE(mid.serviceRate, hol.serviceRate)/1000                    AS `服务费百分比`,

    -- ==================== 设计相关 ====================
    ci.designPeriod/1000                AS `设计天数`,          -- construction.constructioninfo.designPeriod (放大1000倍)
    ci.designTime                  AS `预计设计完成时间`,  -- constructioninfo.designTime (随微改/大改顺延)
    communion.kv('decoration', 'decoration', 'designStatus', d.designStatus) AS `设计状态`,          -- 0待设计/1设计中/2已完成/11微改/21大改
    -- 微改/大改: 从 decorationService 表统计, comment 字段格式 "装修单: {orderId}, 设计方案确认, {11|21}"
    --   11 = 微改, 21 = 大改; finishTime = 该次确认完成时间
    (SELECT MAX(ds.finishTime) FROM decoration.decorationservice ds
       WHERE ds.orderId = d.orderId AND ds.type = 1 AND ds.comment LIKE '%, 11') AS `微改完成时间`,
    (SELECT MAX(ds.finishTime) FROM decoration.decorationservice ds
       WHERE ds.orderId = d.orderId AND ds.type = 1 AND ds.comment LIKE '%, 21') AS `大改完成时间`,
    (SELECT COUNT(*) FROM decoration.decorationservice ds
       WHERE ds.orderId = d.orderId AND ds.type = 1 AND ds.comment LIKE '%, 11') AS `微改次数`,
    (SELECT COUNT(*) FROM decoration.decorationservice ds
       WHERE ds.orderId = d.orderId AND ds.type = 1 AND ds.comment LIKE '%, 21') AS `大改次数`,
    d.sdesignTime                  AS `合同方案确认时间`,  -- 客户合同确认时写入
    ci.designOverdueDays/1000           AS `设计超期天数`,      -- constructioninfo.designOverdueDays (累积)
    d.edesignTime                  AS `放线方案确认时间`,  -- 客户放线确认时写入
    d.recontractTime               AS `重签时间`,

    -- ==================== 施工工期/时间 ====================
    ci.timeLimit/1000              AS `工期`,              -- constructioninfo.timeLimit (放大1000倍, 80天=80000 → /1000)
    ci.keyTime                     AS `预计交钥匙时间`,    -- constructioninfo.keyTime
    cs_drawline.preStartTime       AS `预计放线时间`,      -- constructionschedule 放线节点(name='放线') 的 preStartTime
    cs.preEndTime                  AS `预计完工时间`,      -- construction.construction.preEndTime
    ci.drawlineTime                AS `实际放线时间`,      -- constructioninfo.drawlineTime (放线汇总时间)

    -- ==================== 施工人员/状态 ====================
    supervisor.currentName         AS `交付监理`,          -- construction.construction.supervisor(suid) 关联的监理人员姓名
    communion.kv('decoration', 'decoration', 'projectStatus', d.projectStatus) AS `工程状态`,          -- 0初始/1开工/2完工

    -- ==================== 各工种时间 (constructionschedule 按节点 name 匹配) ====================
    -- 节点 name 取自 data.constructionnode, 生产数据确认: 力工=槽工, 无"油漆"变体
    cs_aio.startTime               AS `槽工开工时间`,      -- 力工节点 startTime (name='力工')
    cs_brick.endTime               AS `瓦工完工时间`,      -- 瓦工节点 endTime (name='瓦工')
    cs_carp.startTime              AS `木工开工时间`,      -- 木工节点 startTime (name='木工')
    cs_oil.endTime                 AS `油工完工时间`,      -- 油工节点 endTime (name='油工')
    cs.endTime                     AS `工程竣工时间`,      -- construction.construction.endTime (实际竣工)

    -- ==================== 主材点收/配送 ====================
    -- 基装主材点收完结: sales.sales 按 orderId 聚合取 MAX(finishTime)
    --   生产实测: sales 表 146w 行, 74w 有 finishTime; 一个 orderId 平均对应多条 sales 记录(主材按品类分单)
    sales_finish.maxFinishTime     AS `基装主材点收完结时间`,  -- MAX(sales.sales.finishTime) GROUP BY orderId
    -- 整装主材配送完结: quotation.selectionitem 按 orderId 聚合取 MAX(tranTime)
    --   生产实测: selectionitem 表 185w 行, 174w 有 tranTime; 一个装修单对应多条选材明细(品类分项), 取最晚配送时间
    sel_tran.maxTranTime           AS `整装主材配送完结时间`,  -- MAX(quotation.selectionitem.tranTime) GROUP BY orderId

    -- ==================== 决算/内决/保修 ====================
    d.accountTime                  AS `决算时间`,          -- decoration.accountTime
    db.balanceTime                 AS `内决时间`,          -- decorationaccount.affirmTime (内决确认时间)
    communion.kv('decoration', 'decoration', 'balancestatus', d.balancestatus) AS `内决状态`,          -- decorationaccount.isAffirm (0未确认/1已确认)
    communion.kv('decoration', 'decoration', 'repairStatus', d.repairStatus) AS `保修状态`           -- decoration.repairStatus

FROM customer.customerchance cc

-- 客户商机 (主表)
LEFT JOIN decoration.decoration d      ON cc.orderId = d.orderId

-- 客户 (开户行/账号, cc.cid)
LEFT JOIN communion.customer cust    ON cust.cid = cc.cid

-- 公司 (cc.company 明文 cid)
LEFT JOIN communion.company c        ON c.cid   = cc.company

-- 装修附加信息 (到店时间/区域快照)
LEFT JOIN decoration.decorationaddition da ON da.orderId = cc.orderId



-- 房屋/楼盘 (cc.hid)
LEFT JOIN communion.house h              ON h.hid  = cc.hid
LEFT JOIN communion.village v            ON v.vid  = h.vid

-- 人员: 设计师/业务员/监理 [cc表无对应字段,仍取d]
LEFT JOIN communion.user designer        ON designer.uid = d.dsuid
LEFT JOIN communion.user salesman        ON salesman.uid = d.smuid
LEFT JOIN communion.user supervisor      ON supervisor.uid = d.svuid

-- 区域部门 (cc.rdid 客户商机关联的区域部门)
LEFT JOIN communion.department cc_region ON cc_region.did = cc.rdid

-- 部门: 设计部(cc.ddid)+父部门(设计中心) / 业务部(取d.sdid)+父部门(业务中心)
LEFT JOIN communion.department dd        ON dd.did  = cc.ddid
LEFT JOIN communion.department dd_parent ON dd_parent.did = dd.fdid
LEFT JOIN communion.department sd        ON sd.did  = d.sdid
LEFT JOIN communion.department sd_parent ON sd_parent.did = sd.fdid

-- 业务类型 (cc.dbid)
LEFT JOIN data.decorationbusitype bt     ON bt.dbid = cc.dbid

-- 施工信息 (设计天数/工期/放线/交钥匙/超期)
LEFT JOIN construction.constructioninfo ci ON ci.orderId = d.orderId

-- 施工单 (预计完工/竣工/监理)
LEFT JOIN construction.construction cs     ON cs.orderId = d.orderId

-- 各工种进度节点 (通过 data.constructionnode.name 匹配工种)
LEFT JOIN construction.constructionschedule cs_drawline
       ON cs_drawline.orderId = d.orderId
      AND cs_drawline.cnid IN (SELECT cnid FROM data.constructionnode WHERE name = '放线')
LEFT JOIN construction.constructionschedule cs_aio
       ON cs_aio.orderId = d.orderId
      AND cs_aio.cnid IN (SELECT cnid FROM data.constructionnode WHERE name = '力工')
LEFT JOIN construction.constructionschedule cs_brick
       ON cs_brick.orderId = d.orderId
      AND cs_brick.cnid IN (SELECT cnid FROM data.constructionnode WHERE name = '瓦工')
LEFT JOIN construction.constructionschedule cs_carp
       ON cs_carp.orderId = d.orderId
      AND cs_carp.cnid IN (SELECT cnid FROM data.constructionnode WHERE name = '木工')
LEFT JOIN construction.constructionschedule cs_oil
       ON cs_oil.orderId = d.orderId
      AND cs_oil.cnid IN (SELECT cnid FROM data.constructionnode WHERE name = '油工')

-- 决算单 (内决)
LEFT JOIN decoration.decorationbalance db ON db.doid = d.doid

-- 主材销售 (基装主材点收完结时间 = 该装修单所有 sales.sales.finishTime 的最大值)
LEFT JOIN (
    SELECT orderId, MAX(finishTime) AS maxFinishTime
    FROM sales.sales
    WHERE finishTime IS NOT NULL
    GROUP BY orderId
) sales_finish ON sales_finish.orderId = d.orderId

-- 选材明细 (整装主材配送完结时间 = 该装修单所有 quotation.selectionitem.tranTime 的最大值)
LEFT JOIN (
    SELECT orderId, MAX(tranTime) AS maxTranTime
    FROM quotation.selectionitem
    WHERE tranTime IS NOT NULL
    GROUP BY orderId
) sel_tran ON sel_tran.orderId = d.orderId

-- 主材/服务费子表 (按 type 分布, 全部 LEFT JOIN 用 COALESCE 合并)
LEFT JOIN decoration.decorationmidpack mid  ON mid.orderId = d.orderId   -- type=0 中包
LEFT JOIN decoration.decorationinclusive inc ON inc.orderId = d.orderId  -- type=1 包料
LEFT JOIN decoration.decorationholonomy hol ON hol.orderId = d.orderId   -- type=2 大包

order by cc.ccid desc

-- =============================================================================
-- 使用说明:
--   1. 本查询无 WHERE 限制, 默认查全量(73万+订单). 生产执行务必加 WHERE 条件!
--      常用过滤: WHERE d.orderId = 'xxxx'  或  WHERE d.createTime > '2026-01-01'
--   2. 面积/金额/工期/比例类字段为放大1000倍的整数, 展示时需 / 1000
--   3. company 关联为明文 cid, 实测可直接 JOIN, 无需 decode
--   4. 工种节点匹配用 constructionnode.name (而非硬编码 schedule/sort), 兼容各公司不同节点配置
--   5. 微改/大改统计依赖 comment 字段 LIKE 匹配, 若历史数据格式不一致需调整
--   6. quoteArea(计价面积) 生产数据多为0, 如需准确计价面积需确认其它来源
-- =============================================================================
;
