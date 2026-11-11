-- ============================================================================
-- 文件: 37_roleoperation_oid26_shrink.sql
-- 库表: communion.roleoperation
-- 用途: receiveDecorationActivityItem(oid=26 装修活动物品领取, through=0 强权限)授权收窄——
--       现状 91 角色/11 公司/4934 行, 授权面≈全体中后台(礼品/客户/合约/行政/人力/前台/资金),
--       删除详情页直领面板后 API 裸调仍对这些角色开放, 收权防恶意构造请求
-- 🔴 执行时机建议(2026-11-11): 大促(11-10~11-15)期间暂缓执行——
--       oid=26 同时管控老活动物品(type=1/2等)领取, 礼品/客户/资金系是存量主力用户(58~100行/角色),
--       活动期收权有打断老物品发放的风险; UI 误触已随详情页面板摘除而清零, 活动期靠监控兜底,
--       活动结束后按真实使用数据圈定保留名单再执行本脚本
-- 保留名单圈定方法(活动期采数):
--       SELECT ro.rid, r.name, COUNT(*) FROM communion.roleoperation ro
--       JOIN communion.role r ON r.rid=ro.rid WHERE ro.oid=26 GROUP BY ro.rid, r.name;
--       结合业务确认(哪些角色真在领老物品/礼品券), 建议保留: 礼品系(236/364/237/367/238/337/383/385/413/366/315)
--       + 资金收银系(348/345/347/359) + 系统管理员(86) + 业务确认的其他角色
-- 执行前置条件:
--       ① 活动期结束(或业务确认保留名单);
--       ② 干跑段结果与执行时点一致(新增授权行会被 NOT IN 逻辑保留, 无风险)
-- 回滚方式: 依备份表批量回插(bak 表含全部被删行, INSERT SELECT 还原)
-- 幂等性: DELETE 精确 rid NOT IN 名单, 重跑零效果
-- ============================================================================

-- ============ 干跑段(执行前先跑, 核对将删行数) ============

-- 1. 现存授权总行数(2026-11-11 干跑=4934)
SELECT COUNT(*) AS totalRows FROM communion.roleoperation WHERE oid = 26;

-- 2. 将被删除的行数(2026-11-11 干跑=3924; 保留名单16角色共1010行:
--    礼品系11角色816行+资金收银系4角色190行+系统管理员100行, 与下方 DELETE 名单严格一致)
SELECT COUNT(*) AS willDeleteRows FROM communion.roleoperation
WHERE oid = 26 AND rid NOT IN (236, 364, 237, 367, 238, 337, 383, 385, 413, 366, 315, 348, 345, 347, 359, 86);

-- ============ 一、备份(先建并核对行数=干跑 willDeleteRows) ============

CREATE TABLE IF NOT EXISTS communion.bak_roleoperation_oid26_20261111 AS
SELECT ro.* FROM communion.roleoperation ro
WHERE oid = 26 AND rid NOT IN (236, 364, 237, 367, 238, 337, 383, 385, 413, 366, 315, 348, 345, 347, 359, 86);
SELECT COUNT(*) AS bakRows FROM communion.bak_roleoperation_oid26_20261111;

-- ============ 二、删除非保留角色授权(影响行数必须=bakRows) ============

DELETE FROM communion.roleoperation
WHERE oid = 26 AND rid NOT IN (236, 364, 237, 367, 238, 337, 383, 385, 413, 366, 315, 348, 345, 347, 359, 86);

-- ============ 验证段 ============

-- 1. 剩余授权: 期望=保留名单行数(干跑参考: 礼品系11角色约816行+资金系190行+系统管理员100行≈1100行)
SELECT r.rid, r.name, COUNT(*) AS leftRows FROM communion.roleoperation ro
JOIN communion.role r ON r.rid = ro.rid WHERE ro.oid = 26 GROUP BY r.rid, r.name ORDER BY leftRows DESC;

-- 2. 回滚模板(仅限误删时):
-- INSERT INTO communion.roleoperation SELECT * FROM communion.bak_roleoperation_oid26_20261111;
