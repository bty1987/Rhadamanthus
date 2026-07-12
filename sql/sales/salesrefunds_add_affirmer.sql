-- 为销售退款表添加确认人字段
-- 日期: 2026-04-09
-- 说明: 记录谁确认了退货单

USE sales;

-- 添加确认人字段
ALTER TABLE salesrefunds ADD COLUMN auid INT NULL COMMENT '确认人ID' AFTER affirmTime;

-- 添加外键关联到用户表
ALTER TABLE salesrefunds
ADD CONSTRAINT FK_salesrefunds_auid
FOREIGN KEY (auid) REFERENCES communion.user (uid)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- 添加索引以提高查询性能
CREATE INDEX IDX_salesrefunds_auid ON salesrefunds(auid);
