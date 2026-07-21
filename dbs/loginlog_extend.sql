-- =====================================================================
-- loginlog 表扩展：补齐审计字段 + 复合索引
-- Phase 8：登录日志优化（批次 A+B）
--
-- 背景：
--   原 loginlog 表仅 6 字段（llId/id/loginId/loginTime/sourceIp/successFlag），
--   缺少操作类型、错误码、公司、追踪ID等审计字段，无法区分登录方式、
--   无法追溯失败原因、无法与 actionLog 关联。
--
-- 本次扩展：
--   - 新增 operateType（PASSWORD/AUTHCODE/CHALLENGE/CHANGE/UPDATE）
--   - 新增 resultState（0成功 1失败 2异常，替代 successFlag 但保留兼容）
--   - 新增 errorCode/errorMsg（失败原因可追溯）
--   - 新增 companyId（多公司场景）
--   - 新增 traceId（与 actionLog 关联）
--   - 复合索引（loginId+loginTime 用于防爆破查询，sourceIp+loginTime 用于 IP 统计）
--
-- 兼容性：
--   - 全部新增字段允许 NULL，存量数据不受影响
--   - successFlag 字段保留不动（向后兼容，新代码同时写 successFlag 和 resultState）
--   - id 字段保留不动（虽然语义为空，但删除涉及 PO/VO/Service 多处改动，留作后续）
-- =====================================================================

USE `log`;

ALTER TABLE `loginlog`
  ADD COLUMN `operateType` VARCHAR(16)  NULL COMMENT '登录方式 PASSWORD/AUTHCODE/CHALLENGE/CHANGE/UPDATE',
  ADD COLUMN `resultState` TINYINT      NULL COMMENT '结果 0成功 1失败 2异常',
  ADD COLUMN `errorCode`   INT          NULL COMMENT 'FLException错误码',
  ADD COLUMN `errorMsg`    VARCHAR(255) NULL COMMENT '错误消息',
  ADD COLUMN `companyId`   INT          NULL COMMENT '所属公司',
  ADD COLUMN `traceId`     VARCHAR(64)  NULL COMMENT '链路追踪ID';

-- 复合索引：防爆破查询（loginId + loginTime 范围）
ALTER TABLE `loginlog`
  ADD INDEX `idx_loginId_loginTime` (`loginId`, `loginTime`);

-- 复合索引：IP 维度统计（sourceIp + loginTime 范围）
ALTER TABLE `loginlog`
  ADD INDEX `idx_sourceIp_loginTime` (`sourceIp`, `loginTime`);

-- 存量数据回填：把 successFlag 映射到 resultState（0失败→1，1成功→0）
-- 注意 successFlag 语义与 resultState 相反：successFlag 0=失败/1=成功，resultState 0=成功/1=失败
-- UPDATE `loginlog` SET resultState = CASE WHEN successFlag = 1 THEN 0 ELSE 1 END WHERE resultState IS NULL;
