-- =====================================================================
-- communion.operation 表扩展：新增 logFlag 字段，按接口粒度控制日志记录
-- Phase 5：日志开关从 actionName 前缀判断升级为 operation 表配置
--
-- 背景：
--   Phase 4 的 skipQuery 按 actionName 前缀判断（page*/query*/get*/count*），
--   无法区分"敏感查询"和"普通查询"。operation 表已登记每个 .do 接口，
--   天然是接口级配置中心。把日志开关挂上去，粒度精确到单个接口。
--
-- logFlag 三态语义（最终版）：
--   0 = NONE   不记录（与 AUTO 等价，语义上表示"运维主动关闭某接口的日志"）
--   1 = ALWAYS 始终记录（敏感操作、关键写接口建议设为 1）
--   2 = AUTO   默认不记录，仅当业务侧 ActionLogContext.bind 时才记录
--
-- 决策规则（recorder 优先级链）：
--   1. actionLog.enable=false 全局熔断
--   2. logFlag=1(ALWAYS) 无条件记录
--   3. logFlag=0/2 + 业务侧 bind 记录（业务主动审计）
--   4. logFlag=0/2 + 无 bind 不记录
--
-- 兼容性：
--   字段 NOT NULL DEFAULT 2，存量 operation 自动获得 AUTO 值，默认不记录，
--   需要记录的接口由运维改为 1(ALWAYS)，或由业务代码 ActionLogContext.bind。
-- =====================================================================

USE `communion`;

ALTER TABLE `operation`
  ADD COLUMN `logFlag` SMALLINT NOT NULL DEFAULT 2
  COMMENT '日志记录策略 0=不记录 1=始终记录 2=自动(跟随skipQuery)';

-- 建议索引（按 logFlag 筛选时用，但 operation 表只有 ~164 行，可不建）
-- ALTER TABLE `operation` ADD INDEX `idx_logFlag` (`logFlag`);
