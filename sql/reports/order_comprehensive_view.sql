-- ================================================
-- 订单综合信息视图
-- 包含：客户机会、装修单状态、收款信息、归属信息
-- 状态过滤：只包含装修单状态为 0, 1, 4, 6 的订单
-- ================================================

CREATE OR REPLACE VIEW view_order_comprehensive AS
SELECT
    -- 基础信息
    d.orderId AS '订单编号',
    d.orderId,

    -- 客户机会信息
    communion.kv('customer', 'customerchance', 'status', cc.status) AS '机会状态',
    cc.meetTime AS '到店时间',
    co.name AS '设计公司',
    communion.kv('customer', 'customersource', 'demand', cs.demand) AS '客户需求',

    -- 装修单状态和时间
    communion.kv('decoration', 'decoration', 'status', d.status) AS '装修单状态',
    d.status AS '装修单状态值',
    d.precontractTime AS '预签时间',
    d.contractTime AS '签约时间',

    -- 设计费收款信息
    dp_design.referMoney AS '设计费金额',
    dr_design.collectTime AS '设计费收款时间',

    -- 服务费收款信息（装饰）
    dp_service.referMoney AS '服务费金额_装饰',
    dr_service.collectTime AS '服务费收款时间_装饰',

    -- 服务费收款信息（独立服务）
    sp.serviceMoney AS '服务费金额_服务',
    sr.collectTime AS '服务费收款时间_服务',

    -- 归属信息
    communion.kv('decoration', 'decorationbelong', 'type', db.type) AS '归属类型',
    u.currentname AS '归属员工',
    dpt.name AS '归属部门',
    db.rate/1000 AS '分配比例',
    db.defaultflag AS '是否默认'

FROM decoration.decoration d

-- 客户机会信息关联
LEFT JOIN customer.customerchance cc ON d.ccid = cc.ccid
LEFT JOIN customer.customersource cs ON cc.csid = cs.csid
LEFT JOIN communion.company co ON cc.company = co.cid

-- 设计费收款信息
LEFT JOIN payment.decorationpayment dp_design ON d.orderId = dp_design.orderId AND dp_design.paymentType = '设计费'
LEFT JOIN payment.decorationReceipt dr_design ON dp_design.drid = dr_design.drid

-- 服务费收款信息（装饰）
LEFT JOIN payment.decorationpayment dp_service ON d.orderId = dp_service.orderId AND dp_service.paymentType = '服务费'
LEFT JOIN payment.decorationReceipt dr_service ON dp_service.drid = dr_service.drid

-- 服务费收款信息（独立服务）
LEFT JOIN payment.servicepayment sp ON d.orderId = sp.orderId
LEFT JOIN payment.serviceReceipt sr ON sp.srid = sr.srid

-- 归属信息关联
LEFT JOIN decoration.decorationbelong db ON d.orderId = db.orderId
LEFT JOIN communion.user u ON db.buid = u.uid
LEFT JOIN communion.department dpt ON db.did = dpt.did

-- 状态过滤：只包含特定状态的装修单
WHERE d.status IN (0, 1, 4, 6);

-- ================================================
-- 使用示例
-- ================================================
-- 查询所有订单的综合信息
-- SELECT * FROM view_order_comprehensive;

-- 查询特定订单的信息
-- SELECT * FROM view_order_comprehensive WHERE orderId = '1601010001';

-- 查询特定公司的订单
-- SELECT * FROM view_order_conprehensive WHERE `设计公司` = '方林装饰';

-- 查询已签约的订单
-- SELECT * FROM view_order_conprehensive WHERE `装修单状态` = '已签约' AND `签约时间` IS NOT NULL;
