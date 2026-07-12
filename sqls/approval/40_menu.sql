-- ============================================================
-- 审批流程引擎 - 菜单注册
-- 在 communion.module 表注册 3 个页面入口,挂到"审批"(mid=2)一级菜单下
--
-- 现有审批子菜单(mid=2 下)order 已用到 9,新菜单从 10 开始
-- mid 从 910 开始(生产库当前 MAX(mid)=909,若已有更高值请调整)
--
-- ⚠️ 部署前请确认:
--   1. communion.module 表的 MAX(mid) 是否 < 910(若已被占用,需调整 mid 值)
--   2. 通过角色管理(system/role)给目标角色分配这些菜单(module 通过 roleId 关联,
--      具体见 RoleAction / roleModule 表,管理员在后台"角色管理"页勾选即可)
-- ============================================================

-- 1. 流程定义管理(mid=910, order=10)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (910, 2, '审批-流程定义', 'approvalFlow', 'approval', 'icon-reorder',
   '/views/approval/approvalFlow.html', 2, 1, 10, NULL);

-- 2. 表单定义管理(mid=911, order=11)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (911, 2, '审批-表单定义', 'approvalForm', 'approval', 'icon-list',
   '/views/approval/approvalForm.html', 2, 1, 11, NULL);

-- 3. 任务审批(mid=912, order=12)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (912, 2, '审批-任务待办', 'approvalTask', 'approval', 'icon-check',
   '/views/approval/approvalTask.html', 2, 1, 12, NULL);

-- ============================================================
-- 验证查询(部署后执行确认)
-- ============================================================
-- SELECT mid, fatherModuleId, name, url, level, `order`
-- FROM communion.module
-- WHERE fatherModuleId = 2
-- ORDER BY `order`;
--
-- 预期结果:原 9 条 + 新增 3 条 = 12 条,新菜单 order 为 10/11/12

-- ============================================================
-- 角色授权说明(不在本脚本执行,由管理员在后台操作)
-- ============================================================
-- 菜单注册后默认对所有角色不可见,需在"系统管理 > 角色管理"页:
--   1. 选择目标角色
--   2. 在"模块权限"树勾选新增的"审批-流程定义/表单定义/任务待办"
--   3. 保存后该角色用户重新登录即可看到菜单
--
-- 或通过 SQL 直接授权(communion.rolemodule 表,rid=角色ID):
--   先查目标角色ID: SELECT rid, name FROM communion.role WHERE name LIKE '%管理员%';
--   再授权(替换 {rid}):
--     INSERT INTO communion.rolemodule (rmid, rid, mid, link, access, cuid, createTime, company)
--     VALUES (NULL, {rid}, 910, 1, 1, {操作人uid}, NOW(), {company});
--   (rmid 为自增主键填 NULL;link=1 表示关联;access=1 表示可访问)
