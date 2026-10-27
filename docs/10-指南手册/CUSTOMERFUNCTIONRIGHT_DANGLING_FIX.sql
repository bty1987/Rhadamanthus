-- ============================================================================
-- CUSTOMERFUNCTIONRIGHT_DANGLING_FIX.sql
-- platform.customerfunctionright 悬空 cfid 修复(2026-10-02 生产报错排查)
--
-- 现象: queryCustomerFunctionRight 抛
--   ObjectNotFoundException: [com.fanglin.customer.po.CustomerFunctionPO#38]
--   (CustomerFunctionRightDaoImpl.queryCustomerFunctionRight:22)
--
-- 根因: CustomerFunctionRightPO.customerFunction 系 EAGER ManyToOne
--   关联 platform.customerfunctionright.cfid → customer.customerOriginfunction.cfid。
--   customerOriginfunction 的 38~43(feedback 组 6 项)与 47(revisit 组 1 项)已被删除
--   (应用层无删除接口, 系直接 SQL 清理; dev 同样缺失, 仓库亦无创建脚本, 无原文可恢复),
--   但按公司同步的 right 绑定未随删, 共 679 行孤儿(7 cfid × 97 公司, 97=全部公司)。
--   任一公司加载 name='feedback'/'revisit' 页面配置即触发整个接口报错。
--
-- 同类排查(2026-10-02): 其余 8 个 functionright 家族(approval/construction/
--   decoration/payment/production/quotation/sales/user)悬空引用均为 0, 无同类雷。
--
-- 修法: 删除孤儿绑定。feedback 页将少 6 个配置项 / revisit 少 1 个(若原删除系有意
--   清理则为预期行为); 若系误删, 须先从 RDS 备份恢复 customerOriginfunction 的
--   7 行原文再放弃本脚本。本脚本幂等, 可重复执行。
-- ============================================================================

-- 1) 安检: 应恰好返回 7 组(cfid 38-43,47), 各 97 行, 合计 679
SELECT cfr.cfid, COUNT(*) cnt
  FROM platform.customerfunctionright cfr
  LEFT JOIN customer.customeroriginfunction cf ON cf.cfid = cfr.cfid
 WHERE cf.cfid IS NULL
 GROUP BY cfr.cfid;

-- 2) 备份(留档可回滚)
CREATE TABLE IF NOT EXISTS platform.customerfunctionright_bak_20261002 AS
SELECT * FROM platform.customerfunctionright
 WHERE cfid IN (38,39,40,41,42,43,47);

-- 3) 修复: 删除悬空绑定
DELETE FROM platform.customerfunctionright
 WHERE cfid IN (38,39,40,41,42,43,47);

-- 4) 核验: 应为 0
SELECT COUNT(*) AS dangling_remaining
  FROM platform.customerfunctionright cfr
  LEFT JOIN customer.customeroriginfunction cf ON cf.cfid = cfr.cfid
 WHERE cf.cfid IS NULL;
