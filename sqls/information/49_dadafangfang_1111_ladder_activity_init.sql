-- ============================================================================
-- 文件: 49_dadafangfang_1111_ladder_activity_init.sql (v2: 挂现存活动, 不新增activity)
-- 库表: information.awardstock / information.activityitem
-- 用途: 「大大方方11·11瓜分百万家具礼」限量券(activityitem.type=30)初始化:
--       ① awardstock 全局奖品档案 2 条(全国共享库存池):
--          卧室家具四件套 100套(num=100000毫) + 臻品眠床 300张(num=300000毫), 合计 400 份
--       ② activityitem 挂到【现存窗口覆盖11·11的生效装修活动】下(不新增任何 activity 行):
--          目标规则 = activity.type=1 AND status=0 AND company>0
--                     AND startTime<='2026-11-15 23:59:59' AND endTime>='2026-11-10 00:00:00'
--          每目标活动挂 2 行 type=30: 四件套 money=9999000厘 / 眠床 money=4000000厘
-- 统计结论(生产只读库干跑 2026-11-09):
--       · 目标活动 69 个 / 覆盖 52 家公司(干跑 SELECT 见验证段0); 预期插入 activityitem 69×2=138 行
--       · 全代码库无任何消费方读 activity.defaults=0(queryActivityForDefault 零调用)——
--         "默认活动"是死配置, 对参与流程无意义; 参与引擎只校验宿主活动窗口(140116), 故目标集按窗口规则圈定
--       · 同公司多档 in-window 活动(如"无活动/不参加活动"占位行)全部挂券: 参与下拉任选 in-window 行都可领,
--         消除选到无券行报 140117"活动奖品已清零"的困扰; 每单一张闸(af358378a)保证一单一券, 无超发风险
-- 🔴 编号避让(2026-11-10 干跑实证): 原拟 no=2026111001/2026111002 已被手工行占用
--       (asId=12842 no=2026111001 name=集团年终臻品眠床 company=7 等), 守卫按 no 判会静默跳过且
--       activityitem 子查询挂错奖品; 故改用 2026111101/2026111102(干跑零冲突), 子查询按 no+name 双条件兜底;
--       content 列 varchar(64) 硬限, 文案已缩短;
--       awardstock.company=0 归属集团(全国共享池不挂单一分公司): 引擎发放/扣减/挂券全链按 asid 直查不受影响,
--       唯一差异=奖品管理列表页(pageAwardStock 按登录公司过滤)仅集团账号(登录公司=0)可见, 维护操作按主键不受影响;
--       另发现疑似礼品部试建残留(asId=12832/12843 no=20261110x 集团年终卧室家具四件套: type=1 物品非 30 引擎不认,
--       num=0 发不出, company=7/51 各一行)——不参与发放无害, 建议业务确认后停用(status=1)防混淆
-- 🔴 口径提示(执行前知悉):
--       · 参与窗口=宿主活动窗口, 不是整齐的 11-10~11-15: 收官季档(11-01 起)/占位长窗档挂上即开抢,
--         今日(11-09)执行则当日即可预占; 集团如严格卡 11-10, 请把握执行时机或执行后对个别活动另行收窗
--       · 库存即闸: 四件套 100 套扣完自动降级眠床, 床尽 140117 拦参与/160038 拦领取(送完即止, 与文档一致)
--       · 缺口公司 16 家签约公司不在本 SQL 覆盖(无任何 in-window 生效活动, 无宿主可挂):
--         25本溪爱林/26葫芦岛爱林/27丹东爱林/28朝阳爱林/34武汉1918/39哈尔滨1918/40长春1918/70海城方林/
--         77成都1918/81青岛1918/93北京方林大宅/98济南方林/99济南爱林/102上海方林/103上海方林整装
--         (另 13方林置业/18方林地产/32方林售后 系壳/支持公司, 天然无装修合同不在需求内)
--         如需覆盖只能: 新增 activity 行(v1 方案)或对现存行延窗(UPDATE), 待业务拍板后另行补充
--       · 参与下拉仍会列出各公司过期活动(参与时被 140116 拦), 属存量现状, 与本次无关
-- 发放机制(引擎实证 DecorationActivityItemServiceImpl.settleLadderActivityItem):
--       · 参与=按水位预占(只读不扣库存); 签约/领取=原子扣减降级(money 降序: 先四件套后眠床)
--       · 每单一张; 券行 num=1000毫; 收款抵扣经 decoration.decorationscaledetail 走 salespayment
-- 执行前置条件:
--       ① 32号 sqls/decoration/32_ladder_limited_prd.sql 已执行(type=30 字典, 已上线);
--       ② 阶梯引擎 jar(af358378a 批)已部署;
--       ③ 目标窗口规则命中数与干跑一致(执行前后跑验证段0比对, 干跑值=69活动/52公司)
-- 回滚方式(仅限未产生发券数据(decorationactivityitem)前, 先明细再奖品):
--   DELETE FROM information.activityitem WHERE type=30 AND money IN (9999000,4000000)
--     AND aid IN (SELECT aid FROM (SELECT aid FROM information.activity WHERE type=1 AND status=0
--       AND startTime<='2026-11-15 23:59:59' AND endTime>='2026-11-10 00:00:00') t);
--   DELETE FROM information.awardstock WHERE `no` IN ('2026111101','2026111102');
-- 幂等性: 两段均 NOT EXISTS 守卫, 可重复执行
-- ============================================================================

-- ============ 一、awardstock 全局奖品档案(全国共享库存池, 2 条) ============

INSERT INTO information.awardstock
  (`no`, `name`, `purchase`, `selling`, `num`, `status`, `type`, `subtype`, `storeroom`, `format`, `unitPrice`, `isStock`, `isPrefor`, `isPayment`, `content`, `company`)
SELECT '2026111101', '卧室家具四件套', 0, 0, 100000, 1, 30, 8, 0, '', 9999000, 1, 0, 0,
       '11·11补贴:价值9999元卧室四件套,核销至2027-06-30', 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM information.awardstock WHERE `no` = '2026111101'
);

INSERT INTO information.awardstock
  (`no`, `name`, `purchase`, `selling`, `num`, `status`, `type`, `subtype`, `storeroom`, `format`, `unitPrice`, `isStock`, `isPrefor`, `isPayment`, `content`, `company`)
SELECT '2026111102', '臻品眠床', 0, 0, 300000, 1, 30, 8, 0, '', 4000000, 1, 0, 0,
       '11·11补贴:价值4000元臻品眠床(1.8*2.0m含床架),核销至2027-06-30', 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM information.awardstock WHERE `no` = '2026111102'
);

-- ============ 二、activityitem 挂现存 in-window 生效装修活动(每活动 2 行 type=30) ============

INSERT INTO information.activityitem
  (`aid`, `activity`, `name`, `type`, `asid`, `money`, `integral`)
SELECT
  a.`aid`, a.`name`, '卧室家具四件套', 30,
  (SELECT s.`asid` FROM information.awardstock s WHERE s.`no` = '2026111101' AND s.`name` = '卧室家具四件套' LIMIT 1),
  9999000, 0
FROM information.`activity` a
WHERE a.`type` = 1 AND a.`status` = 0 AND a.`company` > 0
  AND a.`startTime` <= '2026-11-15 23:59:59' AND a.`endTime` >= '2026-11-10 00:00:00'
  AND NOT EXISTS (
    SELECT 1 FROM information.activityitem i
    WHERE i.`aid` = a.`aid` AND i.`type` = 30 AND i.`money` = 9999000
  );

INSERT INTO information.activityitem
  (`aid`, `activity`, `name`, `type`, `asid`, `money`, `integral`)
SELECT
  a.`aid`, a.`name`, '臻品眠床', 30,
  (SELECT s.`asid` FROM information.awardstock s WHERE s.`no` = '2026111102' AND s.`name` = '臻品眠床' LIMIT 1),
  4000000, 0
FROM information.`activity` a
WHERE a.`type` = 1 AND a.`status` = 0 AND a.`company` > 0
  AND a.`startTime` <= '2026-11-15 23:59:59' AND a.`endTime` >= '2026-11-10 00:00:00'
  AND NOT EXISTS (
    SELECT 1 FROM information.activityitem i
    WHERE i.`aid` = a.`aid` AND i.`type` = 30 AND i.`money` = 4000000
  );

-- ============ 验证段 ============

-- 0. 目标活动数(执行前后比对, 干跑 2026-11-09 = 69 活动 / 52 公司)
SELECT COUNT(*) AS targetActs, COUNT(DISTINCT company) AS targetComps
FROM information.activity
WHERE type = 1 AND status = 0 AND company > 0
  AND startTime <= '2026-11-15 23:59:59' AND endTime >= '2026-11-10 00:00:00';

-- 1. 奖品档案: 期望 2 行, num 合计 400000(毫)=400 份
SELECT `no`, `name`, num, num DIV 1000 AS `份数`, unitPrice DIV 1000 AS `面值元`, status, type, company
FROM information.awardstock WHERE `no` IN ('2026111101','2026111102');

-- 2. 挂券行数: 期望 = targetActs×2 = 138, diffExpect0 = 0
SELECT COUNT(*) AS itemCnt,
       COUNT(*) - 2 * (SELECT COUNT(*) FROM information.activity
         WHERE type = 1 AND status = 0 AND company > 0
           AND startTime <= '2026-11-15 23:59:59' AND endTime >= '2026-11-10 00:00:00') AS diffExpect0
FROM information.activityitem i
JOIN information.activity a ON a.`aid` = i.`aid`
WHERE i.type = 30 AND i.money IN (9999000, 4000000)
  AND a.type = 1 AND a.status = 0 AND a.company > 0
  AND a.startTime <= '2026-11-15 23:59:59' AND a.endTime >= '2026-11-10 00:00:00';

-- 3. 抽样(武汉方林3542): 两档齐全 + asid/库存联动 + money 降序(先四件套后眠床)
SELECT a.company, a.`name` AS activityName, i.`name`, i.money DIV 1000 AS `面值元`, i.asid, s.num DIV 1000 AS `剩余份`
FROM information.activityitem i
JOIN information.activity a ON a.`aid` = i.`aid`
JOIN information.awardstock s ON s.`asid` = i.`asid`
WHERE i.type = 30 AND a.`aid` = 3542
ORDER BY i.money DESC;

-- 4. 缺口公司复核(板块内无 in-window 生效活动, 期望=上述 16 家签约公司+3 家壳公司)
SELECT c.cid, c.name FROM communion.company c
WHERE c.cid > 0
  AND (c.name LIKE '%方林%' OR c.name LIKE '%爱林%' OR c.name LIKE '%恩林%' OR c.name LIKE '%屿林%' OR c.name LIKE '%1918%')
  AND NOT EXISTS (
    SELECT 1 FROM information.activity a
    WHERE a.company = c.cid AND a.type = 1 AND a.status = 0
      AND a.startTime <= '2026-11-15 23:59:59' AND a.endTime >= '2026-11-10 00:00:00'
  )
ORDER BY c.cid;
