-- =====================================================================
-- 用途: 报价版本增加「关联标识」列【报价项创建/编辑关联项目约束, 方案=docs/01-方案设计/报价明细规格更换方案.md 关联体系】
--   relateFlag int NOT NULL DEFAULT 0: 0=自由关联(缺省, 存量版本行为不变) 1=必须关联项目(该版本下报价项创建/编辑保存时强制校验已挂规格)
--   生效点: quotationItem页创建/编辑保存(前端提示) + addQuotationItem/updateQuotationItem服务端兜底(200080「报价版本要求关联项目(规格)」)
--   维护入口: 报价版本维护页(updateQuotationVersionModal)关联标识开关
-- 执行前置条件:
--   先于 fanglin-data jar 发版; 🔴MySQL 5.6 无 ADD COLUMN IF NOT EXISTS, 重复执行报 Duplicate column 即已生效
-- 回滚方式:
--   ALTER TABLE quotation.quotationVersion DROP COLUMN relateFlag;  (回滚前确认无版本依赖强关联约束)
-- 验证语句:
--   SHOW COLUMNS FROM quotation.quotationVersion LIKE 'relateFlag';  -- 应 1 行 int NOT NULL DEFAULT 0
--   SELECT relateFlag, COUNT(*) FROM quotation.quotationVersion GROUP BY relateFlag;  -- 存量全 0
-- 幂等性: 非幂等(ALTER), 报错即已生效
-- =====================================================================

ALTER TABLE quotation.quotationVersion ADD COLUMN relateFlag int NOT NULL DEFAULT 0 COMMENT '关联标识 0:自由关联 1:必须关联项目(报价项创建/编辑约束)';
