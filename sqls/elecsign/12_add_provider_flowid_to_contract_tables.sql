-- =============================================================================
-- 电子签多厂商支持：合同表新增 provider / flowid 字段
--
-- 🔴🔴 部署顺序硬约束：本脚本必须先于含 elecsign 多厂商代码的 jar 执行 🔴🔴
--   原因：4 个合同 PO 已映射 provider/flowid 列（Hibernate INSERT/UPDATE 恒含此两列），
--   列不存在时任何合同的创建/更新直接报 Unknown column，装修/付款/供应商/员工合同全部不可用。
--   先执行本脚本 + 后发 jar = 零配置场景行为与改造前 100% 等价（provider 落 1 与列默认值相同）。
--
-- 作用：多厂商并存时，合同全链路（生成→签署→查看→归档）按合同记录的厂商路由：
--   - provider：厂商标记 1=法大大 2=e签宝（见 com.fanglin.elecsign.enums.ElecsignProvider）
--     生成/上传合同时由路由器按「公司×场景」配置解析写入；签署/查看/归档按此值路由
--   - flowid：厂商流程号（e签宝专用：上传/生成后存 fileId，签署建流后覆盖为 signFlowId；
--     法大大不使用，恒为 NULL）
--
-- 改动范围：4 张合同表（与 sqls/elecsign/11 的 4 张账号表对应）
--   - decoration.decorationContract   装修合同
--   - payment.paymentContract         付款合同
--   - personel.supplierContract       供应商合同
--   - personel.userContract           员工合同
--
-- 存量数据：全部为法大大历史合同，provider 列 DEFAULT 1，业务层约定 NULL/1 视同法大大，
--           flowid 恒 NULL，无需回刷。
-- =============================================================================

-- 1. 装修合同
ALTER TABLE decoration.`decorationContract` ADD COLUMN provider TINYINT NULL DEFAULT 1 COMMENT '电子签厂商：1=法大大 2=e签宝';
ALTER TABLE decoration.`decorationContract` ADD COLUMN flowid VARCHAR(64) NULL DEFAULT NULL COMMENT '厂商流程号（e签宝fileId/signFlowId，法大大不使用）';

-- 2. 付款合同
ALTER TABLE payment.`paymentContract` ADD COLUMN provider TINYINT NULL DEFAULT 1 COMMENT '电子签厂商：1=法大大 2=e签宝';
ALTER TABLE payment.`paymentContract` ADD COLUMN flowid VARCHAR(64) NULL DEFAULT NULL COMMENT '厂商流程号（e签宝fileId/signFlowId，法大大不使用）';

-- 3. 供应商合同
ALTER TABLE personel.`supplierContract` ADD COLUMN provider TINYINT NULL DEFAULT 1 COMMENT '电子签厂商：1=法大大 2=e签宝';
ALTER TABLE personel.`supplierContract` ADD COLUMN flowid VARCHAR(64) NULL DEFAULT NULL COMMENT '厂商流程号（e签宝fileId/signFlowId，法大大不使用）';

-- 4. 员工合同
ALTER TABLE personel.`userContract` ADD COLUMN provider TINYINT NULL DEFAULT 1 COMMENT '电子签厂商：1=法大大 2=e签宝';
ALTER TABLE personel.`userContract` ADD COLUMN flowid VARCHAR(64) NULL DEFAULT NULL COMMENT '厂商流程号（e签宝fileId/signFlowId，法大大不使用）';

-- =============================================================================
-- 验证：
--   SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS
--   WHERE COLUMN_NAME IN ('provider','flowid') AND TABLE_NAME LIKE '%Contract';
--   预期 8 行。
-- =============================================================================
