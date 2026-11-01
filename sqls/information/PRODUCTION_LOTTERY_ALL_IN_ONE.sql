-- ============================================================================
-- 文件: PRODUCTION_LOTTERY_ALL_IN_ONE.sql
-- 用途: 双人海外玩翻天线上抽奖券——生产环境一次性整合执行脚本(幂等, 可整文件重复执行)
-- 整合: 40建表 + 41初始化全国 + 25字典 + 菜单940 四文件
-- 排序: 按依赖顺序 ①建表 ②奖品档案 ③活动 ④规则行 ⑤字典 ⑥菜单
-- 生产实测(2026-11-01 只读库复核):
--   information.activityrule 表【尚未建】(本脚本第①段建)
--   activity type=20 = 0 条 / awardstock 2026110101 = 0 条 / constant key=11 = 0 条 / module 940 = 0 条 —— 全部首跑
--   communion.module MAX(mid)=939, 940 空闲
--   参战公司口径 = name 匹配 方林/爱林/恩林/屿林/1918 且 cid>0 = 【69 家】(含辽阳/阜新/北京系/济南/上海等新城市)
--   rolemodule mid=336(装修单-活动) = 6171 行授权源, FL-00479 uid=34 存在
--   constant key=10 现值='已领'(有意为之, 本脚本不动它)
-- 注意:
--   1. 全部语句 NOT EXISTS 守卫幂等, 整文件重复执行安全;
--   2. cuid=34(FL-00479 白添宇) 系 rolemodule.creater EAGER 关联, 不可用不存在的 uid;
--   3. 门槛单位=厘: 方林/屿林 30000000(3万) 恩林/爱林 20000000(2万) 1918别墅 60000000(6万);
--   4. 活动窗口 2026-11-01 00:00:00 ~ 2026-12-31 23:59:59;
--   5. 执行后验证段在文件末尾, 逐条 SELECT 核对期望值;
--   6. 部署 jar(decoration 331441B/268f476b + payment 322045B + information 193933B)后,
--      逐公司触发补发入口 issueDecorationActivityItem.do?aid=<aid> 回补存量券。
-- 回滚(如需, 按序):
--   DELETE FROM communion.rolemodule WHERE mid=940;
--   DELETE FROM communion.module WHERE mid=940;
--   DELETE FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND `key`='11';
--   DELETE FROM information.activityrule WHERE aid IN (SELECT aid FROM information.activity WHERE type=20 AND name='双人海外玩翻天');
--   DELETE FROM information.activity WHERE type=20 AND name='双人海外玩翻天';
--   (awardstock 档案可保留复用; 回滚不影响已发券行)
-- ============================================================================

-- ① 建表 information.activityrule (奖励规则, 一行一档位)
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

-- ② awardstock 奖品档案(全局 1 条)
INSERT INTO information.awardstock
  (`no`, `name`, `purchase`, `selling`, `num`, `status`, `type`, `subtype`, `storeroom`, `format`, `unitPrice`, `isStock`, `isPrefor`, `isPayment`, `content`, `company`)
SELECT '2026110101', '双人海外玩翻天抽奖券', 0, 0, 0, 1, 0, 8, 0, '', 0, 1, 0, 0, '双人海外玩翻天线上抽奖活动抽奖券', 1
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM information.awardstock WHERE `no` = '2026110101' AND name = '双人海外玩翻天抽奖券'
);

-- ③ activity 每参战公司 1 条(type=20 抽奖券活动, 窗口 2026-11-01~12-31 18:00(互动截止18:00, 22:00抽奖))
INSERT INTO information.activity
  (`name`, `cuid`, `status`, `type`, `paytype`, `atttype`, `defaults`, `multiple`, `validays`, `exchange`, `createTime`, `startTime`, `endTime`, `content`, `company`)
SELECT
  '双人海外玩翻天', 34, 0, 20, 0, 1, 1, 0, 0, 0,
  NOW(), '2026-11-01 00:00:00', '2026-12-31 18:00:00',
  '双人海外玩翻天抽奖券活动', c.`cid`
FROM communion.`company` c
WHERE (c.`name` LIKE '%方林%' OR c.`name` LIKE '%爱林%' OR c.`name` LIKE '%恩林%' OR c.`name` LIKE '%屿林%' OR c.`name` LIKE '%1918%')
  AND c.`cid` > 0
  AND NOT EXISTS (
    SELECT 1 FROM information.activity a
    WHERE a.company = c.`cid` AND a.type = 20 AND a.name = '双人海外玩翻天'
      AND a.startTime = '2026-11-01 00:00:00' AND a.endTime = '2026-12-31 18:00:00'
);

-- ④ activityrule 每公司 2 行
-- ④-1 签约赠(ruleType=1, tickets=1)
INSERT INTO information.activityrule
  (`aid`, `ruleType`, `asid`, `threshold`, `perAmount`, `tickets`, `maxTickets`, `sort`, `status`, `createTime`)
SELECT
  a.`aid`, 1, (SELECT asid FROM information.awardstock WHERE `no` = '2026110101' LIMIT 1),
  0, NULL, 1, 0, 1, 0, NOW()
FROM information.`activity` a
WHERE a.type = 20 AND a.name = '双人海外玩翻天' AND a.status = 0
  AND NOT EXISTS (
    SELECT 1 FROM information.activityrule r WHERE r.aid = a.`aid` AND r.ruleType = 1
  );

-- ④-2 预存每满(ruleType=2, 门槛按板块: 方林/屿林3万 恩林/爱林2万 1918别墅6万)
INSERT INTO information.activityrule
  (`aid`, `ruleType`, `asid`, `threshold`, `perAmount`, `tickets`, `maxTickets`, `sort`, `status`, `createTime`)
SELECT
  a.`aid`, 2, (SELECT asid FROM information.awardstock WHERE `no` = '2026110101' LIMIT 1),
  0,
  CASE
    WHEN c.`name` LIKE '%恩林%' OR c.`name` LIKE '%爱林%' THEN 20000000
    WHEN c.`name` LIKE '%1918%' THEN 60000000
    ELSE 30000000
  END,
  1, 0, 2, 0, NOW()
FROM information.`activity` a
JOIN communion.`company` c ON c.`cid` = a.company
WHERE a.type = 20 AND a.name = '双人海外玩翻天' AND a.status = 0
  AND NOT EXISTS (
    SELECT 1 FROM information.activityrule r WHERE r.aid = a.`aid` AND r.ruleType = 2
  );

-- ⑤ constant 字典: state=11 抽奖(系统中不存在"已中奖"状态, 中奖结果由抽奖系统说明)
INSERT INTO communion.constant
  (`name`, `module`, `clazz`, `type`, `field`, `key`, `value`, `status`)
SELECT '抽奖(装修活动状态)', 'decoration', 'decorationActivityItem', 'status', 'STATUS_DRAW_INT', '11', '抽奖', 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM communion.constant
  WHERE module = 'decoration' AND clazz = 'decorationActivityItem'
    AND type = 'status' AND `key` = '11'
);

-- ⑤-1 旧文案归位(若曾按"已中奖"执行过则归位为"抽奖")
UPDATE communion.constant
SET `name` = '抽奖(装修活动状态)', `value` = '抽奖', `field` = 'STATUS_DRAW_INT'
WHERE module = 'decoration' AND clazz = 'decorationActivityItem'
  AND type = 'status' AND `key` = '11';

-- 🔴 key=10 value='已领' 是有意为之(需求方无核销概念), 本脚本不动它

-- ⑥ 菜单: 活动物品查询页(module 940, 挂"装修单"下 order=26)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
SELECT 940, 39, '装修单-活动物品查询', '活动物品查询', '', 'icon-tag',
   '/views/decoration/decoration4activityItem.html', 3, 1, 26, ''
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`module` WHERE `mid` = 940);

-- ⑥-1 角色授权: 复制 mid=336(装修单-活动) 全部授权(cuid=34)
INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT rm.`rid`, 940, rm.`link`, rm.`access`, 34, NOW(), rm.`company`
FROM `communion`.`rolemodule` rm
WHERE rm.`mid` = 336
  AND NOT EXISTS (SELECT 1 FROM `communion`.`rolemodule` t WHERE t.`mid` = 940 AND t.`rid` = rm.`rid` AND t.`company` = rm.`company`);

-- ============================================================================
-- 验证段(执行后逐条核对)
-- ============================================================================
-- V1. 建表: 期望 1
SELECT COUNT(*) AS V1_table FROM information_schema.TABLES WHERE TABLE_SCHEMA='information' AND TABLE_NAME='activityrule';
-- V2. 奖品档案: 期望 1
SELECT COUNT(*) AS V2_award FROM information.awardstock WHERE `no`='2026110101' AND name='双人海外玩翻天抽奖券';
-- V3. 活动数: 期望 69(当前公司口径)
SELECT COUNT(*) AS V3_activity FROM information.activity WHERE type=20 AND name='双人海外玩翻天';
-- V4. 规则行数: 期望 活动数×2 = 138
SELECT COUNT(*) AS V4_rules FROM information.activityrule WHERE aid IN (SELECT aid FROM information.activity WHERE type=20);
-- V5. 字典: 期望 2 行 (key=11 value=抽奖; key=10 value=已领)
SELECT `key`, `value` FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='status' AND `key` IN ('10','11') ORDER BY `key`;
-- V6. 菜单: 期望 1
SELECT COUNT(*) AS V6_module FROM communion.module WHERE mid=940;
-- V7. 授权行数: 期望 与 mid=336 一致(6171)
SELECT COUNT(*) AS V7_rolemodule FROM communion.rolemodule WHERE mid=940;
-- V8. 各公司 aid 清单(补发入口用): issueDecorationActivityItem.do?aid=<aid>
SELECT aid, company FROM information.activity WHERE type=20 AND name='双人海外玩翻天' ORDER BY company;
