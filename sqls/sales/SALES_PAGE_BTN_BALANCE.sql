-- =============================================================================
-- 销售单页面(sales)新增"厂结"行按钮——结算数据查询(结算值/厂结值/厂结状态)
-- 日期: 2026-10-09
-- ⚠️ 2026-10-15 本脚本被幂等加固版吸收替代: sqls/sales/SALES_PAGE_BTN_SETTLE_WITHDRAW_BALANCE.sql
--    (原版 INSERT+LAST_INSERT_ID 非幂等, 重复执行会产生重复行且right绑错; 新版变量+NOT EXISTS全幂等。
--     生产执行请用总控版, 本文件留存作历史记录)
-- 功能: sales.html 行按钮"厂结"(key=balance) → 弹窗展示本单 salesbalance 结算记录:
--       结算单号/类型/状态(待厂结/厂商已结算/已结算)/结算值(total)/厂结值(vbalance)/
--       差额(difference)/厂结人/厂结时间/创建时间
-- 配套前端: sales.js(buttonMap.balance+balanceSales) + sales.html(salesBalanceModal)
--           + api/sales.js(querySalesBalanceByOrderId tranargs 扩展 total/vbalance/difference 等)
--           零后端改动(复用 querySalesBalanceByOrderId)
-- 机制: salesfunction + salesfunctionright 三层配置(buttonMap 由页面 pageBtn 配置驱动)
-- 🔴 先于/随前端发版执行(按钮未配置时不显示,配置后即生效;非幂等,重复执行产生重复行)
-- 参照: sfid=278('推送',pageBtn,send,type4,subtype1,group65) 同款配置模式,company 与
--       现有 name='sales' 的 55 行一致仅绑定公司1;MAX(sfid)=302,新行取自增
-- 回滚: DELETE FROM platform.salesfunctionright WHERE sfid=(SELECT sfid FROM sales.salesfunction WHERE `value`='balance' AND `key`='pageBtn' AND type=4);
--       DELETE FROM sales.salesfunction WHERE `value`='balance' AND `key`='pageBtn' AND type=4;
-- =============================================================================

INSERT INTO sales.salesfunction (`name`, `key`, `value`, type, subtype, `group`, comment, sort)
VALUES ('厂结', 'pageBtn', 'balance', 4, 1, 65, '销售单厂结数据查询(结算值/厂结值/厂结状态)', 15);

SET @balance_sfid := LAST_INSERT_ID();

INSERT INTO platform.salesfunctionright (sfid, `name`, company)
VALUES (@balance_sfid, 'sales', 1);

-- 核验(应各返回1行)
SELECT sfid, `name`, `key`, `value`, type, subtype, `group`, sort FROM sales.salesfunction WHERE sfid = @balance_sfid;
SELECT sfrid, sfid, `name`, company FROM platform.salesfunctionright WHERE sfid = @balance_sfid;
