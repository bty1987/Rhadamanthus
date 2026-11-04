-- =====================================================================
-- 46号SQL: 作废 information.vpayment 2019年乱码会员号活动收款单 (23条)
-- =====================================================================
-- 用途:
--   删除 2019-05-10~12 批量乱造的乱码/空会员号未付款活动收款单23条
--   (vpid 53,173,404,750,970,984,995,1034,1562,1649,1992,2105,2176,
--    2446,2645,2664,3672,4137,4182,4333,4678,4861,4870)。
--   背景: 该批单 mno 非数字, 前端收款流程将其塞入 paytran.pid(Long)
--   触发 Struts 类型转换失败 → "No result defined ... result input"
--   异常(2026-11-04 09:01:30 生产实证, queryPaytran)。单挂未付款7年,
--   活动早已结束, 业务确认作废。配套前端守卫见 vpayment.js 三处。
-- 执行前置条件:
--   1. 段0自检 COUNT 必须 = 23, 不等即停, 人工核对差异后再跑
--   2. 只读核对(可选): SELECT 后确认无 status=1 的同 mno 单(防真收款误删)
-- 回滚方式:
--   INSERT INTO information.vpayment SELECT * FROM information.bak_vpayment_badmno_20261104;
--   (备份表为全列镜像, 回滚即原样复原)
-- 验证语句:
--   段3执行后应返回 0 行; 备份表应 23 行
-- 幂等性: DELETE 幂等, 重跑返回 0 行
-- =====================================================================

-- ---------- 段0: 前置自检 (必须=23, 不等即停) ----------
SELECT COUNT(*) AS should_be_23
FROM information.vpayment
WHERE status = 0
  AND (mno IS NULL OR mno NOT REGEXP '^[0-9]+$');

-- ---------- 段1: 备份表先行 (回报行数必须=23 后再跑段2) ----------
CREATE TABLE IF NOT EXISTS information.bak_vpayment_badmno_20261104 AS
SELECT * FROM information.vpayment
WHERE status = 0
  AND (mno IS NULL OR mno NOT REGEXP '^[0-9]+$');

SELECT COUNT(*) AS backup_should_be_23 FROM information.bak_vpayment_badmno_20261104;

-- ---------- 段2: 删除事务 (守卫=vpid清单+status=0+mno非法 三重, 防期间变化误删) ----------
START TRANSACTION;

DELETE FROM information.vpayment
WHERE vpid IN (
        53, 173, 404, 750, 970, 984, 995, 1034, 1562, 1649,
        1992, 2105, 2176, 2446, 2645, 2664, 3672, 4137, 4182, 4333,
        4678, 4861, 4870)
  AND status = 0
  AND (mno IS NULL OR mno NOT REGEXP '^[0-9]+$');

-- 下方 SELECT 应返回 23; 若 <23 说明有单在期间被收款/变动, ROLLBACK 后人工复核
SELECT ROW_COUNT() AS deleted_should_be_23;

COMMIT;
-- 若上一行 deleted != 23, 改执行: ROLLBACK;

-- ---------- 段3: 验证 (应返回 0 行) ----------
SELECT vpid, mno, money FROM information.vpayment
WHERE status = 0
  AND (mno IS NULL OR mno NOT REGEXP '^[0-9]+$');

SELECT COUNT(*) AS rollback_source_23 FROM information.bak_vpayment_badmno_20261104;
