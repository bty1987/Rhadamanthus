-- =============================================================================
-- 服务团队页面更名(crowd → serviceTeam) —— 菜单行同步
-- 日期: 2026-09-21
--
-- 页面文件已更名(前端发版同批):
--   /views/customer/crowd.html      → /views/customer/serviceTeam.html     (微信群绑定列表页)
--   /views/customer/crowd4user.html → /views/customer/serviceTeam4user.html(服务团队成员弹窗)
--
-- 本 SQL 同步菜单 mid=328:
--   url  : crowd.html → serviceTeam.html
--   name : '群' → '服务团队'(显示名, 业务可自行调整此 UPDATE 的值)
--
-- 注意:
--   1. UPDATE 天然幂等, 可重复执行。
--   2. 🔴 与前端发版同批执行: 只改菜单不改前端=点击 404; 只发前端不改菜单=菜单仍指旧 URL 404。
--   3. 后端零改动: 页面调用的 pageGroup/bindGroup/unbindGroup/updateGroup.do(GroupPO/
--      customer.group 表/GroupService)全部不动, 外部 robot 契约零风险。
--   4. 页面配置键已同步更名 getConfig('serviceTeam'/'serviceTeam4user'),
--      生产 customer.customerfunction 无 crowd 相关配置行(2026-09-21 实测), 无数据迁移。
-- =============================================================================

UPDATE `communion`.`module`
   SET `url`  = '/views/customer/serviceTeam.html',
       `name` = '服务团队'
 WHERE `mid` = 328;

-- 核验(应 1 行, url/name 为新值)
-- SELECT mid, fatherModuleId, name, url FROM communion.module WHERE mid = 328;
