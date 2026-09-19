-- =====================================================================
-- 结算单 × 账户/扣款 闭环调整方案 上线SQL
-- 方案文档: docs/10-指南手册/BALANCE_ACCOUNT_CUTPAY_CLOSURE_DESIGN.md
-- 配套jar: fanglin-balance-8.3.0xx (SQL先于jar执行)
-- 幂等性: DDL可重复执行(MODIFY同类型为no-op); constant为NOT EXISTS守卫插入
-- =====================================================================

-- 1. 扣款金额字段扩容 (PO: BalanceCutpayPO.money int→long)
--    生产实测 money 已是 bigint(10), 本条为no-op兜底; total 生产为 int(11), 本条生效
ALTER TABLE balance.`balancecutpay` MODIFY COLUMN `money` bigint(10) NULL DEFAULT 0;
ALTER TABLE balance.`balancecutpay` MODIFY COLUMN `total` bigint(10) NULL DEFAULT 0 COMMENT '总额';

-- 2. 结算账户主体类型字典 (balanceAccount.utype: belonger→user.type, 0员工/1厂商)
--    驱动 结算账户页「主体类型」列翻译与筛选; 前端已带硬编码兜底, SQL缺行不影响页面打开
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '员工(账户主体类型)', 'balance', 'balanceAccount', 'utype', 'UTYPE_USER_INT', '0', '员工', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='balance' AND clazz='balanceAccount' AND field='UTYPE_USER_INT');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '厂商(账户主体类型)', 'balance', 'balanceAccount', 'utype', 'UTYPE_SUPPLIER_INT', '1', '厂商', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='balance' AND clazz='balanceAccount' AND field='UTYPE_SUPPLIER_INT');

-- 3. 菜单: 无新增 (结算单mid=463/扣款mid=892/结算账户mid=893/扣款账户mid=721 均已在产)
-- 4. 权限: 无新增 (手工建单「添加完结单」按钮与同页「付款」按钮同等页面级权限, 不设pageBtn门控)
