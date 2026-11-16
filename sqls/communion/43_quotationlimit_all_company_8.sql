-- =============================================================
-- 用途: systemconfig 各公司 quotationlimit(每装修单报价单数量上限,
--       缺省3,超限抛200001"报价已经达到数量上限")统一调整为 8
-- 范围: 103家在营公司(status=0,排除cid=0集团占位与cid=54已停用)
--       ①已配69家(现值全=5) UPDATE → '8'
--       ②未配33家 INSERT value='8'(comment对齐既有行"报价数量限制")
-- 语义: 放宽(5/3→8),已建报价单不受影响,仅新建上限变化;免重启,改库即生效
-- 前置: 无jar依赖;两条均幂等可重跑
-- 回滚: UPDATE communion.systemconfig SET value='5' WHERE `key`='quotationlimit' AND company IN (69家清单);
--       DELETE FROM communion.systemconfig WHERE `key`='quotationlimit' AND company IN (33家清单);
--       (清单见验证段输出;或按comment='报价数量限制,2026-11-15统一调整至8'定位新增行)
-- 验证: SELECT value, COUNT(*) FROM communion.systemconfig WHERE `key`='quotationlimit' GROUP BY value;  -- 预期 '8'=102
--       SELECT COUNT(*) FROM communion.company c WHERE c.status=0 AND c.cid<>0 AND c.cid<>54
--         AND NOT EXISTS (SELECT 1 FROM communion.systemconfig sc WHERE sc.`key`='quotationlimit' AND sc.company=c.cid);  -- 预期0
-- =============================================================

-- ① 已配公司统一调整为 8
UPDATE communion.systemconfig
SET value = '8'
WHERE `key` = 'quotationlimit' AND value <> '8';

-- ② 未配公司补齐 8(comment 沿用既有文案,cuid 对齐既有行惯例=34)
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, comment, company)
SELECT NULL, 'quotationlimit', '8', 34, '报价数量限制', c.cid
FROM communion.company c
WHERE c.status = 0 AND c.cid <> 0 AND c.cid <> 54
  AND NOT EXISTS (SELECT 1 FROM communion.systemconfig sc WHERE sc.`key` = 'quotationlimit' AND sc.company = c.cid);
