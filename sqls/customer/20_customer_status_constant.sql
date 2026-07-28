-- ==========================================
-- customer.customer 补录 status 枚举常量
-- 表: communion.constant (module=customer)
-- ==========================================
-- 背景:
--   customer.customer 在 constant 表无 status 记录, 但 CustomerPO 有枚举:
--   0=初始 STATUS_INIT_INT / 1=认证 STATUS_AUTH_INT / 2=已认证 STATUS_AUTHED_INT
--   decoration4detail.js 等处引用 customer.status 需此常量。
--
-- 幂等 upsert。
-- ==========================================

DROP TEMPORARY TABLE IF EXISTS customer_status_tmp;
CREATE TEMPORARY TABLE customer_status_tmp (
  name varchar(32) NOT NULL, module varchar(64) NOT NULL, clazz varchar(64) NOT NULL,
  type varchar(64) NOT NULL, field varchar(64) NULL, `key` varchar(64) NOT NULL,
  value varchar(64) NULL, status tinyint(1) NOT NULL
);

INSERT INTO customer_status_tmp (name, module, clazz, type, field, `key`, value, status) VALUES
('初始(客户状态)', 'customer', 'customer', 'status', 'STATUS_INIT_INT', '0', '初始', 0),
('认证(客户状态)', 'customer', 'customer', 'status', 'STATUS_AUTH_INT', '1', '认证', 0),
('已认证(客户状态)', 'customer', 'customer', 'status', 'STATUS_AUTHED_INT', '2', '已认证', 0);

UPDATE communion.constant c
INNER JOIN customer_status_tmp t
  ON c.module=t.module AND c.clazz=t.clazz AND c.type=t.type AND c.`key`=t.`key`
SET c.name=t.name, c.field=t.field, c.value=t.value;

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT t.name, t.module, t.clazz, t.type, t.field, t.`key`, t.value, t.status
FROM customer_status_tmp t
LEFT JOIN communion.constant c
  ON c.module=t.module AND c.clazz=t.clazz AND c.type=t.type AND c.`key`=t.`key`
WHERE c.cid IS NULL;

DROP TEMPORARY TABLE IF EXISTS customer_status_tmp;
SELECT `key`, value, field FROM communion.constant
WHERE module='customer' AND clazz='customer' AND type='status' ORDER BY `key`;
