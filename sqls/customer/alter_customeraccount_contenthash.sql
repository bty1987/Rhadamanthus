-- 给已有 customeraccount 表增加 contentHash 字段和唯一索引
-- 如果表还未创建, 请使用 create_customeraccount.sql 代替

ALTER TABLE communion.customeraccount
  ADD COLUMN `contentHash` VARCHAR(32) DEFAULT NULL COMMENT '6个业务字段的MD5摘要, 用于快速比对' AFTER `updateTime`,
  ADD UNIQUE KEY `uk_cid_hash` (`cid`, `contentHash`);

-- 回填已有记录的 contentHash
UPDATE communion.customeraccount
SET contentHash = MD5(CONCAT_WS('|',
    IFNULL(`no`, ''),
    IFNULL(`name`, ''),
    IFNULL(`address`, ''),
    IFNULL(`phone`, ''),
    IFNULL(`bank`, ''),
    IFNULL(`bankno`, '')
));
