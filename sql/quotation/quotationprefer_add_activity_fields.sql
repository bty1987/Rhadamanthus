-- quotationprefer 新增 activityPrice、activityProfit 字段
-- 将 activityPrice/activityProfit 从 protation 迁移到 quotationprefer
-- 日期: 2026-04-25

-- 1. quotation.quotationprefer 加列
ALTER TABLE `quotation`.`quotationprefer`
  ADD COLUMN `activityPrice` int(11) NULL DEFAULT 0 COMMENT '浮动额(活动额)' AFTER `advancePrefer`,
  ADD COLUMN `activityProfit` int(11) NULL DEFAULT 0 COMMENT '活动优惠' AFTER `activityPrice`;

-- 2. approval.approvalquotationprefer 加列
ALTER TABLE `approval`.`approvalquotationprefer`
  ADD COLUMN `activityPrice` int(11) NULL DEFAULT 0 COMMENT '浮动额(活动额)' AFTER `advancePrefer`,
  ADD COLUMN `activityProfit` int(11) NULL DEFAULT 0 COMMENT '活动优惠' AFTER `activityPrice`;

-- 3. 老数据迁移: 从 protation 复制 activityPrice/activityProfit 到 quotationprefer
-- 关联路径: quotationprefer.orderId = protation.orderId
-- 注意: protation 表有 activityPrice 和 activityProfit 字段
UPDATE `quotation`.`quotationprefer` qp
INNER JOIN `quotation`.`quotation` q ON qp.qid = q.qid
INNER JOIN `quotation`.`protation` p ON q.orderId = p.orderId
SET qp.activityPrice = p.activityPrice,
    qp.activityProfit = p.activityProfit
WHERE qp.activityPrice = 0 AND qp.activityProfit = 0;
