-- =============================================================================
-- 落款/撤款/厂结 三功能按钮 生产配置总控SQL（2026-10-15）
-- 覆盖: 销售收款页"落款/撤款"(platform.paymentfunctionright) + 销售单页"厂结"(sales.salesfunction)
--
-- 🔴 生产核验实况(2026-10-15 只读库):
--   落款 pfid=179(pageBtn=settle): right type=2(装修款页pfrid=4230) + type=8(销售款页pfrid=4267) 均已在产 → 无需插
--   撤款 pfid=91 (pageBtn=withdraw): right type=1(服务收款页pfrid=1785) + type=8(销售款页pfrid=4300) 均已在产
--     → SALES_PAYMENT_SETTLE_WITHDRAW_PAGEBTN.sql 已执行过, 其头"待生产"系过时标注
--   厂结 salesfunction: '厂结'名 0 行, MAX(sfid)=302 与 10-09 脚本注释吻合 → 唯一缺口, 本脚本插入
--     (老 sfid=112 value='balance' 名为'结算', right 绑 allowance/bpompany 页面变体, 与主销售页 name='sales' 无关不冲突)
--
-- 门控机制:
--   落款/撤款 = payment.js 家族 pageConfig 由 paymentUtils.getConfig(type) 按
--               payment.paymentfunction + platform.paymentfunctionright(name, type) 驱动,
--               页面type: payment.js=1 / decorationPayment.js=2 / materialPayment.js=4 / salesPayment.js=8
--   厂结     = sales 页 pageConfig.pageBtn 由 sales.salesfunction(key=pageBtn) + platform.salesfunctionright(name='sales') 驱动
--
-- 幂等性: 全段可重复执行(变量+NOT EXISTS 防重, 修复原 LAST_INSERT_ID 非幂等模式下重跑绑错的缺陷)
-- =============================================================================

-- ------------------------------------------------------------------
-- 一、落款/撤款核验(应各返回1行; 无输出行才需要补插, 补插语句见文末附录)
-- ------------------------------------------------------------------
SELECT 'settle(落款)' item, pfid, `name`, type, company FROM platform.paymentfunctionright WHERE pfid = 179 AND type = 8;
SELECT 'withdraw(撤款)' item, pfid, `name`, type, company FROM platform.paymentfunctionright WHERE pfid = 91 AND type = 8;

-- ------------------------------------------------------------------
-- 二、厂结按钮(salesfunction + salesfunctionright)
-- ------------------------------------------------------------------

-- 2a. 定位/创建 厂结 功能行(key=pageBtn, value=balance, group=65 照 sfid=278'推送'同族)
SET @balance_sfid := (
    SELECT sfid FROM sales.salesfunction
    WHERE `key` = 'pageBtn' AND `value` = 'balance' AND `group` = 65
    LIMIT 1
);

INSERT INTO sales.salesfunction (`name`, `key`, `value`, type, subtype, `group`, comment, sort)
SELECT '厂结', 'pageBtn', 'balance', 4, 1, 65, '销售单厂结数据查询(结算值/厂结值/厂结状态)', 15
FROM DUAL
WHERE @balance_sfid IS NULL;

SET @balance_sfid := IFNULL(@balance_sfid, LAST_INSERT_ID());

-- 2b. 绑定主销售单列表页(name='sales', company=1, 对齐现有 55 行口径)
INSERT INTO platform.salesfunctionright (sfid, `name`, company)
SELECT @balance_sfid, 'sales', 1
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM platform.salesfunctionright
    WHERE sfid = @balance_sfid AND `name` = 'sales' AND company = 1
);

-- ------------------------------------------------------------------
-- 三、执行后核验
-- ------------------------------------------------------------------
-- 3a. 厂结功能行(应1行, sfid=303或当前自增值)
SELECT sfid, `name`, `key`, `value`, type, subtype, `group`, sort FROM sales.salesfunction WHERE `key` = 'pageBtn' AND `value` = 'balance' AND `group` = 65;
-- 3b. 厂结right行(应1行)
SELECT sfrid, sfid, `name`, company FROM platform.salesfunctionright WHERE sfid = @balance_sfid;

-- =============================================================================
-- 附录(注释态, 拍板后另行执行):
-- A1. 装修款页(decorationPayment type=2)开放撤款: 当前仅落款(type=2已绑), 撤款未开放属业务口径,
--     如需开放执行(幂等):
--     INSERT INTO platform.paymentfunctionright (company, pfid, name, type)
--     SELECT 1, 91, 'common', 2 FROM DUAL
--     WHERE NOT EXISTS (SELECT 1 FROM platform.paymentfunctionright WHERE pfid = 91 AND name = 'common' AND type = 2);
-- A2. 撤款接口 operation 登记(使命名+后续关闸能力, 可选, through=1 收集放行):
--     INSERT INTO communion.operation (operation, name, through, status, type)
--     SELECT 'withdrawSalesPayment', '撤销销售款', 1, 0, 0 FROM DUAL
--     WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'withdrawSalesPayment');
--
-- 部署序: 本SQL先于/随前端同批(按钮未配置不显示, 配置后即生效); 配套 jar/deployment 见
--         销售单落款/撤款上线准备(payment-8.3.030 + app前端spId修复) 与 厂结(sales4balance片段页)
-- =============================================================================
