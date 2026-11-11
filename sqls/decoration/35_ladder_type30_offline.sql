-- ============================================================================
-- 文件: 35_ladder_type30_offline.sql
-- 库表: information.activityitem / decoration.decorationactivityitem
-- 用途: 大大方方11·11活动终止下线(保留重启能力版)——
--       🔴 保留(用户拍板: 后续可能启用该业务逻辑, 重开零配置):
--          · awardstock 两奖品档案 asid=12847四件套/12848床(num=0 库存闸天然关闭, status=1 屏蔽领用)
--          · constant 字典4行(cid=2657~2660, field=TYPE_LADDER_LOTTERY_INT)——历史流水类型列显示不受影响
--       删除/失效:
--          ① activityitem 全部挂券行 140 行(70四件套+70床, 实证仅挂此两 asid)——物理删
--          ② decorationactivityitem 预占行 10 行(state 0→1 + 下线标记)——置失效不物理删
--             (activityrecord/awardrecord 引用, 保留审计链; 已失效19行不动, state=2=0 即 34号召回已执行)
-- 范围边界(实证 2026-11-11):
--       · awardstock 撞号手工行 asid=12855/12856(no=2026111101 水一方海味礼盒, 他人配置)不碰
--       · 手工残留 asid=12832/12842/12843(集团年终四件套/床, type=1)不属 type=30, 不删
--       · decorationscaledetail 表保留(阶梯券通用功能基础设施, 0数据)
--       · activity 主表无需动(49号未建活动行)
-- 执行前置条件(生产干跑实证 2026-11-11):
--       ① 34号召回SQL已执行(state=2=0); ② 库存 num=0; ③ decorationscaledetail=0行
-- 回滚方式: 依备份表 INSERT SELECT 还原挂券行; 预占行为 state/content 置换, 可同法回写
-- 幂等性: DELETE 精确键值, 重复执行零效果; UPDATE state=0 守卫
-- ============================================================================

-- ============ 一、备份(两段各自建表并核对行数) ============

CREATE TABLE IF NOT EXISTS information.bak_activityitem_offline_20261111 AS
SELECT * FROM information.activityitem WHERE type = 30 AND asid IN (12847, 12848);
SELECT COUNT(*) AS bakItem_expect140 FROM information.bak_activityitem_offline_20261111;

CREATE TABLE IF NOT EXISTS decoration.bak_dai_ladder_offline_20261111 AS
SELECT * FROM decoration.decorationactivityitem WHERE type = 30 AND state = 0 AND asid IN (12847, 12848);
SELECT COUNT(*) AS bakDai_expect10 FROM decoration.bak_dai_ladder_offline_20261111;

-- ============ 二、删除挂券行 + 预占流水置失效 ============

-- 1. 活动物品挂券行(影响行数必须=140)
DELETE FROM information.activityitem WHERE type = 30 AND asid IN (12847, 12848);

-- 2. 预占流水置失效(影响行数必须=10)
UPDATE decoration.decorationactivityitem
SET state = 1,
    content = CONCAT(IFNULL(content, ''), '(活动下线失效2026-11-11)')
WHERE type = 30 AND state = 0 AND asid IN (12847, 12848);

-- ============ 验证段 ============

-- 1. 挂券行清零(期望=0)
SELECT COUNT(*) AS itemLeft_expect0 FROM information.activityitem WHERE type = 30;

-- 2. 流水终态: 期望 state=0 为0, state=1 共29行(19+10), 无 state=2
SELECT state, COUNT(*) AS cnt FROM decoration.decorationactivityitem
WHERE type = 30 AND asid IN (12847, 12848) GROUP BY state ORDER BY state;

-- 3. 保留资产确认: 奖品档案2行(num=0) + 字典4行 + 撞号行2行完好
SELECT asId, `no`, name, num FROM information.awardstock WHERE asid IN (12847, 12848, 12855, 12856);
SELECT cid, module, clazz, type, field, value FROM communion.constant WHERE field = 'TYPE_LADDER_LOTTERY_INT';

-- ============ 重启启用操作模板(届时执行) ============
-- ① 重新挂券: 重跑 sqls/information/49_dadafangfang_1111_ladder_activity_init.sql
--    (幂等: awardstock 段 NOT EXISTS 守卫自动跳过既有档案, activityitem 段按 aid+type+money 补插挂券行)
--    ⚠️ 宿主活动窗口若已过期, 窗口规则选不中目标活动——届时需新挂活动行或对现存活动延窗
-- ② 恢复库存: UPDATE information.awardstock SET num = 目标份数*1000 WHERE asId = 12847/12848;
-- ③ 历史作废单可重新参与(每单一张闸对失效行放行), 签约按当时库存正常发放
