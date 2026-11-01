-- ============================== userinfo 孤儿档案修复 ==============================
-- 用途: ① 补齐 communion.user 有档而 userinfo 无档案行的孤儿(2026-11-01 实查 21 个);
--       ② 清理 communion.userinfo 有档案而 user 已无对应 uid 的悬空行(实查 7 个)。
-- 根因: seiya A20260324ServiceImpl.syncUser 新增分支只写 user+userrole+定岗人数, 不建 userinfo 档案、
--       不写 userexperience 入职记录(与 personel addUser / A20251208 / A20260404 三链不一致),
--       FL-54773~FL-54805 批量同步进来的 18 人(含 FL-54777 李强)全部漏档; 另 3 个历史散例
--       (OC-19344 离职厂商 / FL-22470 / syfanglin 系统号)成因各异, 一并补齐口径统一。
-- 影响: 员工管理列表(UserServiceImpl.pageUserInfo)以 userinfo 为驱动表, 漏档用户在列表不可见;
--       详情 queryUserInfoByUserId 返 null。登录不受影响(user 表行在)。
-- 前置: 无依赖任意时间可执行; 两段均幂等可重跑(NOT EXISTS 守护 / 精确 uiid+存在性双闸)。
-- 回滚: ① 按 SELECT 留存的 uid 清单 DELETE FROM communion.userinfo WHERE uid IN (<留存清单>) AND salary='0';
--       ② 删除操作不可逆, 执行前必须先跑段2开头的备份 SELECT 留存结果集。
-- 验证: 段1后孤儿计数应为 0; 段2后悬空 uiid 计数应为 0; FL-54777 应有档案行。

-- ===== 段1: 补档(骨架行, salary='0' 照同批正常行口径, hireTime=补档时间, HR 可页面修正) =====
INSERT INTO communion.userinfo (uid, salary, hireTime)
SELECT u.uid, '0', NOW()
FROM communion.user u
WHERE NOT EXISTS (SELECT 1 FROM communion.userinfo ui WHERE ui.uid = u.uid);

-- 段1核对(期望 0):
SELECT u.uid, u.userId, u.userName, u.company, u.type, u.status
FROM communion.user u
LEFT JOIN communion.userinfo ui ON ui.uid = u.uid
WHERE ui.uiid IS NULL;

-- ===== 段2: 清理悬空档案(2026-11-01 实查 7 行: uiid 53878/53880/53884/53885/53887/53899/53901, uid 56306~56329 均已无 user 行) =====
-- 🔴 删除前先跑本备份 SELECT 留存结果集(回滚唯一依据):
SELECT uiid, uid, salary, level, gender, entryTime
FROM communion.userinfo ui
LEFT JOIN communion.user u ON u.uid = ui.uid
WHERE u.uid IS NULL;

DELETE FROM communion.userinfo
WHERE uiid IN (53878, 53880, 53884, 53885, 53887, 53899, 53901)
  AND NOT EXISTS (SELECT 1 FROM communion.user u WHERE u.uid = userinfo.uid);

-- 段2核对(期望 0):
SELECT COUNT(*) FROM communion.userinfo ui
LEFT JOIN communion.user u ON u.uid = ui.uid
WHERE u.uid IS NULL;

-- 抽验(期望 1 行档案, salary='0'):
SELECT ui.uiid, ui.uid, ui.salary, ui.hireTime, u.userId, u.userName
FROM communion.userinfo ui, communion.user u
WHERE ui.uid = u.uid AND u.userId = 'FL-54777';
