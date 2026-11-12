-- =====================================================================
-- 用途: 工费/材料验证相关变更记录表【报价定额变更记录体系, 方案=docs/01-方案设计/工费材料验证变更记录体系设计.md】
--   记录 7 类影响工费/材料验证逻辑的变更(增减项制作删除/定材浮动额/节点工费浮动/下定材增删/
--   定额单开关/辅材绑定额/报价项定额关联), 支持按装修单/报价单/操作人/时间追查
--   表落 quotation 库, 单表统一(拍板①), 记录不清理(拍板③), 纯留痕无审批(拍板④)
-- 执行前置条件:
--   先于 fanglin-quotation/data/construction/seiya jar 发版(新代码写此表)
-- 回滚方式:
--   DROP TABLE IF EXISTS quotation.normchanerecord; (仅清记录, 无业务数据)
-- 验证语句:
--   SHOW CREATE TABLE quotation.normchanerecord;
--   SELECT COUNT(*) FROM quotation.normchanerecord;  -- 随业务操作增长
-- 幂等性: 幂等(CREATE TABLE IF NOT EXISTS)
-- =====================================================================

CREATE TABLE IF NOT EXISTS quotation.normchanerecord (
  ncrId bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  type tinyint NOT NULL COMMENT '变更类型: 1增减项制作 2增减项删除 3定材浮动额 4节点工费浮动 5下定材增删 6定额单开关 7辅材绑定额 8报价项定额关联',
  changeType tinyint NOT NULL COMMENT '动作: 1添加 2修改 3删除 4绑定 5解绑 6启用 7禁用',
  orderId varchar(50) DEFAULT NULL COMMENT '装修单号(追查主视角)',
  qid bigint DEFAULT NULL COMMENT '报价单id',
  refId bigint DEFAULT NULL COMMENT '关联业务id(按type: arId/ngid/nid/aid/qfid等)',
  refNo varchar(100) DEFAULT NULL COMMENT '关联业务可读标识(单号/名称)',
  beforeValue varchar(500) DEFAULT NULL COMMENT '变更前关键值',
  afterValue varchar(500) DEFAULT NULL COMMENT '变更后关键值',
  comment varchar(500) DEFAULT NULL COMMENT '补充说明(如连带影响)',
  operater varchar(32) DEFAULT NULL COMMENT '操作人userId',
  operateTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (ncrId),
  KEY idx_ncr_orderId (orderId),
  KEY idx_ncr_qid (qid),
  KEY idx_ncr_refId (refId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工费/材料验证相关变更记录';
