-- =====================================================================
-- communion.operation 表扩展：新增 logFlag 字段，按接口粒度控制日志记录
-- Phase 5：日志开关从 actionName 前缀判断升级为 operation 表配置
--
-- 背景：
--   Phase 4 的 skipQuery 按 actionName 前缀判断（page*/query*/get*/count*），
--   无法区分"敏感查询"和"普通查询"。operation 表已登记每个 .do 接口，
--   天然是接口级配置中心。把日志开关挂上去，粒度精确到单个接口。
--
-- logFlag 枚举：
--   0 = NONE   永不记录（健康检查/心跳/日志自身产生的接口）
--   1 = ALWAYS 始终记录（覆盖 skipQuery，如敏感数据查询 queryCustomerByPhone）
--   2 = AUTO   自动（默认值，走全局 skipQuery 规则）
--
-- 兼容性：
--   字段 NOT NULL DEFAULT 2，存量 164 条 operation 自动获得 AUTO 值，
--   行为与 Phase 4 完全一致（走 skipQuery），零风险上线。
-- =====================================================================

USE `communion`;

ALTER TABLE `operation`
  ADD COLUMN `logFlag` SMALLINT NOT NULL DEFAULT 2
  COMMENT '日志记录策略 0=不记录 1=始终记录 2=自动(跟随skipQuery)';

-- 建议索引（按 logFlag 筛选时用，但 operation 表只有 ~164 行，可不建）
-- ALTER TABLE `operation` ADD INDEX `idx_logFlag` (`logFlag`);
