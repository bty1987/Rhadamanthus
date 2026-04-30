-- ============================================================
-- 报价分配沟通消息表 (QuotationAssignTalk)
-- 创建日期: 2026-04-30
-- 说明: 设计师与预算员基于装修单号的沟通消息，支持钉钉通知
-- ============================================================

CREATE TABLE IF NOT EXISTS `quotationassigntalk` (
  `qatid`      BIGINT(20)    NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `orderId`    VARCHAR(15)   NOT NULL                COMMENT '装修单号（关联 decoration.orderId）',
  `senderUid`  INT(11)       NOT NULL                COMMENT '发送人用户ID（关联 user.uid）',
  `content`    VARCHAR(2000) NOT NULL                COMMENT '消息内容',
  `sendTime`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  `type`       SMALLINT(6)   NOT NULL DEFAULT 0      COMMENT '消息类型：1-设计师发给预算员，2-预算员发给设计师',
  `createTime` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`qatid`),
  KEY `idx_orderId` (`orderId`),
  KEY `idx_sendTime` (`sendTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报价分配沟通消息表';
