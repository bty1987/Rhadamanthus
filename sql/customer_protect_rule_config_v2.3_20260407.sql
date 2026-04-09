-- =============================================
-- 客户保护规则 - 配置SQL（V2.3精简版）
-- 文档：docs/customer_protect_rule_adjustment.md
-- 日期：2026-04-07
-- 更新：使用天数代替月数（12个月=360天）
--
-- 执行前请先替换以下占位符：
-- {cuid}               -> 执行人用户ID
-- {SALESMAN_DUTY_ID}   -> 业务员岗位ID
-- {ECOMMERCE_DUTY_ID}  -> 电商岗位ID
-- {SUPERVISOR_DUTY_ID} -> 监理岗位ID
-- =============================================

-- =============================================
-- 1. 清空旧配置（软删除）
-- =============================================
UPDATE customer.customerprotectrule
SET status = 1
WHERE company = 1;

-- =============================================
-- 2. 面积保护规则（type=0）
-- =============================================
INSERT INTO customer.customerprotectrule
(type, title, uppval, lowval, days, priority, status, company, cuid, createtime)
VALUES
(0, '200㎡以下-7天', 0, 200, 7, 100, 0, 1, {cuid}, NOW()),
(0, '201-500㎡-15天', 201, 500, 15, 100, 0, 1, {cuid}, NOW()),
(0, '501㎡以上-30天', 501, 999999, 30, 100, 0, 1, {cuid}, NOW());

-- =============================================
-- 3. 预付款保护规则（type=1）
-- =============================================
INSERT INTO customer.customerprotectrule
(type, title, uppval, lowval, days, priority, status, company, cuid, createtime)
VALUES
(1, '定金5000+保护30天', 5000, 99999999, 30, 100, 0, 1, {cuid}, NOW());

-- =============================================
-- 4. 岗位组合规则（type=3）
-- V2.3精简版：只配置原岗位，不配置目标岗位
-- 时间单位：天数（12个月=360天）
-- =============================================

-- 规则1：业务员，360天内，走审批
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '业务员-360天内-走审批', '{SALESMAN_DUTY_ID}', 1, 360, 1, 200, 0, 1, {cuid}, NOW());

-- 规则2：业务员，360天外，直接改归属
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '业务员-360天外-直接改归属', '{SALESMAN_DUTY_ID}', 2, 360, 0, 200, 0, 1, {cuid}, NOW());

-- 规则3：电商，360天内，走审批
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '电商-360天内-走审批', '{ECOMMERCE_DUTY_ID}', 1, 360, 1, 200, 0, 1, {cuid}, NOW());

-- 规则4：电商，360天外，直接改归属
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '电商-360天外-直接改归属', '{ECOMMERCE_DUTY_ID}', 2, 360, 0, 200, 0, 1, {cuid}, NOW());

-- 规则5：监理，直接合尺，不限制时间
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '监理-直接合尺', '{SUPERVISOR_DUTY_ID}', 0, 0, 0, 200, 0, 1, {cuid}, NOW());

-- 规则6：默认规则-其他岗位，直接改归属
INSERT INTO customer.customerprotectrule
(type, title, from_duty_ids, time_condition_type, time_condition_day,
 need_approval, priority, status, company, cuid, createtime)
VALUES
(3, '默认规则-其他岗位-直接改归属', '0', 0, 0, 0, 0, 0, 1, {cuid}, NOW());

-- =============================================
-- 5. 验证配置结果
-- =============================================
SELECT
    cprid,
    CASE type
        WHEN 0 THEN '面积'
        WHEN 1 THEN '预付款'
        WHEN 2 THEN '设计费'
        WHEN 3 THEN '岗位组合'
        ELSE CONCAT('未知(', type, ')')
    END AS 类型,
    title AS 标题,
    from_duty_ids AS 原岗位,
    CASE time_condition_type
        WHEN 0 THEN '不限制'
        WHEN 1 THEN CONCAT(time_condition_day, '天内')
        WHEN 2 THEN CONCAT(time_condition_day, '天外')
        ELSE '未知'
    END AS 时间条件,
    CASE need_approval
        WHEN 0 THEN '不需要'
        WHEN 1 THEN '需要'
        ELSE '未设置'
    END AS 需审批,
    priority AS 优先级,
    CASE status
        WHEN 0 THEN '✓有效'
        ELSE '✗失效'
    END AS 状态
FROM customer.customerprotectrule
WHERE company = 1 AND status = 0
ORDER BY type, priority DESC, cprid;
