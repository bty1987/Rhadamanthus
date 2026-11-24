-- ============================================================================
-- 文件: 39_userrole_usercompany_cleanup.sql
-- 库表: communion.userrole / communion.usercompany
-- 用途: 权限治理三清(2026-11-24 用户拍板"游客角色/多公司权限/多角色权限 全部删除"):
--       段一 游客附加角色全清: userrole rid=82 共 31,850 行
--         · 29,176 行=纯冗余(主角色已是游客还挂附加游客, 删后零损失)
--         ·  2,674 行=正式主角色+游客蔓延(删后失去游客权限叠加, 主角色权限保留)
--       段二 多公司关联收敛: usercompany 每用户仅保留最早一行(ucid 最小),
--         多公司用户 1,986 人(关联 TOP=1人100家含cid=0), 预计删 ~15,500 行
--       段三 多角色收敛: 段一清理后 userrole 每用户仅保留最早一行附加角色(urid 最小),
--         多角色用户 419 人(TOP=1人挂12岗), 预计删数百行
-- 🔴 分段独立可单独执行; 执行顺序必须 段一 → 段三(段三按"段一清理后"的剩余行定保留行,
--    若颠倒会把游客行当最早行保留而误删业务角色行); 段二独立任意时点
-- 🔴 游客 roleoperation(rid=82, 32,271 行)与本脚本无关、不可删除:
--    主角色=游客(user.roleId=82)的用户有 43,184 人, 游客 roleoperation 是其登录基础权限
--    (首屏菜单/通知/人员信息/通用查询, 845接口)——全删=全公司功能瘫痪;
--    段一删的仅是"附加游客行", 主角色=游客的人权限不受影响
-- 🔴 影响面明示:
--    · 段一 2,674 名"正式角色+游客蔓延"用户: 删后失去游客权限叠加(首屏基础接口若正式角色
--      未被影子收集覆盖则可能 -2, 备份表可即时回滚单户)
--    · 段二 1,986 名多公司用户: 跨公司候选(客源/报价指派)/切换公司对被删公司失效
--    · 段三 419 名多角色用户: 仅保留最早授予的附加角色, 业务身份不符时用备份表人工修正
-- 执行前置条件(生产干跑 2026-11-24):
--       userrole=43,964行(游客附加31,850/主材厂商4,480/工人1,445/驻店导购1,375/设计师通用1,085...),
--       多角色用户419; usercompany=17,776行/2,229用户, 多公司1,986人
-- 回滚方式: 依三张备份表按主键(urid/ucid)回插
-- 幂等性: 段一 rid=82 值级守卫重跑零效果; 段二/段三收敛型重跑零效果
-- ============================================================================

-- ============ 段零、备份(三张, 先核对行数) ============

CREATE TABLE IF NOT EXISTS communion.bak_userrole_guest_20261124 AS
SELECT * FROM communion.userrole WHERE rid = 82;
SELECT COUNT(*) AS bakGuest_expect31850 FROM communion.bak_userrole_guest_20261124;

CREATE TABLE IF NOT EXISTS communion.bak_usercompany_multi_20261124 AS
SELECT uc.* FROM communion.usercompany uc
JOIN (SELECT uid, MIN(ucid) AS keepUcid FROM communion.usercompany GROUP BY uid) k
  ON k.uid = uc.uid AND k.ucid <> uc.ucid;
SELECT COUNT(*) AS bakCompanyMulti_expect15547 FROM communion.bak_usercompany_multi_20261124;

CREATE TABLE IF NOT EXISTS communion.bak_userrole_multi_20261124 AS
SELECT ur.* FROM communion.userrole ur
JOIN (SELECT uid, MIN(urid) AS keepUrid FROM communion.userrole GROUP BY uid) k
  ON k.uid = ur.uid AND k.urid <> ur.urid;
SELECT COUNT(*) AS bakRoleMulti FROM communion.bak_userrole_multi_20261124;
-- 🔴 段三备份必须在【段一执行之后】创建, 行数=段一清理后仍多角色的行

-- ============ 段一、游客附加角色全清(影响行数必须=31850) ============

DELETE FROM communion.userrole WHERE rid = 82;

-- ============ 段二、多公司关联收敛: 每用户保留最早一行(影响行数=备份行数) ============

DELETE uc FROM communion.usercompany uc
JOIN (SELECT uid, MIN(ucid) AS keepUcid FROM communion.usercompany GROUP BY uid) k
  ON k.uid = uc.uid AND k.ucid <> uc.ucid;

-- ============ 段三、多角色收敛(🔴段一之后执行): 每用户保留最早一行附加角色 ============

DELETE ur FROM communion.userrole ur
JOIN (SELECT uid, MIN(urid) AS keepUrid FROM communion.userrole GROUP BY uid) k
  ON k.uid = ur.uid AND k.urid <> ur.urid;

-- ============ 验证段 ============

-- 1. 游客附加清零
SELECT COUNT(*) AS guestLeft_expect0 FROM communion.userrole WHERE rid = 82;

-- 2. 多角色/多公司清零(期望各=0)
SELECT COUNT(*) AS multiRoleLeft_expect0 FROM (SELECT uid FROM communion.userrole GROUP BY uid HAVING COUNT(*) > 1) t;
SELECT COUNT(*) AS multiCompanyLeft_expect0 FROM (SELECT uid FROM communion.usercompany GROUP BY uid HAVING COUNT(*) > 1) t;

-- 3. 余量核对: userrole 期望≈12,114(userrole残留)-多角色删除数; usercompany 期望=2,229(每用户1行)
SELECT COUNT(*) AS userroleLeft, COUNT(DISTINCT uid) AS userroleUsers FROM communion.userrole;
SELECT COUNT(*) AS usercompanyLeft, COUNT(DISTINCT uid) AS usercompanyUsers FROM communion.usercompany;

-- ============ 回滚模板(按需单户/全量) ============
-- INSERT INTO communion.userrole (uid, rid, cuid, createTime)
-- SELECT uid, rid, cuid, createTime FROM communion.bak_userrole_guest_20261124 WHERE [uid=?];
-- INSERT INTO communion.userrole SELECT * FROM communion.bak_userrole_multi_20261124 WHERE [uid=?];
-- INSERT INTO communion.usercompany SELECT * FROM communion.bak_usercompany_multi_20261124 WHERE [uid=?];
