-- ============================================================================
-- 文件: 37_busitype_designreturn_panjin43.sql
-- 库表: data.decorationbusitype
-- 用途: 盘锦宜家(company=43)增加业务类型「设计返单客源」
-- 口径: 照同公司同族「工程返单客源」(dbid=2682)指纹: type=2(SOURCE客源, 与43公司现有5行全一致)
--   no=4(全系统设计返单惯例号, 43现用no{1,2,3,5,37}未占用)/sort=4/isRefer=1(返单类报备, 同工程返单)/
--   isAward=0/isMember=0/outside=0/status=0启用;
--   其余公司先例type=0系各公司用法差异, 43公司统一客源口径以本司现状为准
-- 生效: 即插即生效免重启(字典每次现查)
-- 执行前置条件: 无
-- 回滚方式: DELETE FROM data.decorationbusitype WHERE company = 43 AND name = '设计返单客源';
-- 幂等性: NOT EXISTS防重, 可重复执行
-- ============================================================================

INSERT INTO data.decorationbusitype (no, name, alias, fdbid, outside, sort, type, isRefer, isAward, isMember, status, company)
SELECT 4, '设计返单客源', '设计返单客源', NULL, 0, 4, 2, 1, 0, 0, 0, 43
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM data.decorationbusitype WHERE company = 43 AND name = '设计返单客源'
);

-- 验证: 期望新增1行(no=4/type=2/status=0)
SELECT dbid, no, name, alias, sort, type, isRefer, isAward, isMember, status
FROM data.decorationbusitype WHERE company = 43 ORDER BY sort;
