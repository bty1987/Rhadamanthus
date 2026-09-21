-- =====================================================================
-- DECORATION_USER_SERVICE_TEAM.sql
-- 装修单服务团队(decoration.decorationUser)治理批次
--   ① DDL: createTime/creater 两列(补时间戳与操作人, 现状等价=存量全NULL)
--   ② 常量: 人员类型 type 6 枚举(老版前端 constant.decoration().decorationUser.type.keys)
--   ③ 存量去重: 同单同人同type重复行只留最小duid(5341组/5600行, 2026-09-21生产只读实测)
--   ④ 核验
--
-- 🔴 执行顺序: 本SQL必须先于 jar 发版(decoration/construction/customer 三jar同批)。
--    原因: 新jar的 DecorationUserPO 已映射 createTime/creater 两列, 旧表结构下
--    Hibernate 启动即报字段不存在; 常量行未插入时老版前端类型标签走硬编码回退,
--    不报错但标签不随库维护。
--
-- 幂等性: ①②③ 均可重复执行(①判断列存在, ②NOT EXISTS, ③跑第二遍0行命中)。
-- =====================================================================

-- ---------------------------------------------------------------------
-- ① DDL: 加 createTime(加入时间) / creater(添加人→communion.user.uid)
--    默认 NULL = 现状等价(存量行不伪造时间), 新行由后端写入
-- ---------------------------------------------------------------------
-- MySQL 5.6 无 IF NOT EXISTS, 用 information_schema 判断(存在则跳过)
SELECT COUNT(*) INTO @ddl_flag FROM information_schema.COLUMNS
 WHERE TABLE_SCHEMA='decoration' AND TABLE_NAME='decorationUser' AND COLUMN_NAME='createTime';
SET @ddl = IF(@ddl_flag=0,
  'ALTER TABLE decoration.decorationUser ADD COLUMN `createTime` timestamp NULL DEFAULT NULL COMMENT ''加入时间'' , ADD COLUMN `creater` int(11) NULL DEFAULT NULL COMMENT ''添加人uid(communion.user)''',
  'SELECT ''createTime/creater 已存在, 跳过'' AS msg');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- ---------------------------------------------------------------------
-- ② 常量: decoration.decorationUser 人员类型枚举
--    对齐 DecorationUserPO.TYPE_*_INT 常量(0业务/1装饰/2服务/3合同/4销售/99其他)
--    列语义: type列=JS属性名 / field列=常量KEY名 / key列=数值 / value列=中文
-- ---------------------------------------------------------------------
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '业务(人员类型)', 'decoration', 'decorationUser', 'type', 'TYPE_BUSI_INT', '0', '业务', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='type' AND field='TYPE_BUSI_INT');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '装饰(人员类型)', 'decoration', 'decorationUser', 'type', 'TYPE_DECO_INT', '1', '装饰', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='type' AND field='TYPE_DECO_INT');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '服务(人员类型)', 'decoration', 'decorationUser', 'type', 'TYPE_SERV_INT', '2', '服务', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='type' AND field='TYPE_SERV_INT');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '合同(人员类型)', 'decoration', 'decorationUser', 'type', 'TYPE_CONT_INT', '3', '合同', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='type' AND field='TYPE_CONT_INT');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '销售(人员类型)', 'decoration', 'decorationUser', 'type', 'TYPE_SALES_INT', '4', '销售', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='type' AND field='TYPE_SALES_INT');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '其他(人员类型)', 'decoration', 'decorationUser', 'type', 'TYPE_OTHER_INT', '99', '其他', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationUser' AND type='type' AND field='TYPE_OTHER_INT');

-- ---------------------------------------------------------------------
-- ③ 存量去重: (orderId, user, type) 重复组只留最小duid
--    成因: updateConstruction 每次保存工程信息盲插部门销售搭档行(旧代码无查重, 新jar已修)
--    注意: type 为 NULL 的历史手工行用 NULL 安全比较(<=>), 同单同人 NULL 组内同样去重
-- ---------------------------------------------------------------------
-- 预检(应≈5341组/5600行):
-- SELECT COUNT(*) dup_groups, SUM(c)-COUNT(*) rows_to_delete
--   FROM (SELECT orderId, user, type, COUNT(*) c FROM decoration.decorationUser
--          GROUP BY orderId, user, type HAVING COUNT(*)>1) t;

DELETE t FROM decoration.decorationUser t
JOIN (
    SELECT orderId, user, type, MIN(duid) AS keep_duid
    FROM decoration.decorationUser
    GROUP BY orderId, user, type
    HAVING COUNT(*) > 1
) m ON t.orderId = m.orderId AND t.user = m.user AND t.type <=> m.type AND t.duid > m.keep_duid;

-- ---------------------------------------------------------------------
-- ④ 核验
-- ---------------------------------------------------------------------
-- 4.1 新列就位:
-- SHOW COLUMNS FROM decoration.decorationUser LIKE 'createTime';
-- SHOW COLUMNS FROM decoration.decorationUser LIKE 'creater';
-- 4.2 常量 6 行:
-- SELECT field, `key`, value FROM communion.constant
--  WHERE module='decoration' AND clazz='decorationUser' AND type='type' ORDER BY CAST(`key` AS SIGNED);
-- 4.3 去重后应 0 组:
-- SELECT COUNT(*) FROM (SELECT orderId, user, type FROM decoration.decorationUser
--  GROUP BY orderId, user, type HAVING COUNT(*)>1) t;
