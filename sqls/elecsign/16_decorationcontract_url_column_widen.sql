-- =============================================================================
-- 装修合同表 URL 列加长：varchar(256) → varchar(2048)
-- =============================================================================
-- 用途：e签宝 generate 返回的 fileDownloadUrl 为 OSS 临时签名地址（500~900字符），
--       塞入 varchar(256) 触发 Data too long，合同生成事务回滚。
--       download / viewpdf / path 三列一并加长（同族 URL 用途）。
--
-- 前置条件：无（纯列宽调整，幂等——重复执行 MODIFY 同定义无害）。
-- 影响评估：仅加宽不改类型，老法大大短路径数据不受影响；Hibernate PO 映射为
--           String 无 length 约束，无需同步改代码。
--
-- 执行时机：先于（或同批）fanglin-decoration + fanglin-esign jar 部署。
--
-- 回滚方式：不建议回滚（列宽只增不减）；确需回退 varchar(256) 会截断 e签宝 URL。
--
-- 验证语句：
--   SHOW COLUMNS FROM decoration.decorationcontract LIKE 'download';
--   → Type 应为 varchar(2048)
-- =============================================================================
ALTER TABLE decoration.decorationcontract
	MODIFY download varchar(2048),
	MODIFY viewpdf varchar(2048),
	MODIFY path varchar(2048);
