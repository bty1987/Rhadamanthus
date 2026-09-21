-- =====================================================================
-- DECORATION_USER_ROLE_DICT_INDEX.sql
-- 服务团队(decoration.decorationUser) B1+C1 配套数据与索引
--   ① contentRole 角色字典: communion.constant 12 行(老版前端 datalist 建议)
--   ② user 列索引: pageDecorationForUser("我参与的装修单") exists 子查询支撑
--
-- 🔴 执行顺序: ② user 索引必须先于 decoration jar 发版(新 DAO 的子查询
--    where du.user=? 无索引将全表扫描 37 万行, 挂在装修单列表高频路径);
--    ① 字典行晚于 jar 无害(前端 datalist 空则静默降级为自由输入)。
--    与 DECORATION_USER_SERVICE_TEAM.sql 同批执行亦可(互不依赖)。
--
-- 幂等性: ① NOT EXISTS; ② information_schema 判断。
-- =====================================================================

-- ---------------------------------------------------------------------
-- ① contentRole 角色字典: 种子取生产全量 content TOP 值(2026-09-21实测)
--    (合约专员2232/拆单员616/大师班客户经理325/前台服务咨询监理227/
--     大师班客户管家221/合同签署219/微管专员157/量房员126/主材服务管家48/
--     主材下单员47/主播45/下单员25; "待说明"占位与"营运"漂移写法不入典)
--    列语义: type列=JS属性名 / field列=常量KEY名 / key列=序号 / value列=角色名
--    前端: constant.decoration().decorationUser.contentRole.datas
--    🔴 app 版 crowdUser.js 有硬编码镜像 ROLE_OPTIONS, 库内增删角色须同步该处
-- ---------------------------------------------------------------------
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '合约专员(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_001', '1', '合约专员', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='合约专员');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '拆单员(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_002', '2', '拆单员', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='拆单员');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '大师班客户经理(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_003', '3', '大师班客户经理', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='大师班客户经理');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '大师班客户管家(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_004', '4', '大师班客户管家', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='大师班客户管家');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '前台服务咨询监理(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_005', '5', '前台服务咨询监理', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='前台服务咨询监理');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '合同签署(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_006', '6', '合同签署', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='合同签署');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '微管专员(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_007', '7', '微管专员', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='微管专员');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '量房员(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_008', '8', '量房员', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='量房员');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '主材服务管家(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_009', '9', '主材服务管家', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='主材服务管家');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '主材下单员(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_010', '10', '主材下单员', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='主材下单员');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '下单员(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_011', '11', '下单员', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='下单员');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '主播(服务团队角色)', 'decoration', 'decorationUser', 'contentRole', 'ROLE_012', '12', '主播', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' AND value='主播');

-- ---------------------------------------------------------------------
-- ② user 列索引: pageDecorationForUser 子查询 + 未来按人统计的支撑
-- ---------------------------------------------------------------------
SELECT COUNT(*) INTO @idx_flag FROM information_schema.STATISTICS
 WHERE TABLE_SCHEMA='decoration' AND TABLE_NAME='decorationUser' AND INDEX_NAME='idx_user';
SET @ddl = IF(@idx_flag=0,
  'ALTER TABLE decoration.decorationUser ADD INDEX idx_user (user)',
  'SELECT ''idx_user 已存在, 跳过'' AS msg');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- ---------------------------------------------------------------------
-- ③ 核验
-- ---------------------------------------------------------------------
-- 3.1 角色字典 12 行:
-- SELECT field, `key`, value FROM communion.constant
--  WHERE module='decoration' AND clazz='decorationUser' AND type='contentRole' ORDER BY CAST(`key` AS SIGNED);
-- 3.2 索引就位(应含 idx_user):
-- SHOW INDEX FROM decoration.decorationUser;
