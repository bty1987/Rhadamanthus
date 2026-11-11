-- ============================================================================
-- 文件: 35_ladder_type30_offline.sql
-- 库表: information.awardstock / information.activityitem / communion.constant /
--       decoration.decorationactivityitem
-- 用途: 大大方方11·11活动终止下线——type=30 限量券全部配置物理删除:
--       ① awardstock 两奖品档案(asid=12847四件套/12848床, num已由用户清零)
--       ② activityitem 全部挂券行(70四件套+70床=140行, 分布实证仅挂此两asid)
--       ③ constant 字典4行(cid=2657~2660, field=TYPE_LADDER_LOTTERY_INT)
--       ④ 发放流水(decorationactivityitem type=30): 预占10行置失效+标记(不物理删);
--          state=1 已失效19行不动; state=2 已领=0(34号召回SQL已执行)
-- 范围边界(实证 2026-11-11):
--       · awardstock 撞号手工行 asid=12855/12856(no=2026111101 水一方海味礼盒, 他人配置)不在删除范围——本脚本按 asid 精确删除
--       · 手工残留 asid=12832/12842/12843(集团年终四件套/床, type=1 物品非30)不属 type=30 范围, 不删
--       · decorationscaledetail 表保留(阶梯券通用功能基础设施, 现数据0行, 非本活动专属配置)
--       · activity 主表无需动(49号初始化未建活动行, 挂券已删即下线)
--       · awardrecord/decorationactivityrecord 发放流水保留(审计痕迹)
-- 🔴 字典删除影响: 历史流水行(type=30)页面类型列将显示为空/裸值30——功能已下线可接受;
--    若日后需回显, 依备份表还原字典行即可
-- 执行前置条件(生产干跑实证 2026-11-11):
--       ① 34号召回SQL已执行(state=2=0); ② 用户已清零两奖品库存(num=0); ③ decorationscaledetail=0行(零收款抵扣)
-- 回滚方式: 依各备份表 INSERT SELECT 还原(流水置失效行为仅 content/state, 可同法回写)
-- 幂等性: DELETE 精确键值, 重复执行零效果; UPDATE state=0 守卫
-- ============================================================================

-- ============ 一、备份(四段各自建表并核对行数) ============

CREATE TABLE IF NOT EXISTS information.bak_awardstock_offline_20261111 AS
SELECT * FROM information.awardstock WHERE asid IN (12847, 12848);
SELECT COUNT(*) AS bakStock_expect2 FROM information.bak_awardstock_offline_20261111;

CREATE TABLE IF NOT EXISTS information.bak_activityitem_offline_20261111 AS
SELECT * FROM information.activityitem WHERE type = 30 AND asid IN (12847, 12848);
SELECT COUNT(*) AS bakItem_expect140 FROM information.bak_activityitem_offline_20261111;

CREATE TABLE IF NOT EXISTS communion.bak_constant_ladder_20261111 AS
SELECT * FROM communion.constant WHERE field = 'TYPE_LADDER_LOTTERY_INT';
SELECT COUNT(*) AS bakDict_expect4 FROM communion.bak_constant_ladder_20261111;

CREATE TABLE IF NOT EXISTS decoration.bak_dai_ladder_offline_20261111 AS
SELECT * FROM decoration.decorationactivityitem WHERE type = 30 AND state = 0 AND asid IN (12847, 12848);
SELECT COUNT(*) AS bakDai_expect10 FROM decoration.bak_dai_ladder_offline_20261111;

-- ============ 二、删除配置数据 ============

-- 1. 奖品档案(影响行数必须=2)
DELETE FROM information.awardstock WHERE asid IN (12847, 12848);

-- 2. 活动物品挂券行(影响行数必须=140)
DELETE FROM information.activityitem WHERE type = 30 AND asid IN (12847, 12848);

-- 3. 字典4行(影响行数必须=4)
DELETE FROM communion.constant WHERE field = 'TYPE_LADDER_LOTTERY_INT';

-- 4. 预占流水置失效(影响行数必须=10; 不物理删——activityrecord/awardrecord 引用, 保留审计链)
UPDATE decoration.decorationactivityitem
SET state = 1,
    content = CONCAT(IFNULL(content, ''), '(活动下线失效2026-11-11)')
WHERE type = 30 AND state = 0 AND asid IN (12847, 12848);

-- ============ 三、可选: 流水物理删除(默认不执行——毁审计; 确需清干净时人工放开) ============
-- DELETE FROM decoration.decorationactivityitem WHERE type = 30 AND asid IN (12847, 12848);
-- (state=1 的29行一并删除; activityrecord/awardrecord 中对应流水将成为无主引用, 保留作历史)

-- ============ 验证段 ============

-- 1. 配置清零复核: 期望全部=0
SELECT COUNT(*) AS stockLeft_expect0 FROM information.awardstock WHERE asid IN (12847, 12848);
SELECT COUNT(*) AS itemLeft_expect0 FROM information.activityitem WHERE type = 30;
SELECT COUNT(*) AS dictLeft_expect0 FROM communion.constant WHERE field = 'TYPE_LADDER_LOTTERY_INT';

-- 2. 流水终态: 期望 state=0 为0, state=1 共29行(19+10), 无 state=2
SELECT state, COUNT(*) AS cnt FROM decoration.decorationactivityitem
WHERE type = 30 AND asid IN (12847, 12848) GROUP BY state ORDER BY state;

-- 3. 撞号行完好确认(期望2行, 水一方海味礼盒未误删)
SELECT asId, `no`, name FROM information.awardstock WHERE asid IN (12855, 12856);

-- ============ 遗留事项提示 ============
-- ① 前端 initLadderPanel/decoration4activity 阶梯面板代码保留: 无配置数据后显示"该装修单参加的活动均未配置阶梯奖品", 无需部署动作;
--    若日后彻底清理前端, 属代码任务另行安排
-- ② 37号 oid=26 收权SQL(sqls/communion/37)仍有效: 活动下线后 receiveDecorationActivityItem 授权更无业务方, 建议择期按该文件执行
-- ③ 手工残留行 asid=12832/12842/12843(集团年终四件套/床, type=1, num=0)如需清理, 另行确认后处理
