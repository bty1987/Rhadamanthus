-- ============================================================================
-- 文件: 39_userrole_usercompany_cleanup.sql
-- 库表: communion.userrole / communion.usercompany
-- 用途: 权限治理三清(2026-11-24 用户拍板"游客角色/多公司权限/多角色权限 全部删除"):
--       段一 游客附加角色全清: userrole rid=82 共 31,850 行
--         · 29,176 行=纯冗余(主角色已是游客还挂附加游客, 删后零损失)
--         ·  2,674 行=正式主角色+游客蔓延(删后失去游客权限叠加, 主角色权限保留)
--       段二 多公司关联收敛(分角色双口径):
--         2a 主角色=游客的沉睡账号: usercompany 关联全删(821人/4,005行, 游客账号不应有多公司挂靠)
--         2b 正式角色用户: 每用户仅保留最早一行(ucid 最小, 1,407人/13,771行, 删多余12,364行)
--         合计预计删 ~16,369 行
--       段三 多角色收敛: 每用户仅保留最早一行**非游客**附加角色(rid=82 显式排除于
--         保留行选择与删除范围, 段首再清一遍游客行幂等双保险)——四段全部显式含 82/82排除,
--         不依赖任何前置段执行状态, 任意单段/任意顺序执行结果一致
--       段三 多角色收敛: 每用户仅保留最早一行**非游客**附加角色(rid=82 显式排除于保留行
--         选择与删除范围), 多角色用户 419 人(TOP=1人挂12岗), 预计删数百行
-- 🔴 分段独立可单独执行, 顺序无关: 四段均显式含 82(游客清理)或 82排除(非游客范围),
--    任意单段/任意顺序执行, 结果一致; 段一首句与段三 3a 为同句幂等重复(双保险)
-- 🔴 游客 roleoperation(rid=82, 32,271 行)与本脚本无关、不可删除:
--    主角色=游客(user.roleId=82)的用户有 43,184 人, 游客 roleoperation 是其登录基础权限
--    (首屏菜单/通知/人员信息/通用查询, 845接口)——全删=全公司功能瘫痪;
--    段一删的仅是"附加游客行", 主角色=游客的人权限不受影响
-- 🔴 影响面明示:
--    · 段一 2,674 名"正式角色+游客蔓延"用户: 删后失去游客权限叠加(首屏基础接口若正式角色
--      未被影子收集覆盖则可能 -2, 备份表可即时回滚单户)
--    · 段二a 821 名主游客沉睡账号: 多公司关联全失(沉睡账号本不应有挂靠); 段二b 1,407 名正式
--      多公司用户: 跨公司候选(客源/报价指派)/切换公司对被删公司失效
--    · 段三 419 名多角色用户: 仅保留最早授予的附加角色, 业务身份不符时用备份表人工修正
-- 执行前置条件(生产干跑 2026-11-24):
--       userrole=43,964行(游客附加31,850/主材厂商4,480/工人1,445/驻店导购1,375/设计师通用1,085...),
--       多角色用户419; usercompany=17,776行/2,229用户(主游客821人4,005行+正式1,407人13,771行), 多公司1,986人
-- 回滚方式: 依三张备份表按主键(urid/ucid)回插
-- 幂等性: 段一 rid=82 值级守卫重跑零效果; 段二a 主角色条件守卫/段二b段三收敛型重跑零效果
-- ============================================================================

-- ============ 段零、备份(三张, 先核对行数) ============

CREATE TABLE IF NOT EXISTS communion.bak_userrole_guest_20261124 AS
SELECT * FROM communion.userrole WHERE rid = 82;
SELECT COUNT(*) AS bakGuest_expect31850 FROM communion.bak_userrole_guest_20261124;

CREATE TABLE IF NOT EXISTS communion.bak_usercompany_del_20261124 AS
SELECT uc.* FROM communion.usercompany uc
LEFT JOIN communion.user u ON u.uid = uc.uid
JOIN (SELECT uid, MIN(ucid) AS keepUcid FROM communion.usercompany GROUP BY uid) k
  ON k.uid = uc.uid
WHERE u.roleId = 82 OR (u.roleId <> 82 AND k.keepUcid <> uc.ucid);
SELECT COUNT(*) AS bakCompany_expect16369 FROM communion.bak_usercompany_del_20261124;
-- 期望构成: 主游客沉睡账号全删4,005行 + 正式角色多余行12,364行

CREATE TABLE IF NOT EXISTS communion.bak_userrole_multi_20261124 AS
SELECT ur.* FROM communion.userrole ur
JOIN (SELECT uid, MIN(urid) AS keepUrid FROM communion.userrole WHERE rid <> 82 GROUP BY uid) k
  ON k.uid = ur.uid AND k.keepUrid <> ur.urid
WHERE ur.rid <> 82;
SELECT COUNT(*) AS bakRoleMulti_expect419users FROM communion.bak_userrole_multi_20261124;
-- 保留行选择(GROUP BY)与删除范围均已显式排除游客(rid=82), 不依赖段一执行状态

-- ============ 段一、游客附加角色全清(影响行数必须=31850) ============

DELETE FROM communion.userrole WHERE rid = 82;

-- ============ 段二a、主游客沉睡账号多公司关联全删(影响行数必须=4005) ============

DELETE uc FROM communion.usercompany uc
JOIN communion.user u ON u.uid = uc.uid
WHERE u.roleId = 82;

-- ============ 段二b、正式角色用户多公司收敛: 每用户保留最早一行(影响行数必须=12364) ============

DELETE uc FROM communion.usercompany uc
JOIN (SELECT uid, MIN(ucid) AS keepUcid FROM communion.usercompany GROUP BY uid) k
  ON k.uid = uc.uid AND k.keepUcid <> uc.ucid
JOIN communion.user u ON u.uid = uc.uid
WHERE u.roleId <> 82;

-- ============ 段三、多角色收敛: 非游客行每用户保留最早一行(段顺序无关) ============

-- 3a. 游客附加再清(与段一同句幂等: 段一已删则0行——双保险, 保证本段收敛对象不含游客)
DELETE FROM communion.userrole WHERE rid = 82;

-- 3b. 非游客多余附加收敛: 保留行选择与删除范围均显式排除游客(rid <> 82)
DELETE ur FROM communion.userrole ur
JOIN (SELECT uid, MIN(urid) AS keepUrid FROM communion.userrole WHERE rid <> 82 GROUP BY uid) k
  ON k.uid = ur.uid AND k.keepUrid <> ur.urid
WHERE ur.rid <> 82;

-- ============ 验证段 ============

-- 1. 游客附加清零
SELECT COUNT(*) AS guestLeft_expect0 FROM communion.userrole WHERE rid = 82;

-- 2. 多角色/多公司清零(期望各=0)
SELECT COUNT(*) AS multiRoleLeft_expect0 FROM (SELECT uid FROM communion.userrole GROUP BY uid HAVING COUNT(*) > 1) t;
SELECT COUNT(*) AS multiCompanyLeft_expect0 FROM (SELECT uid FROM communion.usercompany GROUP BY uid HAVING COUNT(*) > 1) t;

-- 3. 主游客沉睡账号多公司关联清零(期望=0)
SELECT COUNT(*) AS guestCompanyLeft_expect0 FROM communion.usercompany uc
JOIN communion.user u ON u.uid = uc.uid WHERE u.roleId = 82;

-- 4. 余量核对: userrole 期望≈12,114-段三删除数; usercompany 期望=1,408(正式1,407+可能的cid=0独立行)
SELECT COUNT(*) AS userroleLeft, COUNT(DISTINCT uid) AS userroleUsers FROM communion.userrole;
SELECT COUNT(*) AS usercompanyLeft, COUNT(DISTINCT uid) AS usercompanyUsers FROM communion.usercompany;

-- ============ 回滚模板(按需单户/全量) ============
-- INSERT INTO communion.userrole (uid, rid, cuid, createTime)
-- SELECT uid, rid, cuid, createTime FROM communion.bak_userrole_guest_20261124 WHERE [uid=?];
-- INSERT INTO communion.userrole SELECT * FROM communion.bak_userrole_multi_20261124 WHERE [uid=?];
-- INSERT INTO communion.usercompany SELECT * FROM communion.bak_usercompany_del_20261124 WHERE [uid=?];
