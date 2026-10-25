-- ============================================================
-- 优惠额度校验缓存表 decoration.decorationactivitycost
-- 用途: 额度类活动物品(type>=10)创建校验通过后, 缓存 fl-yy validate 接口响应快照
--      (balance/toplimit/本次使用额度), 只写档: 不展示/不参与校验判定/系统逻辑不读
-- 前置: 无(新表); 🔴必须先于 jar 执行(DecorationActivityCostPO 映射该表, 硬依赖)
-- 回滚: DROP TABLE decoration.decorationactivitycost(仅限未产生数据前)
-- 验证: SHOW CREATE TABLE decoration.decorationactivitycost;
--      SELECT COUNT(*) FROM decoration.decorationactivitycost;
-- 幂等: CREATE TABLE IF NOT EXISTS, 可重复执行
-- ============================================================

CREATE TABLE IF NOT EXISTS decoration.decorationactivitycost (
  dacId BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  orderId VARCHAR(20) NOT NULL COMMENT '装修单号',
  daiId BIGINT NOT NULL COMMENT '活动物品行 decorationactivityitem.daiId',
  money INT NOT NULL COMMENT '本次使用额度(厘)',
  balance INT NULL COMMENT '校验时点可用额度(厘)',
  toplimit INT NULL COMMENT '校验时点单笔上限(厘)',
  company INT NULL COMMENT '公司',
  createTime DATETIME NULL COMMENT '校验时间',
  PRIMARY KEY (dacId),
  KEY idx_orderId (orderId),
  KEY idx_daiId (daiId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='装修活动优惠额度校验记录';
