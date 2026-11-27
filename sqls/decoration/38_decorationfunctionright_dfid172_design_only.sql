-- =====================================================================
-- 38: 下线「图纸-合同文件显示」(dfid=172) 非设计岗位配置
-- =====================================================================
-- 用途:
--   decorationfunctionright 删除 dfid=172(decorationfunction.name=图纸-合同文件显示,
--   key=nodes.picture.opt.show, value=contractFiles) 的非设计系岗位全部公司配置行,
--   仅保留设计系三岗位(designer / designerdept / designermanager)。
--   效果: 其他岗位装修单详情不再显示"合同文件"查看入口(功能下线)。
-- 背景: 客户电话泄露治理配套——合同文件查看入口收口至设计岗位。
-- 执行前置条件:
--   - 生产 platform.decorationfunctionright 中 dfid=172 现状 843 行
--     (设计系 228 行 / 非设计 615 行, 2026-11-27 只读副本实测; 生产主库如略有出入,
--      以备份表实际行数为准, DELETE 本身幂等无风险)
--   - 邻近功能项不在本批次: dfid=77「合同」按钮 / 142「图纸-合同方案显示」/
--     144「图纸-合同备档显示」/ 179「合同(设计)」均保持不动
-- 回滚方式:
--   INSERT INTO platform.decorationfunctionright (name, dfid, company)
--   SELECT name, dfid, company FROM platform.decorationfunctionright_bak_38_20261127 b
--   WHERE NOT EXISTS (SELECT 1 FROM platform.decorationfunctionright x
--                     WHERE x.dfrid = b.dfrid);
--   (备份表含 dfrid 主键原值, 可精确还原; 全量回滚亦可仅按 NOT EXISTS 防重)
-- 验证语句:
--   SELECT name, COUNT(*) FROM platform.decorationfunctionright WHERE dfid = 172 GROUP BY name;
--   -- 预期仅剩 designer / designerdept / designermanager 三行组, 总行数 = 备份表设计系行数
--   SELECT COUNT(*) FROM platform.decorationfunctionright WHERE dfid = 172;   -- 预期 228
-- =====================================================================

-- 1. 备份(幂等: 重建)
DROP TABLE IF EXISTS platform.decorationfunctionright_bak_38_20261127;
CREATE TABLE platform.decorationfunctionright_bak_38_20261127 AS
SELECT * FROM platform.decorationfunctionright WHERE dfid = 172;

-- 2. 删除非设计系岗位配置(designer / designerdept / designermanager 之外全删, DELETE 幂等)
DELETE FROM platform.decorationfunctionright
WHERE dfid = 172
  AND name NOT IN ('designer', 'designerdept', 'designermanager');

-- 3. 验证
SELECT name, COUNT(*) cnt FROM platform.decorationfunctionright
WHERE dfid = 172 GROUP BY name ORDER BY name;

SELECT COUNT(*) remain_total FROM platform.decorationfunctionright WHERE dfid = 172;
