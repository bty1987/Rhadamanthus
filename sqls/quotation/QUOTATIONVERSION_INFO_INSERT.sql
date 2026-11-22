-- ============================================================================
-- 文件: QUOTATIONVERSION_INFO_INSERT.sql
-- 库表: quotation.quotationversion(报价版本,页面: 报价/预报单的版本下拉、报价版本管理页)
-- 用途: 生产环境版本信息新增/更新的 INSERT 语句(模板+按公司复制费率两个形态)。
-- 字段口径(对照生产近期行惯例):
--   no           全局唯一, 现网格式 QV_{序号}, 当前最大序号 3007 → 新行从 QV_3008 起递增;
--   name         版本名称(下拉显示名);
--   trafficRate/trafficDiscount  车运费比例(×1000)/车运费打折开关(0不打折,1打折);
--   manageRate/manageDiscount    管理费比例(×1000)/管理费打折开关;
--   taxRate/taxDiscount          税金比例(×1000)/税金打折开关;
--   offset       历史遗留字段, 现行代码无消费方, 给 0 即可(最新行 QV_245 即 0);
--   defaultFlag  0普通/1默认——每公司每 type 仅允许一个默认(程序侧 count>1 拒绝),
--                插入 defaultFlag=1 前先确认同公司同 type 无既有默认, 或先清零;
--   type         版本用途: -1=报价(主流), 1/0 见历史行(合同终止/管理类), 新增报价版本用 -1;
--   status       0=启用, 1=禁用; 新增一律 0;
--   company      公司 cid(communion.company)。
-- 执行前核对:
--   ① SELECT no FROM quotation.quotationversion WHERE no = 'QV_3008';  期望空(序号未被占用)
--   ② SELECT qvid, no, name FROM quotation.quotationversion
--     WHERE company = :公司cid AND type = -1 AND defaultFlag = 1;      期望至多 1 行(默认版本现状)
-- 回滚方式: DELETE FROM quotation.quotationversion WHERE no = 'QV_3008';(无下游引用时可删;
--           若已被报价单引用则禁删, 走 status=1 禁用)
-- 幂等性: NOT EXISTS 守卫, 重复执行跳过(MySQL 5.6 必须 FROM DUAL, 裸 SELECT..WHERE 语法错)。
-- ============================================================================

-- ① 单行新增模板(填占位符后执行)
INSERT INTO quotation.quotationversion
  (no, name, trafficRate, trafficDiscount, manageRate, manageDiscount, taxRate, taxDiscount, offset, defaultFlag, type, status, comment, company)
SELECT 'QV_3008', '版本名称', 0, 0, 165, 0, 35, 2, 0, 0, -1, 0, NULL, 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationversion WHERE no = 'QV_3008');

-- ② 按公司复制最新版费率(新版本费率通常沿用该公司现行版本, 只改 no/name):
--    将 :company 换成公司 cid、:新名称 换成版本名称; 费率取该公司 qvid 最大的一行
INSERT INTO quotation.quotationversion
  (no, name, trafficRate, trafficDiscount, manageRate, manageDiscount, taxRate, taxDiscount, offset, defaultFlag, type, status, comment, company)
SELECT 'QV_3008', '新版本名称', v.trafficRate, v.trafficDiscount, v.manageRate, v.manageDiscount, v.taxRate, v.taxDiscount, 0, 0, -1, 0, v.comment, v.company
FROM (SELECT trafficRate, trafficDiscount, manageRate, manageDiscount, taxRate, taxDiscount, comment, company
      FROM quotation.quotationversion
      WHERE company = 0                     -- ◆ 换成目标公司 cid
      ORDER BY qvid DESC LIMIT 1) v
WHERE NOT EXISTS (SELECT 1 FROM quotation.quotationversion WHERE no = 'QV_3008');

-- ③ (可选)新版本设为该公司默认: 先清同公司同 type 既有默认再置 1(与程序
--    updateQuotationVersionForDefault 的"每公司每type唯一默认"口径一致)
-- UPDATE quotation.quotationversion SET defaultFlag = 0
--  WHERE company = 0 AND type = -1 AND defaultFlag = 1;                -- ◆ 换公司cid
-- UPDATE quotation.quotationversion SET defaultFlag = 1
--  WHERE no = 'QV_3008';

-- ============================================================================
-- 验证语句(执行后核对):
--   SELECT qvid, no, name, trafficRate, manageRate, taxRate, defaultFlag, type, status, company
--   FROM quotation.quotationversion WHERE no LIKE 'QV_3008%';
--   ② 每公司每 type 默认唯一性:
--   SELECT company, type, COUNT(*) FROM quotation.quotationversion
--   WHERE defaultFlag = 1 GROUP BY company, type HAVING COUNT(*) > 1;   期望空
-- 生效方式: 纯数据行, 免发版免重启, 各报价/预报单页面的版本下拉即时可见。
-- ============================================================================
