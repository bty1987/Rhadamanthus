-- =====================================================================
-- 55号SQL: 人员管理四操作授权——工装公司(4)/方林地产(18)人力角色272
-- =====================================================================
-- 用途:
--   为工装公司(cid=4)与方林地产(cid=18)持有「方林人力主管」全局角色
--   (rid=272, no=R_0233, company=0)的人员补登 communion.roleoperation 授权行,
--   放开人员管理模块(moduleId=4)全部 4 个 through=0 关闸操作:
--     1126 addUser                 新增人员
--      894 updateUser              更新人员
--     1341 updateUserForBaseInfo   更新人员基本信息
--       49 updateUserForAdvance    更新人员权配 (⚠️敏感=给人员分配功能权限;
--                                  若不想放开, 执行前从下方 IN 列表删除此项即可)
--   背景: 2026-11-01/11-07 同款授权已配 company=5(正林兴邦)并执行;
--   本次为工装/地产人力(程菲FL-23790/张雪FL-38405/谢平FL-34900)补齐同族授权。
--   其余 user 相关操作(quitUser离职/tranUser转移/query/page 全族)均 through=1
--   免检放行, 无需授权。
--
-- 执行前置条件(生产只读库已实测 2026-11-22):
--   1) 角色272存在且为全局角色(company=0), 三人主角色均为272、无附加角色:
--      程菲 FL-23790 uid=27297 company=4 / 张雪 FL-38405 uid=44065 company=4 /
--      谢平 FL-34900 uid=40248 company=18, 三人均 status=0 在职
--   2) 公司4=工装公司、公司18=方林地产存在
--   3) 四 operation 存在且 moduleId=4/status=0/through=0
--   4) (272, 四oid, company IN (4,18)) 现存 0 行(下方预检应为 0 行)
--   5) 生效范围核对: 公司4/18 中持角色272(主或附加)者恰为上述三人, 不波及他司
--
-- 生效机制: AccessInterceptor→checkOperation 每请求实时查询 roleoperation,
--   匹配=rid IN(主角色+附加角色) AND oid AND (company=用户公司 OR company=0),
--   插行即生效, 免重启免重登录。
--
-- 回滚方式:
--   DELETE FROM communion.roleoperation
--   WHERE rid=272 AND oid IN (49,894,1126,1341) AND company IN (4,18);
--
-- 验证语句(执行后):
--   SELECT oid,company FROM communion.roleoperation
--   WHERE rid=272 AND oid IN (49,894,1126,1341) ORDER BY oid,company;
--   应返回 12 行 = 4 oid × {4,5,18}(含既有 company=5 的 4 行)
-- =====================================================================

-- ---------- 预检: 现存授权行(预期仅 company=5 共 4 行, 4/18 为 0 行) ----------
SELECT oid, company FROM communion.roleoperation
WHERE rid=272 AND oid IN (49,894,1126,1341) ORDER BY oid, company;

-- ---------- 授权: 4 oid × 2 company = 8 行, NOT EXISTS 幂等可重跑 ----------
INSERT INTO communion.roleoperation (rid, oid, cuid, createTime, company)
SELECT 272, o.oid, 0, NOW(), c.company
FROM communion.operation o
JOIN (SELECT 4 AS company UNION ALL SELECT 18 AS company) c
WHERE o.operation IN ('addUser','updateUser','updateUserForBaseInfo','updateUserForAdvance')
  AND NOT EXISTS (
      SELECT 1 FROM communion.roleoperation ro
      WHERE ro.rid=272 AND ro.oid=o.oid AND ro.company=c.company);

-- 注: cuid=0 为登记人审计字段(默认值), 不参与权限匹配语义;
--     既有 company=5 四行 cuid=34 为当年执行人 uid, 仅作留痕差异。

-- ---------- 终验: 预期 12 行(4 oid × company 4/5/18) ----------
SELECT oid, company FROM communion.roleoperation
WHERE rid=272 AND oid IN (49,894,1126,1341) ORDER BY oid, company;
