-- ============================================================================
-- 生产待执行 SQL 汇总脚本(2026-11-01) —— 配套清单: PRODUCTION_SQL_PENDING_CHECKLIST_20261101.md
-- 来源文件: sqls/quotation/QUOTATIONRTEM_INDEX.sql
--           sqls/decoration/21_decoration_customer_name_condition.sql
--           sqls/communion/20_operation_sync_prosign_for_nerp.sql
--           sqls/communion/21_operation_sync_sign_payment_for_nerp.sql
--           sqls/sales/SALES_PAGE_BTN_SETTLE_WITHDRAW_BALANCE.sql
--           sqls/communion/17_task_payment_construction_check_finish.sql
--           sqls/material/30_add_aoodscharge_import_task.sql
--           sqls/decoration/menu_decoration4activityItem.sql
-- 执行渠道: 生产写通道人工执行, 按批次 A→B→C; 每项先跑前置核验再执行, 执行后跑验证
-- ============================================================================


-- ============================================================================
-- 批次A-① quotation.quotationrtem 业务索引  [🔴非幂等]
-- ============================================================================
-- 前置核验: 期望0行; 若>0行说明已建过, 跳过本项
SHOW INDEX FROM quotation.quotationrtem WHERE Key_name IN ('idx_sqiid','idx_tqiid');

ALTER TABLE quotation.quotationrtem
  ADD INDEX idx_sqiid (sqiid),
  ADD INDEX idx_tqiid (tqiid);

-- 执行后验证: 期望2行
SHOW INDEX FROM quotation.quotationrtem WHERE Key_name IN ('idx_sqiid','idx_tqiid');
-- 回滚: ALTER TABLE quotation.quotationrtem DROP INDEX idx_sqiid, DROP INDEX idx_tqiid;


-- ============================================================================
-- 批次A-② 装修单-客户"客户姓名"查询条件  [幂等]  来源: decoration/21号
-- ============================================================================
-- 前置核验: 期望0行
SELECT dfid, name, value FROM decoration.decorationfunction
WHERE `key` = 'condArr' AND value = 'decoration-customerName';

-- 1. 主表条件定义行(排客户电话 dfid=131 sort=38 之后)
INSERT INTO decoration.decorationfunction (name, `key`, value, type, subtype, sort)
SELECT '客户姓名', 'condArr', 'decoration-customerName', 2, 1, 39 FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM decoration.decorationfunction
    WHERE `key` = 'condArr' AND value = 'decoration-customerName'
);

-- 2. 绑定行: 复制客户电话(dfid=131)的全部绑定(仅装修单-客户变体)
INSERT INTO platform.decorationfunctionright (name, dfid, company)
SELECT r.name, f.dfid, r.company
FROM platform.decorationfunctionright r
JOIN decoration.decorationfunction f
    ON f.`key` = 'condArr' AND f.value = 'decoration-customerName'
WHERE r.dfid = 131
  AND NOT EXISTS (
      SELECT 1 FROM platform.decorationfunctionright x
      WHERE x.name = r.name AND x.company = r.company AND x.dfid = f.dfid
  );

-- 执行后验证: 定义1行, bindings 应与 dfid=131 的绑定数一致(当前77)
SELECT f.dfid, f.value,
       (SELECT COUNT(*) FROM platform.decorationfunctionright r WHERE r.dfid = f.dfid) AS bindings
FROM decoration.decorationfunction f WHERE f.`key` = 'condArr' AND f.value = 'decoration-customerName';
SELECT COUNT(*) AS customerPhone_bindings FROM platform.decorationfunctionright WHERE dfid = 131;
-- 回滚:
-- DELETE r FROM platform.decorationfunctionright r JOIN decoration.decorationfunction f
--   ON r.dfid=f.dfid WHERE f.`key`='condArr' AND f.value='decoration-customerName';
-- DELETE FROM decoration.decorationfunction WHERE `key`='condArr' AND value='decoration-customerName';


-- ============================================================================
-- 批次A-③ NERP 三接口 operation 注册  [幂等]  来源: communion/20+21号
-- ============================================================================
-- 前置核验: 期望0行
SELECT oid, operation, moduleId, through, type, status FROM communion.operation
WHERE operation IN ('syncProsignForNerp','syncSignContractForNerp','syncDecorationPaymentForNerp');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncProsignForNerp', 'syncProsignForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncProsignForNerp');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncSignContractForNerp', 'syncSignContractForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncSignContractForNerp');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, 'syncDecorationPaymentForNerp', 'syncDecorationPaymentForNerp', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncDecorationPaymentForNerp');

-- 执行后验证: 期望3行, 均 moduleId=6 / through=2 / type=2 / status=0
SELECT oid, operation, moduleId, through, type, status FROM communion.operation
WHERE operation IN ('syncProsignForNerp','syncSignContractForNerp','syncDecorationPaymentForNerp');
-- 回滚:
-- DELETE FROM communion.operation WHERE operation IN ('syncProsignForNerp','syncSignContractForNerp','syncDecorationPaymentForNerp');


-- ============================================================================
-- 批次A-④ 销售单"厂结"按钮 总控  [幂等]  来源: sales/SALES_PAGE_BTN_SETTLE_WITHDRAW_BALANCE.sql
-- ============================================================================
-- 一、落款/撤款核验(各应返回1行=已在产, 无需补; 无输出才需按源文件文末附录补插)
SELECT 'settle(落款)' item, pfid, `name`, type, company FROM platform.paymentfunctionright WHERE pfid = 179 AND type = 8;
SELECT 'withdraw(撤款)' item, pfid, `name`, type, company FROM platform.paymentfunctionright WHERE pfid = 91 AND type = 8;

-- 二、厂结按钮(salesfunction + salesfunctionright)
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

-- 三、执行后核验: 3a 功能行应1行; 3b right行应1行
SELECT sfid, `name`, `key`, `value`, type, subtype, `group`, sort FROM sales.salesfunction WHERE `key` = 'pageBtn' AND `value` = 'balance' AND `group` = 65;
SELECT sfrid, sfid, `name`, company FROM platform.salesfunctionright WHERE sfid = @balance_sfid;
-- 回滚:
-- DELETE FROM platform.salesfunctionright WHERE sfid = (SELECT sfid FROM sales.salesfunction WHERE `key`='pageBtn' AND value='balance' AND `group`=65);
-- DELETE FROM sales.salesfunction WHERE `key`='pageBtn' AND value='balance' AND `group`=65;


-- ============================================================================
-- 批次B-⑤ 款项工程验证导出 type=1 变体  [幂等]  来源: communion/17号
-- 🔴🔴 前置(库外动作, 必须先于本SQL): 执行器 /home/fanglin/cronbin/py3/
--     plan_export_decoration_payment_construction_check.py 已换新版本(type-first 取参);
--     未换脚本先跑本SQL = tid=181 存量任务切换窗口炸(旧脚本把type当pid/新脚本缺type报IndexError);
--     执行窗口避开 tid=181 计划执行时段。
-- 前置核验: 确认 tid=181 现状 filepath 无参数后缀、_finish 变体不存在
-- ============================================================================
SELECT tid, name, filepath, keyword FROM communion.task WHERE tid = 181;
SELECT tid, name, filepath FROM communion.task WHERE keyword = 'export_decoration_payment_construction_check_finish';

-- ① 现有任务: 固定 type=0(签单时间), 行为不变
UPDATE communion.task
SET filepath = '/home/fanglin/cronbin/py3/plan_export_decoration_payment_construction_check.py 0',
    name = '导出款项工程验证(签单时间)',
    comment = 'type=0按签单时间过滤; type=1变体见keyword=export_decoration_payment_construction_check_finish'
WHERE tid = 181;

-- ② 新增任务: type=1(工程验收时间)
INSERT INTO communion.task (name, filepath, plugins, level, type, handle, server, week, day, hour, status, isShow, comment, keyword)
SELECT '导出款项工程验证(工程验收时间)',
       '/home/fanglin/cronbin/py3/plan_export_decoration_payment_construction_check.py 1',
       'A', 0, 2, 0, 0, '', '', '', 0, 0,
       'type=1按工程验收时间(construction.construction.finishTime)过滤, 其余条件与签单时间变体一致',
       'export_decoration_payment_construction_check_finish'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.task WHERE keyword = 'export_decoration_payment_construction_check_finish');

-- 执行后验证: tid=181 filepath 带 " 0"; 新行 filepath 带 " 1"
SELECT tid, name, filepath, status, keyword FROM communion.task
WHERE tid = 181 OR keyword = 'export_decoration_payment_construction_check_finish';
-- 回滚:
-- DELETE FROM communion.task WHERE keyword = 'export_decoration_payment_construction_check_finish';
-- UPDATE communion.task SET filepath = '/home/fanglin/cronbin/py3/plan_export_decoration_payment_construction_check.py',
--   name = '导出款项工程验证' WHERE tid = 181;


-- ============================================================================
-- 批次B-⑥ 辅材费用导入计划任务  [幂等:先删后插]  来源: material/30号
-- 🔴🔴 前置(库外动作, 必须先于本SQL): 执行器已存在
--     /home/fanglin/cronbin/py3/plan_import_data_aoodscharge.py
--     (源码: 仓库 scripts/plan/plan_import_data_aoodscharge.py)
--     脚本不在 = 计划可建、执行必败。执行后无需重启(task 按 keyWord 实时查库)。
-- ============================================================================
DELETE FROM communion.task WHERE keyWord = 'import_aoodscharge';
INSERT INTO communion.task (
    name, filepath, level, type, plugins, keyWord, handle,
    server, week, day, hour, status, isShow, comment
) VALUES (
    '辅材费用导入',
    '/home/fanglin/cronbin/py3/plan_import_data_aoodscharge.py',
    0,
    2,
    NULL,
    'import_aoodscharge',
    1,
    0,
    NULL,
    NULL,
    NULL,
    0,
    1,
    '批量导入辅材费用数据(aoodsCharge), args: pid path aid'
);

-- 执行后验证: 期望1行, type=2 / handle=1 / status=0 / isShow=1
SELECT tid, name, filepath, type, handle, status, isShow FROM communion.task WHERE keyWord = 'import_aoodscharge';
-- 回滚: DELETE FROM communion.task WHERE keyWord = 'import_aoodscharge';


-- ============================================================================
-- 批次C-⑦ 抽奖"活动物品查询"菜单 mid=940  [module段🔴非幂等]  来源: decoration/menu_decoration4activityItem.sql
-- 前置核验: 期望0行(940未被占用); >0行则编号需顺延并同步改下面两条语句
-- 建议: 与 decoration-8.3.030(331482B) jar + 前端6文件同批部署
-- ============================================================================
SELECT mid, name, url FROM communion.module WHERE mid = 940;

-- 1. module: 菜单(装修单 → 活动物品查询)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (940, 39, '装修单-活动物品查询', '活动物品查询', '', 'icon-tag',
   '/views/decoration/decoration4activityItem.html', 3, 1, 26, '');

-- 2. rolemodule: 复制 mid=336(装修单-活动) 的全部角色授权(DISTINCT 去重历史重复行)
--    cuid=34 必须为真实存在的 user.uid(FL-00479 白添宇), 否则菜单接口 ObjectNotFoundException
INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT rm.`rid`, 940, rm.`link`, rm.`access`, 34, NOW(), rm.`company`
FROM `communion`.`rolemodule` rm
WHERE rm.`mid` = 336
  AND NOT EXISTS (SELECT 1 FROM `communion`.`rolemodule` t WHERE t.`mid` = 940 AND t.`rid` = rm.`rid` AND t.`company` = rm.`company`);

-- 执行后验证: 菜单1行; rolemodule 行数应与 mid=336 一致
SELECT mid, name, url FROM communion.module WHERE mid = 940;
SELECT COUNT(*) AS role_940 FROM communion.rolemodule WHERE mid = 940;
SELECT COUNT(*) AS role_336 FROM communion.rolemodule WHERE mid = 336;
-- 回滚:
-- DELETE FROM communion.rolemodule WHERE mid = 940;
-- DELETE FROM communion.module WHERE mid = 940;
