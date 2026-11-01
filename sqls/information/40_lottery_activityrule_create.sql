-- ============================================================
-- 文件: sqls/information/40_lottery_activityrule_create.sql
-- 用途: 双人海外玩翻天抽奖券——奖励规则独立表 activityrule 建表 + activity 加列 rewardType
--       (规则一行一档位: 签约赠/预存每满/预存阶梯; rewardType 为引擎定位锚点)
-- 前置: 无 (纯新增, 不触碰既有数据)
-- 回滚: DROP TABLE information.activityrule; ALTER TABLE information.activity DROP COLUMN rewardType;
--       (回滚前须确认无规则行数据; 上线后不建议回滚)
-- 验证: SHOW COLUMNS FROM information.activity LIKE 'rewardType';
--       SHOW TABLES FROM information LIKE 'activityrule';
-- 幂等: 建表用 IF NOT EXISTS; 加列用存储过程判存在 (MySQL 5.6 无 IF NOT EXISTS for ADD COLUMN)
-- 执行: dev(5.21) + test-erp(rm-2zexuf802bx4s8110) 已执行; 生产随 M1 上线执行
-- ============================================================

-- 1. activityrule 奖励规则表 (一行一档位)
CREATE TABLE IF NOT EXISTS `information`.`activityrule` (
  `arId`       INT          NOT NULL AUTO_INCREMENT COMMENT '主键',
  `aid`        BIGINT       NOT NULL COMMENT '活动外键(information.activity.aid)',
  `ruleType`   SMALLINT     NOT NULL DEFAULT 1 COMMENT '指标规则: 1=签约赠 2=预存每满 3=预存阶梯 4=定金(预留)',
  `asid`       BIGINT       NOT NULL DEFAULT 0 COMMENT '奖品指向(information.awardstock.asId)',
  `threshold`  BIGINT       NOT NULL DEFAULT 0 COMMENT '起满额(分, ruleType=3 阶梯档位)',
  `perAmount`  BIGINT       DEFAULT NULL COMMENT '每满金额(分, ruleType=2 用; NULL=不重复档)',
  `tickets`    INT          NOT NULL DEFAULT 1 COMMENT '该档张数',
  `maxTickets` INT          NOT NULL DEFAULT 0 COMMENT '封顶张数, 0=不封顶',
  `sort`       INT          NOT NULL DEFAULT 0 COMMENT '排序',
  `status`     SMALLINT     NOT NULL DEFAULT 0 COMMENT '0=启用 1=停用',
  `createTime` DATETIME     NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`arId`),
  KEY `idx_aid` (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='活动奖励规则表(一行一档位, 抽奖券活动规则)';

-- 2. activity 加列 rewardType (奖励类型: 0=普通活动 1=抽奖券活动)
DELIMITER $$
DROP PROCEDURE IF EXISTS `information`.`_tmp_add_rewardtype` $$
CREATE PROCEDURE `information`.`_tmp_add_rewardtype`()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA='information' AND TABLE_NAME='activity' AND COLUMN_NAME='rewardType') THEN
    ALTER TABLE `information`.`activity`
      ADD COLUMN `rewardType` SMALLINT NOT NULL DEFAULT 0 COMMENT '奖励类型: 0=普通 1=抽奖券(引擎定位锚点)' AFTER `atttype`;
  END IF;
END $$
CALL `information`.`_tmp_add_rewardtype`() $$
DROP PROCEDURE IF EXISTS `information`.`_tmp_add_rewardtype` $$
DELIMITER ;

-- 3. 验证
-- SELECT COUNT(*) FROM information_schema.TABLES  WHERE TABLE_SCHEMA='information' AND TABLE_NAME='activityrule';
-- SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='information' AND TABLE_NAME='activity' AND COLUMN_NAME='rewardType';
-- 期望: 两行均为 1
-- 注: 中奖展示复用既有 activityItemName(未开奖=奖品名, 开奖后抽奖系统覆盖为奖项名)+activityName(活动名), 不加 awardName 列
--     (dev/test-erp 曾按旧方案建的 decoration.decorationactivityitem.awardName 列已 DROP, 生产从未建过)
