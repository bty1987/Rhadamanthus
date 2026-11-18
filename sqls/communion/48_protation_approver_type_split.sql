-- ============================================================================
-- 文件: 48_protation_approver_type_split.sql
-- 库表: communion.constant / approval.approver
-- 用途: 预签与报价优惠审批人配置拆分(2026-11-18)——此前预签侧借用报价侧的审批人类型,
--       两边共用同一批 approval.approver 配置行, 无法各自配审批人。拆分后四个审批四个独立 type:
--         22 报价优惠        (报价侧保持不动, 现有配置不动)
--         26 报价活动优惠    (报价侧保持不动, 现有配置不动; 字典 value 名'预签报价优惠'系历史遗留, 不改
--                             ——该字典行同时服务 approval.type=26 的审批列表显示, 改名会波及提现审批显示)
--         23 预签优惠        (预签特批/管理优惠 22→23; approver 已有 39 行/24公司 初始化配置, 前端直接切换启用)
--         28 预签活动优惠    (预签活动优惠 26→28 新增; 本脚本从 26 复制配置行)
--       后端零改动: queryApproverByType 按 type 透传查询; 预签审批创建/处理链按 approval.type=23 走,
--       审批人(receiver)在提交时选定后落 approval 表, 与 approver 配置无关。
--       审批人维护: 页面"功能维护→审批人配置"(approval4user.js)的 type 下拉来自本 constant 字典,
--       ①段执行后自动出现'预签活动优惠'选项, 即可页面维护。
-- 执行前置条件:
--       建议先执行本 SQL 再发前端(前端先发而 28 无配置行时, 预签活动优惠弹窗审批人列表为空,
--       提交被'请选择审批人'拦截, 不炸但有损可用性); 干跑: constant 无 key=28 行(首跑);
--       approver type=26 现有 22 行(18公司)、type=23 现有 39 行(24公司)、type=22 现有 54 行(24公司)。
-- 回滚方式: DELETE approval.approver WHERE type=28; DELETE communion.constant WHERE module='approval'
--           AND clazz='approval' AND type='type' AND `key`='28'; 前端还原 22/26。
-- 幂等性: 两段 INSERT 均带 NOT EXISTS 守卫, 可重复执行。
-- ⚠️ 可选对齐段(第③段, 默认建议执行): 23 现有配置为每公司固定两人(批量初始化),
--    而 22 的现网名单多数公司已增补第三人。若希望预签优惠审批人与报价优惠(22)当前名单一致,
--    执行③段(把 22 有而 23 无的行补进 23, 幂等); 若维持 23 现有两人名单则跳过③段。
--    执行后终验: ④段两处行数对账。
-- ============================================================================

-- ============ ① constant 字典新增 28 预签活动优惠(影响行数=1) ============

INSERT INTO communion.constant (module, clazz, type, field, `key`, value, status)
SELECT 'approval', 'approval', 'type', 'TYPE_PROTATION_ACTIVITY_PROFIT_INT', '28', '预签活动优惠', 0 FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM communion.constant
  WHERE module = 'approval' AND clazz = 'approval' AND type = 'type' AND `key` = '28'
);

-- ============ ② approver 复制 type=26 → type=28 预签活动优惠(期望≈22行, 与26行数一致) ============

INSERT INTO approval.approver (auid, type, comment, company)
SELECT a.auid, 28, a.comment, a.company
FROM approval.approver a
WHERE a.type = 26
  AND NOT EXISTS (
    SELECT 1 FROM approval.approver x
    WHERE x.auid = a.auid AND x.type = 28 AND x.company = a.company
  );

-- ============ ③(可选) 22→23 对齐补齐: 把报价优惠(22)有而预签优惠(23)无的审批人补进 23 ============
--    执行则预签特批/管理优惠审批人与报价优惠当前名单一致; 跳过则维持 23 初始化的两人名单。

INSERT INTO approval.approver (auid, type, comment, company)
SELECT a.auid, 23, a.comment, a.company
FROM approval.approver a
WHERE a.type = 22
  AND NOT EXISTS (
    SELECT 1 FROM approval.approver x
    WHERE x.auid = a.auid AND x.type = 23 AND x.company = a.company
  );

-- ============ ④ 验证段 ============

-- 1. 字典行: 期望 1 行(28/预签活动优惠/status=0)
SELECT `key`, field, value, status FROM communion.constant
WHERE module = 'approval' AND clazz = 'approval' AND type = 'type' AND `key` IN ('22','23','26','28')
ORDER BY CAST(`key` AS UNSIGNED);

-- 2. approver 行数对账: 22/23/26/28 各自的公司覆盖与行数
--    ②段后 28=26 行数; 执行③段后 23 ≥ 22 行数(按公司对齐)
SELECT type, COUNT(*) AS rows_cnt, COUNT(DISTINCT company) AS company_cnt
FROM approval.approver WHERE type IN (22, 23, 26, 28) GROUP BY type;
