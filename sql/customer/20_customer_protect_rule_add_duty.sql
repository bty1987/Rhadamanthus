-- =============================================
-- 客户保护规则表添加岗位关联字段
-- =============================================
-- 文档编号: SQL-2026-001
-- 创建日期: 2026-04-08
-- 作者: 系统
-- 描述: 在 customerprotectrule 表中添加 did 字段关联岗位表
-- =============================================

-- 添加岗位关联字段
ALTER TABLE customer.customerprotectrule
ADD COLUMN did INT(11) DEFAULT NULL COMMENT '岗位ID' AFTER lowval;

-- 添加索引以提升查询性能
ALTER TABLE customer.customerprotectrule
ADD INDEX idx_did (did);

-- =============================================
-- 可选：添加外键约束（根据实际需要决定是否执行）
-- =============================================
-- ALTER TABLE customer.customerprotectrule
-- ADD CONSTRAINT fk_protectrule_duty
-- FOREIGN KEY (did) REFERENCES communion.duty(did)
-- ON DELETE SET NULL
-- ON UPDATE CASCADE;

-- =============================================
-- 验证语句
-- =============================================
-- 查看表结构
DESC customer.customerprotectrule;

-- 查看索引
SHOW INDEX FROM customer.customerprotectrule WHERE Key_name = 'idx_did';
