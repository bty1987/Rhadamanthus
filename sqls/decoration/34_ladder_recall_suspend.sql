-- ============================================================================
-- 文件: 34_ladder_recall_suspend.sql
-- 库表: decoration.decorationactivityitem
-- 用途: 大大方方11·11活动暂停(用户已将 awardstock asid=12847四件套/12848床 num清零)——
--       已发放(state=2)的 5 张券全部标记失效召回:
--       daiId=523373(2610220234/床/签约) 523400(2611080492/床/未签约直领) 523415(2610120057/床/未签约直领)
--            523441(2611100230/四件套/签约) 523510(2611050037/四件套/签约)
--       作废方式=state 2→1 + content 追加召回标记(保留全部流水痕迹)
-- 执行前置条件(2026-11-11 生产干跑实证):
--       ① state=2 且 asid∈(12847,12848) 的行=恰 5 行(超出则停下核查是否有新增发放);
--       ② decorationscaledetail 按 daiId 关联=0 行(5 券均未用于收款抵扣, 作废零下游账面影响);
--       ③ 库存已由用户清零(num=0/0)
-- 🔴 库存不回冲(与 33号 回冲逻辑的本质区别): 暂停是主动召回, 券作废后不再有效,
--       库存维持 0=活动关闭; 后续恢复活动=直接改 awardstock.num 至目标份数×1000(毫), 无需对账回补
-- 预占行(state=0)不动: 暂停期内引擎签约结算 return 0/领取 160038 拦截(全清零自动拒绝),
--       恢复库存后预占行自动续接正常结算——参与记录不丢, 比作废预占更优
-- 闭环说明: 券作废(state=1)后"每单一张闸"对失效行放行, 这 5 单恢复活动后可重新参与,
--       签约时按当时库存正常发放四件套/床——无需逐单补偿
-- 回滚方式: 依备份表还原 state/content(UPDATE 回写), 仅限恢复活动前
-- 幂等性: state=2 值级守卫, 重复执行零效果
-- ============================================================================

-- ============ 一、备份(先建并核对行数=5) ============

CREATE TABLE IF NOT EXISTS decoration.bak_dai_ladder_recall_20261111 AS
SELECT d.* FROM decoration.decorationactivityitem d
WHERE d.type = 30 AND d.state = 2 AND d.asid IN (12847, 12848);
SELECT COUNT(*) AS bakRows_expect5 FROM decoration.bak_dai_ladder_recall_20261111;

-- ============ 二、已发放券全部作废(影响行数必须=5) ============

UPDATE decoration.decorationactivityitem
SET state = 1,
    content = CONCAT(IFNULL(content, ''), '(活动暂停召回作废2026-11-11)')
WHERE daiId IN (523373, 523400, 523415, 523441, 523510)
  AND type = 30
  AND state = 2
  AND asid IN (12847, 12848);

-- ============ 三、关联复核(执行前必查, 期望=0; 非0则对应 daiId 停止作废并人工核对收款配比) ============

SELECT COUNT(*) AS scaleLinked_expect0
FROM decoration.decorationscaledetail
WHERE daiId IN (523373, 523400, 523415, 523441, 523510);

-- ============ 验证段 ============

-- 1. 5券终态: 期望全部 state=1 + 召回标记
SELECT daiId, orderId, asid, state, money DIV 1000 AS faceYuan, content
FROM decoration.decorationactivityitem
WHERE daiId IN (523373, 523400, 523415, 523441, 523510);

-- 2. 两奖品下无任何 state=2 残留(期望=0) + 全状态分布
SELECT COUNT(*) AS receivedLeft_expect0 FROM decoration.decorationactivityitem
WHERE type = 30 AND state = 2 AND asid IN (12847, 12848);
SELECT state, COUNT(*) AS cnt FROM decoration.decorationactivityitem
WHERE type = 30 AND asid IN (12847, 12848) GROUP BY state ORDER BY state;

-- 3. 库存暂停态确认: 期望 12847/12848 num=0
SELECT asId, `no`, name, num FROM information.awardstock WHERE asId IN (12847, 12848);

-- ============ 恢复活动操作模板(届时执行) ============
-- UPDATE information.awardstock SET num = 100000 WHERE asId = 12847;  -- 四件套恢复100张
-- UPDATE information.awardstock SET num = 300000 WHERE asId = 12848;  -- 床恢复300张(如需扣除已召回量自行调整)
-- 恢复后预占行自动续接, 作废过的单可重新参与
