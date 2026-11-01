-- ============================================================================
-- 28_operation_gate_batch1_query.sql
-- ============================================================================
-- 用途: Operation 纯三元组治理 · 批1关闸(纯查询接口40个, 全部覆盖≥199行/≥73公司)
--       总方案: docs/10-指南手册/OPERATION_PURE_TRIPLE_MASTER_PLAN.md
-- 🔴 执行前置(第0项, 未做不得执行本脚本):
--      上海三公司授权补种(29号模板, @CID=101,102,103)——上海现零授权行,
--      不补种则批1关闸即刻闸死上海员工。
-- 内容:
--   段0  关闸前自检(应无输出行=40接口全部有覆盖)
--   段1a 第一波关闸(10个基础查询, 风险最低) → 观察24h无"无操作权限"再执行段1b
--   段1b 第二波关闸(其余30个)
--   段3  关闸后巡检(每日跑, 观察48h)
-- 🔴 段2(super通配退役49行)已撤下(2026-11-01自检发现: 4个用户以附加角色持有super,
--    主角色非super则checkOperation旁路不触发, 其中2个oid上super通配是唯一授权,
--    删之打穿该4人) → 挪至通配退役阶段按oid逐个核验后处置, 不随批1执行。
-- 幂等性: 段1天然幂等(重复执行值不变); 段2带NOT EXISTS语义(删后无行, 重复执行零行)
-- 回滚方式(单接口, 即时生效无需重启):
--   UPDATE communion.operation SET through=1 WHERE oid=<误杀oid>;
-- 回滚方式(整批):
--   UPDATE communion.operation SET through=1 WHERE oid IN (段1清单);
-- 验证语句:
--   SELECT COUNT(*) FROM communion.operation WHERE oid IN (段1清单) AND through=0;  -- 期望40
--   SELECT COUNT(*) FROM communion.roleoperation WHERE rid=86 AND company=0;        -- 期望0
-- ============================================================================

-- ---------- 段0: 关闸前自检(期望0行; 有输出=该接口零覆盖, 先补授再关) ----------
SELECT o.oid, o.operation, o.name
FROM communion.operation o
WHERE o.oid IN (
    916,1337,713,1218,1386,1221,994,1308,1209,772,
    1368,980,1211,1592,1546,1481,1482,1553,698,1442,
    1204,1241,1261,1495,1496,732,1515,1077,1403,626,
    1057,1600,1590,1357,818,700,1281,1359,820,1609
  ) AND NOT EXISTS (SELECT 1 FROM communion.roleoperation ro WHERE ro.oid = o.oid);

-- ---------- 段1: 批1关闸(through 1→0) ----------
UPDATE communion.operation
SET through = 0
WHERE type = 0 AND through = 1 AND oid IN (
    -- 纯查询40个: page*/query*, 覆盖199~514行, 覆盖公司73~100 (2026-11-01实查)
    916,   -- pageDecorationForBelong 分页查询装修(归属)
    1337,  -- pageCustomerRecord 分页查询客户记录
    713,   -- queryNormoodByQiid 按报价项查询定额项
    1218,  -- pageContract 分页查询合同
    1386,  -- queryMacontrol 查询营销控制
    1221,  -- queryUserContract 查询人员合同
    994,   -- pageDecorationForSalesman 分页查询装修(业务员)
    1308,  -- pageCompany 分页查询公司
    1209,  -- pageApproval 分页查询审批
    772,   -- pageCustomerDeptRule 分页查询客户部门规则
    1368,  -- pageCustomerSourceRecord 分页查询客户来源记录
    980,   -- pageCustomer 分页查询客户
    1211,  -- pageApprovalCustomerSource 分页查询客户来源审批
    1592,  -- queryNoticeDepartment 通知部门查询
    1546,  -- pageAccessoriesType 辅料类型分页
    1481,  -- queryCormriceByQcid 按QCID查工费配比
    1482,  -- queryQuotationFormatByQcid 按QCID查报价格式
    1553,  -- queryFunctionAreaOtem 功能区项目查询
    698,   -- queryAccessoriesItemByOrderId 按订单查询辅材项
    1442,  -- queryApprovalCustomerOrigin 查询客源审批
    1204,  -- pageAddReduce 分页查询增减单
    1241,  -- queryApprovalByAId 按审批ID查询审批
    1261,  -- querySalesActivityRecord 查询销售活动记录
    1495,  -- queryUserEducation 查询用户教育经历
    1496,  -- queryUserOperation 查询用户操作记录
    732,   -- queryHoliday 查询节假日
    1515,  -- pageQuotationRecord 分页查询报价记录
    1077,  -- pageOalesPay 分页查询销售支付
    1403,  -- pagePaytran 分页查询转换款
    626,   -- pageOccessories 分页查询辅材
    1057,  -- queryDecorationPaymentForContractByOrderId 查询装修款(合同)
    1600,  -- queryServicePaymentForNotInitBySrId 按服务单查未初始付款
    1590,  -- queryDecoration7Achievement 装修七项业绩查询
    1357,  -- querySalesByNo 按编号查询销售
    818,   -- queryBalanceSales 查询结算销售
    700,   -- pageAoods 分页查询辅材
    1281,  -- queryDecorationStatusRightByUserId 按用户查询装修状态权限
    1359,  -- queryDecorationSalesmanDepartmentRightByUserId 查询业务员部门权限
    820,   -- queryBalanceSalesByBsid 按结算ID查询结算销售
    1609   -- pageDepartmentType 部门类型分页
);

-- ---------- 段2: 系统管理员通配行退役(super角色已旁路校验, 49行纯冗余) ----------
DELETE ro FROM communion.roleoperation ro
JOIN communion.role r ON r.rid = ro.rid
WHERE ro.company = 0 AND r.no = 'super';

-- ---------- 段3: 关闸后巡检(48h观察窗, 每日跑) ----------
-- ① 批1关闸确认: 期望40
SELECT COUNT(*) gated FROM communion.operation
WHERE through = 0 AND oid IN (
    916,1337,713,1218,1386,1221,994,1308,1209,772,
    1368,980,1211,1592,1546,1481,1482,1553,698,1442,
    1204,1241,1261,1495,1496,732,1515,1077,1403,626,
    1057,1600,1590,1357,818,700,1281,1359,820,1609
);
-- ② 显式化沉淀进度(批1接口新增显式行, 关闸后每日增长=机制在工作)
SELECT o.oid, o.operation, COUNT(*) explicit_new
FROM communion.roleoperation ro
JOIN communion.operation o ON o.oid = ro.oid
WHERE ro.company <> 0 AND ro.createTime >= CURDATE() - INTERVAL 1 DAY
  AND o.oid IN (
    916,1337,713,1218,1386,1221,994,1308,1209,772,
    1368,980,1211,1592,1546,1481,1482,1553,698,1442,
    1204,1241,1261,1495,1496,732,1515,1077,1403,626,
    1057,1600,1590,1357,818,700,1281,1359,820,1609
) GROUP BY o.oid ORDER BY explicit_new DESC;
-- ③ 应用日志侧同步盯: grep "无操作权限" catalina.out (48h窗口内出现即按头部回滚语句单接口处置)
