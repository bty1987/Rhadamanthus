-- ============================================================
-- 销售收款券配比明细表 decoration.decorationscaledetail
-- 用途: 阶梯活动券(type=30,已领)在销售收款中使用时, 记录"收款单↔券行↔是否计入配比"明细
--      (修复配比糊涂账: saleTotal 现算构成首次有可追溯明细; 计入效果=配比计算链 SUM(isScale=计入))
-- 前置: 无(新表); 🔴必须先于 jar 执行(DecorationScaleDetailPO 映射该表, 硬依赖)
-- 回滚: DROP TABLE decoration.decorationscaledetail(仅限未产生数据前)
-- 验证: SHOW CREATE TABLE decoration.decorationscaledetail;
--      SELECT COUNT(*) FROM decoration.decorationscaledetail;
-- 幂等: CREATE TABLE IF NOT EXISTS, 可重复执行
-- ============================================================

CREATE TABLE IF NOT EXISTS decoration.decorationscaledetail (
  dsdId BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  spid BIGINT NULL COMMENT '销售收款单 payment.salespayment.spid(单笔必填,批量可空——批量=同一装修单多笔收款行,配比按orderId汇总)',
  orderId VARCHAR(15) NOT NULL COMMENT '装修单号(冗余,跨收款单汇总;长度对齐decoration.orderId)',
  sourceType TINYINT NOT NULL COMMENT '来源类型 1=阶梯券(枚举可扩:场外款等)',
  sourceId BIGINT NULL COMMENT '来源行id(通用:券=daiId)',
  daiId BIGINT NULL COMMENT '券行 decorationactivityitem.daiId(券来源;UNIQUE 一券一用并发兜底)',
  asid BIGINT NULL COMMENT '券奖品(冗余,展示/对账)',
  money BIGINT NOT NULL COMMENT '计入金额(厘)=券面值',
  isScale TINYINT NOT NULL COMMENT '是否计入配比 0计入 1不计入(对齐OalesPO命名)',
  status TINYINT NOT NULL DEFAULT 0 COMMENT '明细状态 0有效(预留作废标记,一期不启用)',
  creater INT NULL COMMENT '操作人uid',
  createTime DATETIME NULL,
  comment VARCHAR(200) NULL,
  PRIMARY KEY (dsdId),
  UNIQUE KEY uk_daiId (daiId),
  KEY idx_spid (spid),
  KEY idx_orderId (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='销售收款配比明细';
