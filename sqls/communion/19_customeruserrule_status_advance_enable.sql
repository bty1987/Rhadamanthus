-- ============================================================================
-- 文件: 19_customeruserrule_status_advance_enable.sql
-- 库表: communion.constant(前端逻辑值/状态字典)
-- 用途: 人员规则(customeruserrule)状态新增 key=6 管理启用(STATUS_ADVANCE_ENABLE_INT)——
--       启用状态由管理侧设定(非归属人启用动作写入), 该状态下规则归属人(个人)
--       不可自行停用(后端330123闸), 管理侧可停用/再启用;
--       个人口径启用(归属人自行启用)仍写 key=0, 个人可再停用。
--       客源自动分配池查询已同步 status IN (0,6), 管理启用人员照常参与轮拨。
-- 执行前置条件:
--   ① SELECT * FROM communion.constant WHERE clazz='customerUserRule' AND type='status';
--      ——确认 key=6 未存在; 🔴constant表有NOT NULL name列(惯例填中文说明, 本行='启用(管理)'), 不可省略
--   ② 配套 jar(customer-8.3.030 重打)先于本SQL或同批——旧代码不写6但列字典由前端
--      constant表驱动, SQL先上仅多一个未用枚举无害
-- 回滚方式:
--   DELETE FROM communion.constant WHERE clazz='customerUserRule' AND field='STATUS_ADVANCE_ENABLE_INT';
--   (回滚前先确认无 status=6 的存量行: SELECT COUNT(*) FROM customer.customeruserrule WHERE status=6;
--    有则先由管理侧页面将其停用/启用归位后再清字典)
-- 幂等性: NOT EXISTS 守卫, 重复执行跳过。
-- ============================================================================

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '启用(管理)', 'customer', 'customerUserRule', 'status', 'STATUS_ADVANCE_ENABLE_INT', '6', '启用(管理)', 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE clazz = 'customerUserRule' AND field = 'STATUS_ADVANCE_ENABLE_INT');

-- ② 四态口径文案对齐(个人启用/个人停用/管理禁用/管理启用), 与管理页四按钮一一对应:
--    0=启用(个人) / 1=停止(个人) / 5=禁用(管理) / 6=启用(管理)
--    (2停止部门/3停止分区为维度失效态, 不属四口径, 文案维持)
UPDATE communion.constant SET value = '启用(个人)', name = '启用(个人)'
WHERE clazz = 'customerUserRule' AND field = 'STATUS_ENABLE_INT' AND value <> '启用(个人)';

UPDATE communion.constant SET value = '禁用(管理)', name = '禁用(管理)'
WHERE clazz = 'customerUserRule' AND field = 'STATUS_ADVANCE_INVALID_INT' AND value <> '禁用(管理)';

-- ============================================================================
-- 验证语句(执行后核对):
--   SELECT field, `key`, value FROM communion.constant
--    WHERE clazz='customerUserRule' AND type='status' ORDER BY CAST(`key` AS UNSIGNED);
--   期望 0启用(个人)/1停止(个人)/2停止(部门)/3停止(分区)/4失效/5禁用(管理)/6启用(管理) 七行
-- 生效方式: constant表驱动, 前端刷新即生效(状态列翻译+JS逻辑值), 免发版。
-- ============================================================================
