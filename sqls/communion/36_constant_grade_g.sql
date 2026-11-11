-- =====================================================================
-- 36号: 公积金客户 grade=G 字典四件套
--
-- 用途:
--   装修单等级新增 G(公积金客户), 用于约束收款时 receipttype 收款方式选择:
--   grade=G 的装修单, 线下收款刷卡/银行转账下拉只展示 receipttype.grade='G'
--   的公积金专用渠道(前端映射见 payment.js/decorationPayment.js/servicePayment.js/paytran.js);
--   线上走 custype.dgrade/sgrade='G' 商户配置(数据后续单独补充).
--   本脚本仅插 4 行字典:
--     1. decoration/decoration/grade   装修单创建页+信息页等级下拉多出 G
--     2. data/receiptType/grade        receipttype 维护页等级可选 G(建公积金专用收款方式行用)
--     3. data/custype/dgrade           custype 维护页可选 G(后续线上商户数据用)
--     4. data/custype/sgrade           custype 维护页可选 G(后续线上商户数据用)
--
-- 执行前置条件:
--   1. 目标库无同名 G 行(脚本自带 NOT EXISTS 幂等守卫, 可重复执行)
--   2. custype 字典 name 文案历史口径: type=dgrade 行标"(销售等级)"、
--      type=sgrade 行标"(装修等级)", 本脚本镜像该既有文案不纠历史
--     (name 仅运维备注, 前端 bindData 只读 key/value, 零功能影响)
--
-- 回滚方式:
--   DELETE FROM communion.constant WHERE module='decoration' AND clazz='decoration' AND type='grade' AND `key`='G';
--   DELETE FROM communion.constant WHERE module='data' AND clazz='receiptType' AND type='grade' AND `key`='G';
--   DELETE FROM communion.constant WHERE module='data' AND clazz='custype' AND type='dgrade' AND `key`='G';
--   DELETE FROM communion.constant WHERE module='data' AND clazz='custype' AND type='sgrade' AND `key`='G';
--   (回滚前确认无 receipttype.grade='G' 渠道行/custype dgrade='G' 商户行引用该字典值)
--
-- 验证语句:
--   SELECT cid, name, module, clazz, type, field, `key`, value, status
--   FROM communion.constant
--   WHERE `key`='G' AND type IN ('grade','dgrade','sgrade');
--   期望 4 行, status=0.
-- =====================================================================

-- 1. 装修单等级字典(创建页/信息页等级下拉)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT 'G(装修等级)', 'decoration', 'decoration', 'grade', 'GRADE_G_INT', 'G', 'G', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module = 'decoration' AND clazz = 'decoration' AND type = 'grade' AND `key` = 'G');

-- 2. 收款方式等级字典(receipttype 维护页)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT 'G', 'data', 'receiptType', 'grade', NULL, 'G', 'G', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module = 'data' AND clazz = 'receiptType' AND type = 'grade' AND `key` = 'G');

-- 3. custype 装修等级字典(线上商户配置用, 文案镜像既有行)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT 'G(销售等级)', 'data', 'custype', 'dgrade', 'DGRADE_G_INT', 'G', 'G', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module = 'data' AND clazz = 'custype' AND type = 'dgrade' AND `key` = 'G');

-- 4. custype 销售等级字典(线上商户配置用, 文案镜像既有行)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT 'G(装修等级)', 'data', 'custype', 'sgrade', 'SGRADE_G_INT', 'G', 'G', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module = 'data' AND clazz = 'custype' AND type = 'sgrade' AND `key` = 'G');
