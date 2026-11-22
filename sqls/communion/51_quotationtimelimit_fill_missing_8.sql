-- =============================================================
-- 用途: systemconfig 各公司 quotationtimelimit(报价复制/拷贝次数上限,
--       装修单维度计数 decoration.quotationTimeLimit,超限抛200018
--       "报价复制次数达到上线";代码缺省3)对未配置公司补配
-- 参考: 43号(quotationlimit 同模式,该key未配公司此前同样走缺省3)
-- 范围: 102家在营公司(status=0,排除cid=0集团占位与cid=54已停用)中
--       未配置的95家 INSERT value='8'(不动已有行)
--       已配7家现值全='8'(cid=1,2,3,7,8,16,93),无需UPDATE
-- 语义: 未配公司此前走代码缺省3,补配8后复制/拷贝上限 3→8 放宽;
--       已建装修单的 quotationTimeLimit 计数不受影响,仅后续校验阈值变化;
--       免重启,改库即生效(每次校验实时 querySystemConfig)
-- 惯例: 对齐既有7行——`group`=NULL / cuid=34 / comment='报价复制/拷贝次数限制'
-- 前置: 无jar依赖;NOT EXISTS 守卫幂等可重跑
-- 回滚: DELETE FROM communion.systemconfig
--       WHERE `key`='quotationtimelimit'
--         AND company NOT IN (1,2,3,7,8,16,93);   -- 只删本次新增行,已配7家不动
-- 验证: SELECT value, COUNT(*) FROM communion.systemconfig WHERE `key`='quotationtimelimit' GROUP BY value;  -- 预期 '8'=102
--       SELECT COUNT(*) FROM communion.company c WHERE c.status=0 AND c.cid<>0 AND c.cid<>54
--         AND NOT EXISTS (SELECT 1 FROM communion.systemconfig sc WHERE sc.`key`='quotationtimelimit' AND sc.company=c.cid);  -- 预期0
-- =============================================================

-- 未配置的95家在营公司补配为 8
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, comment, company)
SELECT NULL, 'quotationtimelimit', '8', 34, '报价复制/拷贝次数限制', c.cid
FROM communion.company c
WHERE c.status = 0 AND c.cid <> 0 AND c.cid <> 54
  AND NOT EXISTS (SELECT 1 FROM communion.systemconfig sc WHERE sc.`key` = 'quotationtimelimit' AND sc.company = c.cid);
