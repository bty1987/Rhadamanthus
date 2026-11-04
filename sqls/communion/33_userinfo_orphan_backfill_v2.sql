-- ============================== userinfo 孤儿档案补录 v2(24号后新增批次) ==============================
-- 用途: 24号SQL(2026-11-01)执行后, 生产 seiya 旧 jar(syncUser 漏建 userinfo 分支, 根治 jar 109689B 未部署)
--       又造出 10 个新孤儿(2026-11-03 实查): FL-54812刘丙成/FL-54827刘倩/FL-54828任东旭/FL-54829杨平星/
--       FL-54830党晓侠/FL-54831刘彤希/FL-54832王丹丹/FL-54833张通(济南98)/FL-54834李双双(济南98)/FL-54835赵长倩(济南98)。
-- 事故: 济南方林 FL-54833 张通执行调职接口(tranUserForPlatforPm / tranUser)报"系统问题"——
--       两链路尾部 userInfoPO.setTranTime 裸取不判空, userinfo 缺行 → NPE(代码判空已另行补齐)。
-- 前置: 无依赖任意时间可执行; NOT EXISTS 守护幂等可重跑, 执行时点前新造的孤儿一并补齐。
-- 回滚: DELETE FROM communion.userinfo WHERE uid IN (62893,62908,62909,62910,62911,62912,62913,62914,62915,62916) AND salary='0';
-- 验证: 段后孤儿计数应为 0; FL-54833 应有档案行(salary='0')。

INSERT INTO communion.userinfo (uid, salary, hireTime)
SELECT u.uid, '0', NOW()
FROM communion.user u
WHERE NOT EXISTS (SELECT 1 FROM communion.userinfo ui WHERE ui.uid = u.uid);

-- 核对1(期望 0):
SELECT u.uid, u.userId, u.userName, u.company, u.status
FROM communion.user u
LEFT JOIN communion.userinfo ui ON ui.uid = u.uid
WHERE ui.uid IS NULL;

-- 核对2(期望 1 行档案):
SELECT ui.uiid, ui.uid, ui.salary, ui.hireTime, u.userId, u.userName
FROM communion.userinfo ui, communion.user u
WHERE ui.uid = u.uid AND u.userId = 'FL-54833';
