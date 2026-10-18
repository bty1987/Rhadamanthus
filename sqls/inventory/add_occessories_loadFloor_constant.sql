-- ==========================================
-- Occessories 上料楼层(loadFloor) Constant 数据
-- 表: communion.constant
-- ==========================================
-- 🔴键位=楼层号直存(与inventory.occessories.loadFloor业务数据一致):
--   生产数据分布(2026-10-17实证): -2负二(308行)/-1负一(1708行)/0一层(78643行)/1二层(224行)/2三层(6行)
--   旧版本脚本键位(0负二/1负一/2一层/3二层)与业务数据语义相反,已废弃勿再执行。
-- 幂等: NOT EXISTS守卫, 可重复执行。

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '负二', 'inventory', 'occessories', 'loadFloor', 'LOADFLOOR_MINUS_TWO_INT', '-2', '负二', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='occessories' AND type='loadFloor' AND `key`='-2');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '负一', 'inventory', 'occessories', 'loadFloor', 'LOADFLOOR_MINUS_ONE_INT', '-1', '负一', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='occessories' AND type='loadFloor' AND `key`='-1');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '一层', 'inventory', 'occessories', 'loadFloor', 'LOADFLOOR_FIRST_INT', '0', '一层', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='occessories' AND type='loadFloor' AND `key`='0');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '二层', 'inventory', 'occessories', 'loadFloor', 'LOADFLOOR_SECOND_INT', '1', '二层', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='occessories' AND type='loadFloor' AND `key`='1');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '三层', 'inventory', 'occessories', 'loadFloor', 'LOADFLOOR_THIRD_INT', '2', '三层', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='occessories' AND type='loadFloor' AND `key`='2');

-- 验证
-- SELECT * FROM communion.constant WHERE module='inventory' AND clazz='occessories' AND type='loadFloor' ORDER BY `key`+0;
