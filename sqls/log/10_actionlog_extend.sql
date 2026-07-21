-- =====================================================================
-- actionLog 表扩展：从接口性能日志升级为业务操作日志
-- Phase 1 数据层变更
--
-- 背景：
--   原 actionLog 表仅记录 actionName/user/time/runTime 四字段，无法
--   支撑业务审计诉求（谁、在哪、操作了什么对象、结果如何）。
--   本次扩展新增 10 个字段，并补建查询索引。
--
-- 兼容性：
--   全部新增字段允许 NULL，存量数据不受影响；现有 LogAction.pageActionLog
--   查询逻辑无需修改即可继续工作。
--
-- 字段说明：
--   ip          来源 IP（X-Forwarded-For 优先，RemoteAddr 兜底）
--   companyId   归属公司（Authentication.company）
--   moduleId    业务模块名（decoration/quotation/customer 等包名最后一段）
--   operateType 操作类型枚举（ADD/UPDATE/DELETE/QUERY/EXPORT/LOGIN/OTHER）
--   businessId  业务对象主键（订单号/客户 ID 等，业务侧主动绑定）
--   params      请求参数 JSON（脱敏后，敏感字段已置 ***）
--   resultState 结果状态：0=成功 1=失败 2=异常
--   errorCode   FLException 错误码（成功时为 NULL）
--   errorMsg    错误消息（成功时为 NULL）
--   traceId     链路追踪 ID（预留，当前用 UUIDUtil 生成）
-- =====================================================================

USE `log`;

ALTER TABLE `actionlog`
  ADD COLUMN `ip`          VARCHAR(45)   NULL COMMENT '来源IP',
  ADD COLUMN `companyId`   INT           NULL COMMENT '所属公司',
  ADD COLUMN `moduleId`    VARCHAR(64)   NULL COMMENT '业务模块 decoration/quotation/customer 等',
  ADD COLUMN `operateType` VARCHAR(16)   NULL COMMENT '操作类型 ADD/UPDATE/DELETE/QUERY/EXPORT/LOGIN/OTHER',
  ADD COLUMN `businessId`  VARCHAR(64)   NULL COMMENT '业务对象主键（订单号/客户ID）',
  ADD COLUMN `params`      TEXT          NULL COMMENT '请求参数JSON（脱敏后）',
  ADD COLUMN `resultState` TINYINT       NULL COMMENT '结果 0成功 1失败 2异常',
  ADD COLUMN `errorCode`   INT           NULL COMMENT 'FLException错误码',
  ADD COLUMN `errorMsg`    VARCHAR(255)  NULL COMMENT '错误消息',
  ADD COLUMN `traceId`     VARCHAR(64)   NULL COMMENT '链路追踪ID';

-- 查询常用组合索引
ALTER TABLE `actionlog`
  ADD INDEX `idx_createTime_user`     (createTime, createUserId),
  ADD INDEX `idx_module_business`     (moduleId, businessId),
  ADD INDEX `idx_traceId`             (traceId),
  ADD INDEX `idx_operateType_time`    (operateType, createTime);
