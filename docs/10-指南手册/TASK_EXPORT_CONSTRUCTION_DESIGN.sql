-- =====================================================================
-- 设计信息导出任务注册(生产执行)
-- 日期: 2026-09-18
--
-- 内容:
--   communion.task 注册 1 个页面导出任务(口径对齐存量导出任务与
--   TASK_PROFILE_EXPORT.sql 先例)
--
-- 前置条件(先部署脚本再执行本SQL):
--   脚本须先部署到生产服务器 /home/fanglin/cronbin/py3/
--   (与仓库 scripts/ 目录文件同名一一对应):
--     plan_export_construction_design.py    导出设计信息
--
-- 字段口径:
--   条件 = 公司 + 初始设计完成时间(constructioninfo.initDesignTime)区间
--   plugins='A'  导出弹窗展示"时间区间"选择器, 脚本按 args 区间过滤
--   level=0  type=2(py3脚本)  handle=0(只读)  server=0
--   week/day/hour 不填(页面手动触发, 非定时)
--   status=0(启用)  isShow=0
--   设计费列暂留空(数据源待定后补)
--
-- 幂等: task 按 keyword 唯一防重, 可重复执行
-- =====================================================================

-- ---------- 1. 注册任务 ----------

-- 导出设计信息(公司+初始设计完成时间区间)
INSERT INTO communion.task (name, filepath, plugins, level, type, handle, server, status, isShow, keyword)
SELECT '导出设计信息', '/home/fanglin/cronbin/py3/plan_export_construction_design.py', 'A', 0, 2, 0, 0, 0, 0, 'export_construction_design' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.task WHERE keyword = 'export_construction_design');

-- ---------- 2. 角色授权: 石晶(FL-29466, uid=33587, 方林集团company=0) ----------
-- 石晶持有4角色, 仅授权两个独占角色(生产实查各1人持有):
--   rid=380 集团客服总监 / rid=370 方林外省客户主管
-- 共享角色(302方林微管专员21人/368方林总部微管专员15人)不授权, 避免任务外泄给同角色人群
-- cuid=33587 仅作分配操作人记录

INSERT INTO communion.roletask (rid, tid, cuid, createTime, company)
SELECT 380, t.tid, 33587, NOW(), 0 FROM communion.task t
WHERE t.keyword = 'export_construction_design'
  AND NOT EXISTS (SELECT 1 FROM communion.roletask rt WHERE rt.rid = 380 AND rt.tid = t.tid AND rt.company = 0);

INSERT INTO communion.roletask (rid, tid, cuid, createTime, company)
SELECT 370, t.tid, 33587, NOW(), 0 FROM communion.task t
WHERE t.keyword = 'export_construction_design'
  AND NOT EXISTS (SELECT 1 FROM communion.roletask rt WHERE rt.rid = 370 AND rt.tid = t.tid AND rt.company = 0);

-- ---------- 3. 执行后核验(应返回1行task, roletask 2行rid=380/370) ----------
SELECT t.tid, t.name, t.keyword, rt.rid, rt.company
FROM communion.task t
LEFT JOIN communion.roletask rt ON rt.tid = t.tid AND rt.rid IN (380, 370)
WHERE t.keyword = 'export_construction_design';
