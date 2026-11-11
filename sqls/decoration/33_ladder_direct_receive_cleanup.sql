-- ============================================================================
-- 文件: 33_ladder_direct_receive_cleanup.sql
-- 库表: decoration.decorationactivityitem / information.awardstock
-- 用途: 大大方方11·11限量券存量修复——修复前(v1错挂asid时代)3张假降级床券处置:
--       ① daiId=523373 (2610220234, 沈阳爱林37): 签约结算合法(contractTime=receiveTime 同秒) → 追认, 不动
--       ② daiId=523400 (2611080492, 宜昌爱林51): 未签约直领(contractTime空)      → 作废回冲
--       ③ daiId=523415 (2610120057, 沈阳屿林3):  未签约直领(contractTime空)      → 作废回冲
--       作废回冲=券行 state 2→1(保留流水痕迹+content标记) + 床库存回冲 num+1000/张;
--       回冲后两单可重新参与(每单一张闸对失效行放行), 签约时按修复后引擎正常发四件套
-- 判断依据(生产实查 2026-11-11):
--       3券均为 activityitem asid 错挂时代(asid=12842 num=0)假降级产物, 引擎按降序先四件套后床,
--       四件套档 deduct 恒败→全部落床; asid 已修复(12847), 引擎已恢复先发四件套(今早2张四件套实发实证)
-- 执行前置条件:
--       ① activityitem asid 修复 UPDATE 已执行(四件套70行 asid=12847, 已于2026-11-11上午生效);
--       ② 3券无收款配比关联: SELECT COUNT(*) FROM decoration.decorationscaledetail WHERE daiId IN (523373,523400,523415); 必须=0(2026-11-11实查=0)
--       ③ 3券仍为 state=2 且 asid=12848(UPDATE 值级守卫兜底)
-- 回滚方式: 依备份表还原券行 state/content + awardstock.num 回减(仅限两单未重新参与前)
-- 幂等性: UPDATE 值级守卫(state=2 才动), 重复执行零效果; 库存回冲以 ROW_COUNT() 守卫不单独执行
-- 注意: 库存回冲与券行作废在同一事务由应用侧执行时需分别核对行数; 本脚本两条 UPDATE 独立执行,
--       第二条(num+2000)执行前必须确认第一条影响行数=2, 不符立即停止并核查
-- ============================================================================

-- ============ 一、备份(先建并核对行数=3) ============

CREATE TABLE IF NOT EXISTS decoration.bak_dai_ladder_direct_20261111 AS
SELECT d.* FROM decoration.decorationactivityitem d WHERE d.daiId IN (523373, 523400, 523415);
SELECT COUNT(*) AS bakRows_expect3 FROM decoration.bak_dai_ladder_direct_20261111;

-- ============ 二、两单未签约直领券作废(影响行数必须=2) ============

UPDATE decoration.decorationactivityitem
SET state = 1,
    content = CONCAT(IFNULL(content, ''), '(未签约直领作废回冲2026-11-11)')
WHERE daiId IN (523400, 523415)
  AND state = 2
  AND asid = 12848;

-- ============ 三、床库存回冲2张(确认上一步影响行数=2 后执行) ============

UPDATE information.awardstock
SET num = num + 2000
WHERE asId = 12848
  AND `no` = '2026111102'
  AND name = '臻品眠床';
-- 期望终值: 297000 + 2000 = 299000(=已发四件套2张后的正确账面: 床300-1签约追认=299)

-- ============ 验证段 ============

-- 1. 3券终态: 期望 523373=state2(追认), 523400/523415=state1+作废标记
SELECT daiId, orderId, state, money, content FROM decoration.decorationactivityitem WHERE daiId IN (523373, 523400, 523415);

-- 2. 库存账实核对: 床 num=299000(300-签约追认1张), 四件套=100000-实际签约发放数
SELECT asId, `no`, name, num, num DIV 1000 AS sheetsLeft FROM information.awardstock WHERE asId IN (12847, 12848);

-- 3. 全量发放行状态分布(后续对账基线)
SELECT state, money, COUNT(*) AS cnt FROM decoration.decorationactivityitem
WHERE type = 30 AND asid IN (12847, 12848) GROUP BY state, money ORDER BY state, money;

-- ============ 监控段(活动期每日跑, 期望恒为0行; 出行=非签约来源发放, 按流水追责) ============

SELECT d.daiId, d.orderId, d.state, d.receiveTime, c.contractTime, c.company
FROM decoration.decorationactivityitem d
JOIN decoration.decoration c ON c.orderId = d.orderId
WHERE d.type = 30 AND d.state = 2
  AND (c.contractTime IS NULL OR d.receiveTime > c.contractTime);
