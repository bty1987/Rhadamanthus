-- =============================================================================
-- 跨公司数据查看授权(crosscompanyright) —— 建表
-- 方案: docs/10-指南手册/CROSS_COMPANY_VIEW_DESIGN.md (2026-09-16 定稿, A案)
-- 日期: 2026-09-16
--
-- 语义:
--   每行 = 某用户在某业务模块可跨公司查看的公司集合(cids, 逗号分隔cid, 不含"全部"哨兵)
--   生效口径: 可见集合 = 本公司 ∪ cids (授权只做加法)
--   无行 = 行为与今天完全一致(零配置等价)
--   module 取值: customer(客源人员候选)/decoration/payment/sales (随批次扩展)
--
-- 部署顺序: 🔴 本 DDL 必须先于 fanglin-right jar 执行(判权代码启动即查此表)
--
-- 授权管理: 用户管理页(user.html)用户行"跨公司"按钮, 无需手工 SQL
-- (下方模板仅供批量初始化或应急修数使用)
-- =============================================================================

-- 1. 建表(幂等)
CREATE TABLE IF NOT EXISTS `platform`.`crosscompanyright` (
  `ucrid`      int(11) NOT NULL AUTO_INCREMENT,
  `uid`        int(11) NOT NULL COMMENT '用户uid(communion.user.uid)',
  `module`     varchar(20) NOT NULL DEFAULT '' COMMENT '业务模块: customer/decoration/payment/sales',
  `cids`       varchar(1000) NOT NULL DEFAULT '' COMMENT '可查看公司cid集合, 逗号分隔, 不含本公司(本公司天然可见)',
  `status`     tinyint NOT NULL DEFAULT 0 COMMENT '0=启用',
  `cuid`       int(11) NOT NULL DEFAULT 0 COMMENT '操作人uid, 0=SQL直接落库',
  `createTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`ucrid`),
  UNIQUE KEY `uk_uid_module` (`uid`,`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='跨公司数据查看授权';

-- 2. 授权模板(🔴非幂等, 执行前先核验未插入过; 按需替换 uid/module/cids)
-- INSERT INTO `platform`.`crosscompanyright` (`uid`, `module`, `cids`, `status`, `cuid`, `createTime`)
-- SELECT u.uid, 'customer', '2,3,7', 0, 0, NOW()
-- FROM `communion`.`user` u
-- WHERE u.userId = 'USERID' LIMIT 1;

-- 3. 撤销授权模板
-- DELETE FROM `platform`.`crosscompanyright` WHERE uid = ? AND module = ?;
