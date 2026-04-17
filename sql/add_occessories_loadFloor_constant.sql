-- ==========================================
-- Occessories 上料楼层(loadFloor) Constant 数据
-- 表: communion.constant
-- ==========================================

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('负二', 'inventory', 'occessories', 'loadFloor', 'LOADFLOOR_MINUS_TWO_INT', '0', '负二', 0),
('负一', 'inventory', 'occessories', 'loadFloor', 'LOADFLOOR_MINUS_ONE_INT', '1', '负一', 0),
('一层', 'inventory', 'occessories', 'loadFloor', 'LOADFLOOR_FIRST_INT', '2', '一层', 0),
('二层', 'inventory', 'occessories', 'loadFloor', 'LOADFLOOR_SECOND_INT', '3', '二层', 0);

-- 验证
-- SELECT * FROM communion.constant WHERE module='inventory' AND clazz='occessories' AND type='loadFloor';
