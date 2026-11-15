-- =====================================================================
-- 02_salesfollowup.sql 销售跟单系统(售前/售后)落地SQL
-- 用途: ①新建 sales.salesprefollowup(售前跟单,设计师挂装修单收品类品牌意向)
--          sales.salespostfollowup(售后跟单,管家/销售/驻店挂销售单记配送服务过程)两表
--       ②sales.salesfunction+platform.salesfunctionright 配"跟单"行按钮(照03号"记录"按钮先例)
--       ③communion.operation 登记4个查询接口(through=1免检,照pageInstorer惯例;
--         add/delete写操作不登记=收集期放行,删除服务端"仅记录人"校验是硬闸)
-- 前置: 配套jar=fanglin-sales-8.3.031(SalesFollowupAction 8接口); 前端=api/sales.js+
--       salesFollowup.html/js+salesFollowupUtils.js+sales.js行按钮+decorationPageUtils/
--       decorationUtils(decoration4detail.loadScript)+decoration4detail.html
-- 回滚: DROP TABLE IF EXISTS sales.salespostfollowup; DROP TABLE IF EXISTS sales.salesprefollowup;
--       DELETE FROM platform.salesfunctionright WHERE sfid=(SELECT sfid FROM sales.salesfunction WHERE `key`='pageBtn' AND value='followup');
--       DELETE FROM sales.salesfunction WHERE `key`='pageBtn' AND value='followup';
--       DELETE FROM communion.operation WHERE operation IN ('querySalesPreFollowupByOrderId','countSalesPreFollowup','querySalesPostFollowupBySid','countSalesPostFollowup');
-- 验证: SHOW COLUMNS FROM sales.salesprefollowup; SHOW COLUMNS FROM sales.salespostfollowup;
--       SELECT COUNT(*) FROM platform.salesfunctionright r JOIN sales.salesfunction f ON f.sfid=r.sfid WHERE f.value='followup';
--       SELECT oid,operation,through FROM communion.operation WHERE operation LIKE 'querySales%Followup%' OR operation LIKE 'countSales%Followup%'; -- 期望4行through=1
-- 幂等: CREATE TABLE IF NOT EXISTS + NOT EXISTS 守卫, 可重复执行
-- =====================================================================

-- ---------- 1. 售前跟单表(设计师视角,挂装修单) ----------
CREATE TABLE IF NOT EXISTS sales.salesprefollowup (
  sfid       bigint NOT NULL AUTO_INCREMENT COMMENT '售前跟单ID',
  company    int    NOT NULL DEFAULT 0      COMMENT '公司',
  orderId    varchar(15) NOT NULL           COMMENT '装修单号',
  category   varchar(32) DEFAULT NULL       COMMENT '品类快照(照sales.category口径,冗余文本)',
  bid        bigint NOT NULL DEFAULT 0      COMMENT '品牌ID(0=未指定,品牌名join brand)',
  item       tinyint NOT NULL DEFAULT 0     COMMENT '事项: 0意向沟通/1品牌到店/2方案比价/9其他',
  way        tinyint NOT NULL DEFAULT 0     COMMENT '方式: 0电话/1微信/2到店接待/3上门/9其他',
  content    varchar(512) NOT NULL          COMMENT '跟进内容',
  plan       varchar(256) DEFAULT NULL      COMMENT '下一步计划',
  planTime   datetime DEFAULT NULL          COMMENT '计划跟进时间(允许过去时间,补录口径)',
  isDelete   tinyint NOT NULL DEFAULT 0     COMMENT '0:有效, 1:已删除(逻辑删除,照CustomerUserRuleItemPO先例)',
  deleteTime datetime DEFAULT NULL          COMMENT '删除时间',
  cuid       bigint NOT NULL                COMMENT '记录人uid(=唯一可删除人)',
  createTime datetime NOT NULL              COMMENT '记录时间',
  PRIMARY KEY (sfid),
  KEY idx_order (orderId)
) COMMENT='售前跟单记录(设计师品类品牌意向)';

-- ---------- 2. 售后跟单表(管家/销售/驻店视角,挂销售单) ----------
CREATE TABLE IF NOT EXISTS sales.salespostfollowup (
  sfid       bigint NOT NULL AUTO_INCREMENT COMMENT '售后跟单ID',
  company    int    NOT NULL DEFAULT 0      COMMENT '公司',
  sid        bigint NOT NULL DEFAULT 0      COMMENT '销售单ID',
  orderId    varchar(15) NOT NULL           COMMENT '装修单号(Service从销售单冗余带入,前端不传)',
  item       tinyint NOT NULL DEFAULT 0     COMMENT '事项: 0配送协调/1安装服务/2客户回访/3投诉处理/9其他',
  way        tinyint NOT NULL DEFAULT 0     COMMENT '方式: 0电话/1微信/2上门/9其他',
  content    varchar(512) NOT NULL          COMMENT '跟进内容(发生了什么/客户反馈)',
  result     varchar(256) DEFAULT NULL      COMMENT '处理结果(服务闭环补记)',
  plan       varchar(256) DEFAULT NULL      COMMENT '下一步计划',
  planTime   datetime DEFAULT NULL          COMMENT '计划跟进时间(允许过去时间,补录口径)',
  isDelete   tinyint NOT NULL DEFAULT 0     COMMENT '0:有效, 1:已删除(逻辑删除,照CustomerUserRuleItemPO先例)',
  deleteTime datetime DEFAULT NULL          COMMENT '删除时间',
  cuid       bigint NOT NULL                COMMENT '记录人uid(=唯一可删除人)',
  createTime datetime NOT NULL              COMMENT '记录时间',
  PRIMARY KEY (sfid),
  KEY idx_sid (sid),
  KEY idx_order (orderId)
) COMMENT='售后跟单记录(销售单配送服务过程)';

-- ---------- 3. salesfunction"跟单"行按钮 + 权限铺开(照03号"记录"按钮先例) ----------
INSERT INTO sales.salesfunction (name, `key`, value, `group`, type, subtype, sort, comment)
SELECT '跟单', 'pageBtn', 'followup', 1, 4, 1, 21, '销售单售后跟单弹窗(salesFollowup)'
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM sales.salesfunction WHERE `key` = 'pageBtn' AND value = 'followup'
);

INSERT INTO platform.salesfunctionright (name, sfid, company)
SELECT r.name, f.sfid, r.company
FROM (SELECT DISTINCT name, company FROM platform.salesfunctionright) r
CROSS JOIN sales.salesfunction f
WHERE f.`key` = 'pageBtn' AND f.value = 'followup'
  AND NOT EXISTS (
      SELECT 1 FROM platform.salesfunctionright x
      WHERE x.name = r.name AND x.company = r.company AND x.sfid = f.sfid
  );

-- ---------- 4. operation查询接口登记(through=1免检) ----------
INSERT INTO communion.operation (operation, name, through, type, status, system)
SELECT 'querySalesPreFollowupByOrderId', '按装修单查询售前跟单', 1, 0, 0, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'querySalesPreFollowupByOrderId');

INSERT INTO communion.operation (operation, name, through, type, status, system)
SELECT 'countSalesPreFollowup', '统计装修单售前跟单', 1, 0, 0, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'countSalesPreFollowup');

INSERT INTO communion.operation (operation, name, through, type, status, system)
SELECT 'querySalesPostFollowupBySid', '按销售单查询售后跟单', 1, 0, 0, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'querySalesPostFollowupBySid');

INSERT INTO communion.operation (operation, name, through, type, status, system)
SELECT 'countSalesPostFollowup', '统计销售单售后跟单', 1, 0, 0, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'countSalesPostFollowup');

-- ---------- 5. 验证 ----------
-- SELECT COUNT(*) FROM sales.salesprefollowup;  -- 期望0(新表)
-- SELECT COUNT(*) FROM sales.salespostfollowup; -- 期望0(新表)
SELECT r.name, r.company, f.value FROM platform.salesfunctionright r
JOIN sales.salesfunction f ON f.sfid = r.sfid
WHERE f.value = 'followup' ORDER BY r.name, r.company LIMIT 10;
-- SELECT oid, operation, through FROM communion.operation WHERE operation IN ('querySalesPreFollowupByOrderId','countSalesPreFollowup','querySalesPostFollowupBySid','countSalesPostFollowup'); -- 期望4行through=1
