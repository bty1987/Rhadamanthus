-- =====================================================================
-- 62_constant_approval_type.sql
-- 用途: communion.constant 登记审批类型27"离职移交"(前端 constant.approval().approval
--       .TYPE_BELONG_TRAN_INT 与 type.keys[27] 数据源; 对照 Java ApprovalPO.APPROVAL_TYPE_BELONG_TRAN_INT=27)
-- 执行前置: communion 库; 生产核实 value=27 未被占用(现 26=预签报价优惠 遗留行, 27 空闲)
-- 回滚方式: DELETE FROM communion.constant WHERE module='approval' AND clazz='approval' AND type='type' AND field='TYPE_BELONG_TRAN_INT';
-- 验证语句: SELECT * FROM communion.constant WHERE field='TYPE_BELONG_TRAN_INT'; -- 期望1行 key=27
-- 幂等: NOT EXISTS 守卫(按 field 名)
-- =====================================================================

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) SELECT '离职移交(类型)', 'approval', 'approval', 'type', 'TYPE_BELONG_TRAN_INT', '27', '离职移交', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module = 'approval' AND clazz = 'approval' AND type = 'type' AND field = 'TYPE_BELONG_TRAN_INT');
