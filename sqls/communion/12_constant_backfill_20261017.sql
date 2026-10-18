-- =====================================================================
-- communion.constant 补数据(2026-10-17 全量重审计产物)
-- =====================================================================
-- 审计方式: 穷尽解析 sqls/+docs 全部32个含constant插入的脚本(含temp表形态
--           9个人工提取), 合并预期 61组/198行, 与生产逐行比对。
-- 此前审计(仅9月窗口+文件名抽样)确有遗漏: production域3组/chating/loadFloor
--   尾键/quotationAssignUserRule值漂移/customerPhone同义词 均漏网。
--
-- 发现明细:
--   ①缺行 data/chating/status (0开始/1结束)——chating页js:34与
--     条件组件data.js:1489消费, 缺失即页面崩
--   ②缺行 production/puotation/status (0未使用/1正使用)——生产报价页
--     puotation.js:83/98/100消费STATUS_UNUSE/USING字段常量, 缺失取值恒undefined
--   ③缺行 production/workflow/status、production/workplan/status (0启用/1禁用)
--   ④缺行 inventory/occessories/loadFloor key=2(三层)——负载按楼层号直存
--     (-2负二308行/-1负一1708行/0一层78643行/1二层224行/2三层6行),
--     生产已有-2/-1/0/1四行(2026-10-17有人并行修复中), 本脚本NOT EXISTS守卫不会重插
--   ⑤值异 quotation/quotationAssignUserRule/status key=1(待分配→可用)
--     key=3(已交付→停止)——生产是草稿期错值(field=AVAILABLE语义与value矛盾),
--     仓库脚本50为定稿(可用/制作中/停止); 业务数据仅用status 1×15/2×1, 修值零存储影响
--   ⑥禁用 quotationAssignUserRule/status key=4(已完成)——后端无status=4,
--     50脚本§104既定动作
--   ⑦值异 customer/customerPhone/status key=1(停用→禁用)——同义词, 展示一致性
--
-- ⚠️ 全部 NOT EXISTS / 条件守卫, 幂等可重复执行; 纯字典行, 免重启。
-- ⚠️ 注意loadFloor -2/-1两行有人并行在生产执行中, 守卫会自动跳过。
-- =====================================================================

-- ① data/chating/status
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '开始(沟通状态)', 'data', 'chating', 'status', 'STATUS_START_INT', '0', '开始', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='data' AND clazz='chating' AND type='status' AND `key`='0');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '结束(沟通状态)', 'data', 'chating', 'status', 'STATUS_END_INT', '1', '结束', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='data' AND clazz='chating' AND type='status' AND `key`='1');

-- ② production/puotation/status
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '未使用(报价状态)', 'production', 'puotation', 'status', 'STATUS_UNUSE_INT', '0', '未使用', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='production' AND clazz='puotation' AND type='status' AND `key`='0');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '正使用(报价状态)', 'production', 'puotation', 'status', 'STATUS_USING_INT', '1', '正使用', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='production' AND clazz='puotation' AND type='status' AND `key`='1');

-- ③ production/workflow/status
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '启用(工作流状态)', 'production', 'workflow', 'status', 'STATUS_ENABLE_INT', '0', '启用', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='production' AND clazz='workflow' AND type='status' AND `key`='0');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '禁用(工作流状态)', 'production', 'workflow', 'status', 'STATUS_DISABLE_INT', '1', '禁用', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='production' AND clazz='workflow' AND type='status' AND `key`='1');

-- ③ production/workplan/status
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '启用(工作计划状态)', 'production', 'workplan', 'status', 'STATUS_ENABLE_INT', '0', '启用', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='production' AND clazz='workplan' AND type='status' AND `key`='0');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '禁用(工作计划状态)', 'production', 'workplan', 'status', 'STATUS_DISABLE_INT', '1', '禁用', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='production' AND clazz='workplan' AND type='status' AND `key`='1');

-- ④ inventory/occessories/loadFloor 补尾键(三层)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '三层', 'inventory', 'occessories', 'loadFloor', 'LOADFLOOR_THIRD_INT', '2', '三层', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='occessories' AND type='loadFloor' AND `key`='2');

-- ⑤ quotation/quotationAssignUserRule/status 值修正
UPDATE communion.constant SET value = '可用'
WHERE module = 'quotation' AND clazz = 'quotationAssignUserRule' AND type = 'status' AND `key` = '1' AND value <> '可用';

UPDATE communion.constant SET value = '停止'
WHERE module = 'quotation' AND clazz = 'quotationAssignUserRule' AND type = 'status' AND `key` = '3' AND value <> '停止';

-- ⑥ quotation/quotationAssignUserRule/status key=4 禁用(后端无此值)
UPDATE communion.constant SET status = 1
WHERE module = 'quotation' AND clazz = 'quotationAssignUserRule' AND type = 'status' AND `key` = '4';

-- ⑦ customer/customerPhone/status 值对齐(禁用)
UPDATE communion.constant SET value = '禁用'
WHERE module = 'customer' AND clazz = 'customerPhone' AND type = 'status' AND `key` = '1' AND value = '停用';

-- =====================================================================
-- 核验: 重跑审计比对脚本应仅剩 loadFloor 旧脚本键位的历史歧义提示(无缺失/无重复)
-- =====================================================================
