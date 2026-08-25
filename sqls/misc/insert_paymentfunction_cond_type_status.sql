-- payment/decorationPayment/salesPayment 三个页面增加 类型/状态 查询条件
-- 说明:
--   条件组件已在前端 js/condition/payment.js 中定义, 需在配置表注册后页面才展示
--   payment.paymentfunction: 条件明细(name=中文标签, key=condArr, value=组件名, group=95 与 payment- 前缀条件同组, type=2 普通值, subtype=1 数组追加, status=0 启用)
--   platform.paymentfunctionright: 绑定页面环节(name=collect/common) + 页面类型(type: 1预付款/2装修款/8销售款), company 复制同组现有行的取值
--   sort=30/31 置于现有条件之后, 可按需调整顺序

-- 预付款(payment.js): 类型 + 状态
INSERT INTO payment.paymentfunction (name, `key`, value, `group`, type, subtype, status, sort) VALUES ('类型', 'condArr', 'payment-advancePaymentType', 95, 2, 1, 0, 30);
SET @pfid = LAST_INSERT_ID();
INSERT INTO platform.paymentfunctionright (name, pfid, type, company)
SELECT DISTINCT r.name, @pfid, r.type, r.company FROM platform.paymentfunctionright r WHERE r.name IN ('collect', 'common') AND r.type = 1;

INSERT INTO payment.paymentfunction (name, `key`, value, `group`, type, subtype, status, sort) VALUES ('状态', 'condArr', 'payment-status', 95, 2, 1, 0, 31);
SET @pfid = LAST_INSERT_ID();
INSERT INTO platform.paymentfunctionright (name, pfid, type, company)
SELECT DISTINCT r.name, @pfid, r.type, r.company FROM platform.paymentfunctionright r WHERE r.name IN ('collect', 'common') AND r.type = 1;

-- 装修款(decorationPayment.js): 类型 + 状态
INSERT INTO payment.paymentfunction (name, `key`, value, `group`, type, subtype, status, sort) VALUES ('类型', 'condArr', 'payment-decorationPayment-paymentType', 95, 2, 1, 0, 30);
SET @pfid = LAST_INSERT_ID();
INSERT INTO platform.paymentfunctionright (name, pfid, type, company)
SELECT DISTINCT r.name, @pfid, r.type, r.company FROM platform.paymentfunctionright r WHERE r.name IN ('collect', 'common') AND r.type = 2;

INSERT INTO payment.paymentfunction (name, `key`, value, `group`, type, subtype, status, sort) VALUES ('状态', 'condArr', 'payment-decorationPayment-paymentStatus', 95, 2, 1, 0, 31);
SET @pfid = LAST_INSERT_ID();
INSERT INTO platform.paymentfunctionright (name, pfid, type, company)
SELECT DISTINCT r.name, @pfid, r.type, r.company FROM platform.paymentfunctionright r WHERE r.name IN ('collect', 'common') AND r.type = 2;

-- 销售款(salesPayment.js): 类型 + 状态
INSERT INTO payment.paymentfunction (name, `key`, value, `group`, type, subtype, status, sort) VALUES ('类型', 'condArr', 'payment-salesPayment-type', 95, 2, 1, 0, 30);
SET @pfid = LAST_INSERT_ID();
INSERT INTO platform.paymentfunctionright (name, pfid, type, company)
SELECT DISTINCT r.name, @pfid, r.type, r.company FROM platform.paymentfunctionright r WHERE r.name IN ('collect', 'common') AND r.type = 8;

INSERT INTO payment.paymentfunction (name, `key`, value, `group`, type, subtype, status, sort) VALUES ('状态', 'condArr', 'payment-salesPayment-status', 95, 2, 1, 0, 31);
SET @pfid = LAST_INSERT_ID();
INSERT INTO platform.paymentfunctionright (name, pfid, type, company)
SELECT DISTINCT r.name, @pfid, r.type, r.company FROM platform.paymentfunctionright r WHERE r.name IN ('collect', 'common') AND r.type = 8;
