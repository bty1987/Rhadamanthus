-- ============================================================================
-- 外销款页面(pageOalesPayment, right.type=65)装修单号条件切换
--   decoration-orderId (pfid=42)  →  payment-orderId (pfid=149)
--
-- 背景:
--   老版外销款页面(方林 company=1, common/collect 两组)condArr 配置 decoration-orderId,
--   该共享条件组件(js/condition/decoration.js orderId)提交过滤字段 decoration.orderId,
--   经 OalesDaoImpl 点前缀链 DecorationDaoImpl.queryFilterExcute(prefix="oales.decoration")
--   拼出 criterion "oales.decoration.orderId" —— Hibernate 3.6 只以首段 token 匹配 alias,
--   剩余 decoration.orderId 在 OalesPO 属性映射中不存在,列表查询必炸:
--   could not resolve property: decoration.orderId of: com.fanglin.sales.po.OalesPO
--   (生产 2026-08-29 11:21:15, IP 223.100.27.233)
--
-- 方案(前台条件切换,不动 Java/共享组件):
--   payment-orderId 条件组件(js/condition/payment.js orderId)提交裸 orderId,
--   走 OalesPaymentDaoImpl 既有 orderId 分支(OalesPaymentPO 自带 @Column orderId 冗余列,
--   生产 7613 行 0 空值,与 oales 表 orderId 0 不一致,数据等价)。
--   pfid=149 配置行已存在(装修款页 group=4 在用)。
--
-- 影响行: 仅 2 行 —— pfrid 4181(common) / 4196(collect), 均 company=1
-- 幂等性: WHERE pfid=42 条件即幂等,重复执行无副作用
-- ============================================================================

UPDATE platform.paymentfunctionright SET pfid = 149
WHERE type = 65 AND pfid = 42 AND company = 1;

-- 执行后核对: 应查出 2 行 payment-orderId,0 行 decoration-orderId
SELECT r.pfrid, r.name, r.company, f.pfid, f.`value`
FROM platform.paymentfunctionright r
JOIN payment.paymentfunction f ON f.pfid = r.pfid
WHERE r.type = 65 AND r.pfid IN (42, 149);

-- 回滚(如需):
-- UPDATE platform.paymentfunctionright SET pfid = 42
-- WHERE type = 65 AND pfid = 149 AND company = 1 AND pfrid IN (4181, 4196);
