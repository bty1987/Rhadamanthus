-- =============================================================================
-- 企业大学邮箱问题(二) 重复邮箱处置: 非@fanglin.vip 重复邮箱直接置空
-- 日期: 2026-10-08
-- 背景: 企业大学要求邮箱唯一, communion.userinfo.email 大量占位/垃圾值多账号共用,
--       全库(生产只读副本实证)重复邮箱 116 组: 非@fanglin.vip 90 组 402 账号,
--       @fanglin.vip 26 组 53 账号(工牌邮箱,保留走人工改名,本脚本不动)。
--       402 账号构成: 占位垃圾(0@qq.com x18 / 1@qq.com x9 / hanfang@m.com x41 /
--       704790@126.com x46 / fanglin@qq.com x24 / fanglin@fanglin.com x43 等)+
--       厂商/供应商账号(OC-*, 武汉斯米克瓷砖, 箭牌卫浴, memberserver 等)混用个人邮箱。
-- 安全性: ERP 内 userinfo.email 无功能调用方(全库无邮件发送代码, getEmail 仅
--         updateUserForBaseInfo 写路径+页面展示), 唯一消费方=钉钉/企业大学同步;
--         误清真人邮箱代价=重新收集, 置空即消除企业大学侧重复告警。
-- 置空值: ''(列可空,存量空值 NULL/'' 混存,' '与"为空"语义一致且可比对)
-- 🔴 上线序: 无 jar 依赖,可独立执行;建议先于/同批于邮箱查重新增代码(避免查重上线
--            后存量重复账号编辑资料被历史数据卡住)
-- 幂等性: 重复执行=重复组已消失,UPDATE 命中 0 行;备份表 INSERT 幂等
-- 回滚: 从 bak 表按 uiid 回写 email(备份表保留,勿 DROP)
-- =============================================================================

-- ---------- 1. 临时表: 当前重复且非 @fanglin.vip 的邮箱(执行时点实时计算) ----------
DROP TABLE IF EXISTS communion.tmp_userinfo_email_dup_nonvip;
CREATE TABLE communion.tmp_userinfo_email_dup_nonvip AS
SELECT LOWER(ui.email) AS em, COUNT(*) AS c
FROM communion.userinfo ui
WHERE ui.email IS NOT NULL AND ui.email != ''
GROUP BY LOWER(ui.email)
HAVING COUNT(*) > 1;

DELETE FROM communion.tmp_userinfo_email_dup_nonvip WHERE em LIKE '%@fanglin.vip';

-- 2a. 预检: 待清空行数(2026-10-08 实证 402;组数波动属正常,偏差大则停下核对)
SELECT COUNT(*) AS will_clear_rows,
       COUNT(DISTINCT t.em) AS will_clear_groups
FROM communion.userinfo ui
JOIN communion.tmp_userinfo_email_dup_nonvip t ON LOWER(ui.email) = t.em
WHERE ui.email IS NOT NULL AND ui.email != '';

-- 2b. 覆盖前核对: 逐组明细(工号/姓名/邮箱/组内账号数), 抽查确认无整组误判
SELECT u.userId, u.userName, LOWER(ui.email) AS em, t.c
FROM communion.userinfo ui
JOIN communion.tmp_userinfo_email_dup_nonvip t ON LOWER(ui.email) = t.em
JOIN communion.user u ON u.uid = ui.uid
WHERE ui.email IS NOT NULL AND ui.email != ''
ORDER BY t.c DESC, em
LIMIT 500;

-- ---------- 2. 备份(仅备份将被清空的行;保留勿DROP,回滚唯一依据) ----------
CREATE TABLE IF NOT EXISTS communion.tmp_userinfo_email_dup_clear_bak (
  uiid INT PRIMARY KEY,
  userId VARCHAR(15),
  userName VARCHAR(32),
  email VARCHAR(50),
  bakTime DATETIME
);
INSERT INTO communion.tmp_userinfo_email_dup_clear_bak (uiid, userId, userName, email, bakTime)
SELECT ui.uiid, u.userId, u.userName, ui.email, NOW()
FROM communion.userinfo ui
JOIN communion.tmp_userinfo_email_dup_nonvip t ON LOWER(ui.email) = t.em
JOIN communion.user u ON u.uid = ui.uid
WHERE ui.email IS NOT NULL AND ui.email != '';

-- ---------- 3. 置空 ----------
UPDATE communion.userinfo ui
JOIN communion.tmp_userinfo_email_dup_nonvip t ON LOWER(ui.email) = t.em
SET ui.email = ''
WHERE ui.email IS NOT NULL AND ui.email != '';
SELECT ROW_COUNT() AS cleared_rows; -- 预期 = 2a 的 will_clear_rows

-- ---------- 4. 核验: 非@fanglin.vip 重复组应归零 ----------
SELECT COUNT(*) AS remain_nonvip_dup_groups
FROM (
  SELECT LOWER(ui.email) AS em, COUNT(*) AS c
  FROM communion.userinfo ui
  WHERE ui.email IS NOT NULL AND ui.email != ''
  GROUP BY LOWER(ui.email)
  HAVING c > 1
) x
WHERE x.em NOT LIKE '%@fanglin.vip'; -- 预期 0

-- ---------- 5. 清理(备份表保留) ----------
DROP TABLE IF EXISTS communion.tmp_userinfo_email_dup_nonvip;
