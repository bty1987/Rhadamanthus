-- =====================================================================
-- salary域01号: ds/salary.json statusBalance 组迁入 communion.constant
--
-- 用途:
--   salary.json 瘦身迁移批次(配套前端切 constant.salary().workerBalance.status):
--   statusBalance(0有效/1无效) 为工费结算单(workerbalance)状态枚举,
--   消费方仅 WebContent/js/salary/workerBalance.js 一处。
--
-- 与既有 salary 域字典的关系(生产实查 2026-11-12):
--   salary/status type/onetype/SalaryTwoType(1-14)/withhold type+status 均已存在
--   且文案与 json 一致(SalaryTwoType key=4 文案微差 json'维修款' vs constant'监理维修款',
--   constant 该组前端零消费无UI影响, 不动), 本脚本仅补 statusBalance 一组 2 行。
--
-- 执行前置条件:
--   无依赖(NOT EXISTS 幂等, 可重复执行)
--
-- 回滚方式:
--   DELETE FROM communion.constant WHERE module='salary' AND clazz='workerBalance' AND type='status';
--
-- 验证语句:
--   SELECT `key`, value, status FROM communion.constant WHERE module='salary' AND clazz='workerBalance' ORDER BY `key`+0;
--   期望 2 行: 0=有效, 1=无效, status=0
-- =====================================================================

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '有效(工费结算状态)', 'salary', 'workerBalance', 'status', 'STATUS_VALID_INT', '0', '有效', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='salary' AND clazz='workerBalance' AND type='status' AND `key`='0');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '无效(工费结算状态)', 'salary', 'workerBalance', 'status', 'STATUS_INVALID_INT', '1', '无效', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='salary' AND clazz='workerBalance' AND type='status' AND `key`='1');
