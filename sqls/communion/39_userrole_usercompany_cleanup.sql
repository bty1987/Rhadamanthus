-- ============================================================================
-- 文件: 39_userrole_usercompany_cleanup.sql
-- 库表: communion.userrole / communion.usercompany
-- 用途: 主角色=游客(user.roleId=82)的用户权限清理(2026-11-24 用户拍板, 口径二次校准):
--       "游客角色用户不要有 userrole 多角色数据以及 usercompany 的多公司数据"
--       段一 游客附加角色全局清除: userrole rid=82 共 31,850 行
--         (29,176 行=主游客冗余挂载 + 2,674 行=正式角色用户蔓延挂载)
--       段二 主游客用户的非游客附加角色全清: 387 行
--         (设计师通用119/业务员103/市场经理12/武汉设计师11/设计经理11/驻店导购8/设计师7/
--          工程监理7/合约专员6/主材管家6 等——主游客=沉睡账号, 不应持有任何业务附加角色)
--       段三 主游客用户的 usercompany 多公司关联全删: 821 人 / 4,005 行(人均~4.9 关联)
--       段一 + 段二 合计 = 主游客用户(43,184 人)的 userrole 完全清空(附加角色归零)
-- 🔴 游客 roleoperation(rid=82, 32,271 行)与本脚本无关、不可删除:
--    主角色=游客的用户有 43,184 人, 游客 roleoperation 是其登录基础权限
--    (首屏菜单/通知/人员信息/通用查询, 845接口)——全删=全公司功能瘫痪;
--    role 表 rid=82 行同理不可删(主角色外键引用)
-- 🔴 影响面明示:
--    · 段一 2,674 名"正式角色+游客蔓延"用户: 删后失去游客权限叠加(备份表可即时回滚单户)
--    · 段二 387 行附加角色删除: 对应用户失去业务附加身份权限(主游客沉睡账号, 本不应持有)
--    · 段三 821 名主游客用户: 多公司关联全失(沉睡账号本不应有挂靠)
--    · 正式角色用户(roleId<>82)的 userrole/usercompany 本脚本不触碰
-- 执行前置条件(生产干跑 2026-11-24):
--       userrole=43,964行(游客附加31,850/主材厂商4,480/工人1,445/驻店导购1,375/设计师通用1,085...);
--       主游客用户43,184人, 其非游客附加387行; usercompany主游客821人4,005行
-- 回滚方式: 依三张备份表按主键(urid/ucid)回插
-- 幂等性: 段一 rid=82 值级守卫 / 段二段三主角色条件守卫, 重复执行零效果; 段顺序无关
-- ============================================================================

-- ============ 段零、备份(三张, 先核对行数) ============

CREATE TABLE IF NOT EXISTS communion.bak_userrole_guest_20261124 AS
SELECT * FROM communion.userrole WHERE rid = 82;
SELECT COUNT(*) AS bakGuest_expect31850 FROM communion.bak_userrole_guest_20261124;

CREATE TABLE IF NOT EXISTS communion.bak_userrole_guestmain_non82_20261124 AS
SELECT ur.* FROM communion.userrole ur
JOIN communion.user u ON u.uid = ur.uid
WHERE u.roleId = 82 AND ur.rid <> 82;
SELECT COUNT(*) AS bakGuestMainNon82_expect387 FROM communion.bak_userrole_guestmain_non82_20261124;

CREATE TABLE IF NOT EXISTS communion.bak_usercompany_guestmain_20261124 AS
SELECT uc.* FROM communion.usercompany uc
JOIN communion.user u ON u.uid = uc.uid
WHERE u.roleId = 82;
SELECT COUNT(*) AS bakGuestMainCompany_expect4005 FROM communion.bak_usercompany_guestmain_20261124;

-- ============ 段一、游客附加角色全局清除(影响行数必须=31850) ============

DELETE FROM communion.userrole WHERE rid = 82;

-- ============ 段二、主游客用户的非游客附加角色全清(影响行数必须=387) ============

DELETE ur FROM communion.userrole ur
JOIN communion.user u ON u.uid = ur.uid
WHERE u.roleId = 82 AND ur.rid <> 82;

-- ============ 段三、主游客用户的 usercompany 关联全删(影响行数必须=4005) ============

DELETE uc FROM communion.usercompany uc
JOIN communion.user u ON u.uid = uc.uid
WHERE u.roleId = 82;

-- ============ 验证段 ============

-- 1. 游客附加清零
SELECT COUNT(*) AS guestAttachLeft_expect0 FROM communion.userrole WHERE rid = 82;

-- 2. 主游客用户附加角色清零(期望=0, 含非82)
SELECT COUNT(*) AS guestMainRoleRows_expect0 FROM communion.userrole ur
JOIN communion.user u ON u.uid = ur.uid WHERE u.roleId = 82;

-- 3. 主游客用户 usercompany 清零(期望=0)
SELECT COUNT(*) AS guestMainCompanyLeft_expect0 FROM communion.usercompany uc
JOIN communion.user u ON u.uid = uc.uid WHERE u.roleId = 82;

-- 4. 正式角色用户数据未触碰核对(应保持执行前量: 正式附加角色行/正式usercompany行)
SELECT COUNT(*) AS formalUserroleRows FROM communion.userrole ur
JOIN communion.user u ON u.uid = ur.uid WHERE u.roleId <> 82;
SELECT COUNT(*) AS formalUsercompanyRows FROM communion.usercompany uc
JOIN communion.user u ON u.uid = uc.uid WHERE u.roleId <> 82;

-- ============ 回滚模板(按需单户/全量) ============
-- INSERT INTO communion.userrole (uid, rid, cuid, createTime)
-- SELECT uid, rid, cuid, createTime FROM communion.bak_userrole_guest_20261124 WHERE [uid=?];
-- INSERT INTO communion.userrole SELECT * FROM communion.bak_userrole_guestmain_non82_20261124 WHERE [uid=?];
-- INSERT INTO communion.usercompany SELECT * FROM communion.bak_usercompany_guestmain_20261124 WHERE [uid=?];
