-- =====================================================================
-- 四个 profile 导出任务注册 + 角色授权(生产执行)
-- 日期: 2026-09-02
--
-- 内容:
--   1. communion.task 注册 5 个页面导出任务(口径对齐存量 tid 250~274;
--      工程标签双时间口径拆两条, filepath带尾参, 同tid265/269先例)
--   2. communion.roletask 授权给 rid=427(方林总部预算经理,
--      刘鑫鑫 FL-09546 的当前角色, uid=12363), company=1(刘鑫鑫登录公司)
--
-- 前置条件(先部署脚本再执行本SQL):
--   四个脚本须先部署到生产服务器 /home/fanglin/cronbin/py3/
--   (与仓库 scripts/ 目录文件同名一一对应):
--     plan_export_quotation_quotation_profile.py        导出报价单标签
--     plan_export_quotation_addreduce_profile.py        导出增减单标签
--     plan_export_construction_construction_profile.py  导出工程标签
--     plan_export_construction_drawline_profile.py      导出放线标签
--
-- 字段口径(对齐存量导出任务):
--   plugins='A'  导出弹窗展示"时间区间"选择器, 脚本按 args 区间过滤
--   level=0  type=2(py3脚本)  handle=0(只读)  server=0
--   week/day/hour 不填(页面手动触发, 非定时)
--   status=0(启用)  isShow=0
--
-- 幂等: task 按 keyword 唯一防重, roletask 按(rid,tid,company)防重,
--   可重复执行
-- =====================================================================

-- ---------- 1. 注册任务 ----------

-- 导出报价单标签(quotation.quotationprofile type=4)
INSERT INTO communion.task (name, filepath, plugins, level, type, handle, server, status, isShow, keyword)
SELECT '导出报价单标签', '/home/fanglin/cronbin/py3/plan_export_quotation_quotation_profile.py', 'A', 0, 2, 0, 0, 0, 0, 'export_quotation_quotation_profile' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.task WHERE keyword = 'export_quotation_quotation_profile');

-- 导出增减单标签(quotation.quotationprofile type=5, qid 指向增减项)
INSERT INTO communion.task (name, filepath, plugins, level, type, handle, server, status, isShow, keyword)
SELECT '导出增减单标签', '/home/fanglin/cronbin/py3/plan_export_quotation_addreduce_profile.py', 'A', 0, 2, 0, 0, 0, 0, 'export_quotation_addreduce_profile' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.task WHERE keyword = 'export_quotation_addreduce_profile');

-- 导出工程标签-创建时间(construction.constructionprofile, type=0按cp.createTime过滤)
-- 🔴 filepath 尾参机制: 脚本main签名(type,pid,args,company), 执行器按`python3 <filepath> <pid> <args> <company>`拼接,
--    固定首参写在filepath末尾(同tid265/269 plan_export_construction_info_pro.py 0/1先例)
INSERT INTO communion.task (name, filepath, plugins, level, type, handle, server, status, isShow, keyword)
SELECT '导出工程标签(创建时间)', '/home/fanglin/cronbin/py3/plan_export_construction_construction_profile.py 0', 'A', 0, 2, 0, 0, 0, 0, 'export_construction_construction_profile_createTime' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.task WHERE keyword = 'export_construction_construction_profile_createTime');

-- 导出工程标签-交接时间(type=1按constructioninfo.handoverTime过滤)
INSERT INTO communion.task (name, filepath, plugins, level, type, handle, server, status, isShow, keyword)
SELECT '导出工程标签(交接时间)', '/home/fanglin/cronbin/py3/plan_export_construction_construction_profile.py 1', 'A', 0, 2, 0, 0, 0, 0, 'export_construction_construction_profile_handoverTime' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.task WHERE keyword = 'export_construction_construction_profile_handoverTime');

-- 导出放线标签(construction.drawlineprofile)
INSERT INTO communion.task (name, filepath, plugins, level, type, handle, server, status, isShow, keyword)
SELECT '导出放线标签', '/home/fanglin/cronbin/py3/plan_export_construction_drawline_profile.py', 'A', 0, 2, 0, 0, 0, 0, 'export_construction_drawline_profile' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.task WHERE keyword = 'export_construction_drawline_profile');

-- ---------- 2. 授权给角色427(方林总部预算经理/刘鑫鑫) ----------
-- cuid=12363(刘鑫鑫 uid), 仅作分配操作人记录
-- 注: 仅插 company=1(刘鑫鑫登录公司可见);
--     若后续需要像历史 sync 那样覆盖其他公司, 复制行改 company 即可

INSERT INTO communion.roletask (rid, tid, cuid, createTime, company)
SELECT 427, t.tid, 12363, NOW(), 1 FROM communion.task t
WHERE t.keyword = 'export_quotation_quotation_profile'
  AND NOT EXISTS (SELECT 1 FROM communion.roletask rt WHERE rt.rid = 427 AND rt.tid = t.tid AND rt.company = 1);

INSERT INTO communion.roletask (rid, tid, cuid, createTime, company)
SELECT 427, t.tid, 12363, NOW(), 1 FROM communion.task t
WHERE t.keyword = 'export_quotation_addreduce_profile'
  AND NOT EXISTS (SELECT 1 FROM communion.roletask rt WHERE rt.rid = 427 AND rt.tid = t.tid AND rt.company = 1);

INSERT INTO communion.roletask (rid, tid, cuid, createTime, company)
SELECT 427, t.tid, 12363, NOW(), 1 FROM communion.task t
WHERE t.keyword = 'export_construction_construction_profile_createTime'
  AND NOT EXISTS (SELECT 1 FROM communion.roletask rt WHERE rt.rid = 427 AND rt.tid = t.tid AND rt.company = 1);

INSERT INTO communion.roletask (rid, tid, cuid, createTime, company)
SELECT 427, t.tid, 12363, NOW(), 1 FROM communion.task t
WHERE t.keyword = 'export_construction_construction_profile_handoverTime'
  AND NOT EXISTS (SELECT 1 FROM communion.roletask rt WHERE rt.rid = 427 AND rt.tid = t.tid AND rt.company = 1);

INSERT INTO communion.roletask (rid, tid, cuid, createTime, company)
SELECT 427, t.tid, 12363, NOW(), 1 FROM communion.task t
WHERE t.keyword = 'export_construction_drawline_profile'
  AND NOT EXISTS (SELECT 1 FROM communion.roletask rt WHERE rt.rid = 427 AND rt.tid = t.tid AND rt.company = 1);

-- ---------- 3. 执行后核验(应返回4行, rid均有值) ----------
SELECT t.tid, t.name, t.keyword, rt.rid, rt.company
FROM communion.task t
LEFT JOIN communion.roletask rt ON rt.tid = t.tid AND rt.rid = 427 AND rt.company = 1
WHERE t.keyword IN ('export_quotation_quotation_profile', 'export_quotation_addreduce_profile', 'export_construction_construction_profile_createTime', 'export_construction_construction_profile_handoverTime', 'export_construction_drawline_profile')
ORDER BY t.tid;
