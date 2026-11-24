-- ============================================================================
-- 59_phone_query_roleoperation_whitelist.sql
-- ============================================================================
-- 用途: 「查询客户电话」三接口授权收窄为角色白名单(方案2 改白名单)
--   oid 34  查询客户电话            (queryCustomerPhoneByCid)
--   oid 77  查询客户电话(有记录)     (queryCustomerForPhone)
--   oid 280 查询客户电话(签约)       (queryDecorationInfoForContract)
--   删除全部非白名单角色授权行(游客/工人/人力/库管/采购/打印/运维等后台与泛角色)
--
-- 背景(2026-11-23 生产实测):
--   三接口授权面 19,403 人(oid77), 其中「游客」角色占 15,262 人 = 79%;
--   成因三层叠加: ①游客是近乎全员默认角色(工程公司6,838人主角色即游客)
--   ②fillOperation 影子收集按「用户全部角色」补种授权(历史行100%为本人自种)
--   ③31号SQL规则A 同角色铺平(2026-10-02 09:03 一次性229,127行)把(rid,oid)铺到97-100家公司
--
-- 🔴 执行前置(必须同时满足):
--   ① 段0 备份先建并核对行数
--   ② 低峰时段执行
--   ③ 代码守卫同批上线: AccessInterceptor 的 through=0 分支不再调用 fillOperation
--      (否则持有「白名单角色+被删角色」的用户调用接口时, 影子收集会把被删角色
--       重新种回该用户公司 —— 实测此类用户 1,760 人, 游客会被复种并重新扩散全员)
--
-- 幂等性: DELETE 按 rid NOT IN 白名单, 可重复执行
-- 回滚方式(从备份表回插):
--   INSERT INTO communion.roleoperation (rid, oid, cuid, createTime, company)
--   SELECT bak.rid, bak.oid, bak.cuid, bak.createTime, bak.company
--   FROM communion.roleoperation_bak_59_20261123 bak
--   WHERE NOT EXISTS (SELECT 1 FROM communion.roleoperation x
--     WHERE x.rid=bak.rid AND x.oid=bak.oid AND x.company=bak.company);
-- 验证语句(见文件末尾段2)
-- ============================================================================

-- ---------- 段0: 备份(先建后跑) ----------
CREATE TABLE communion.roleoperation_bak_59_20261123 AS
SELECT * FROM communion.roleoperation WHERE oid IN (34, 77, 280);
-- 验证备份: SELECT COUNT(*) FROM communion.roleoperation_bak_59_20261123;
--          -- 应 = 主表三oid当时行数(2026-11-23 实测 2839+3531+872=7242)

-- ---------- 段1: 删除非白名单角色授权 ----------
-- 删除角色清单(rid/名称/涉及公司数/在职人数), 2026-11-23 实测:
--   rid=82   游客               公司数=97   在职人数=15262
--   rid=52   工人               公司数=19   在职人数=1388
--   rid=272  方林人力主管           公司数=87   在职人数=64
--   rid=310  集团库管             公司数=1    在职人数=62
--   rid=8    外辅料员             公司数=64   在职人数=41
--   rid=249  方林打印主管           公司数=69   在职人数=40
--   rid=319  方林采购专员           公司数=59   在职人数=11
--   rid=187  运维管理员            公司数=96   在职人数=2
--   rid=1    root             公司数=1    在职人数=1
--   rid=373  爱林打印专员           公司数=25   在职人数=1

DELETE ro FROM communion.roleoperation ro
WHERE ro.oid IN (34, 77, 280)
  AND ro.rid NOT IN (
    14, 18, 56, 60, 64, 66, 72, 76, 86, 90, 92, 94,
    96, 108, 122, 135, 137, 144, 146, 148, 159, 164, 168, 171,
    210, 225, 236, 237, 238, 240, 242, 244, 245, 247, 259, 260,
    282, 283, 284, 286, 288, 289, 299, 302, 305, 306, 307, 311,
    314, 318, 320, 321, 322, 323, 324, 325, 327, 333, 335, 337,
    339, 341, 342, 348, 349, 350, 351, 359, 360, 365, 368, 370,
    376, 377, 382, 385, 386, 387, 388, 389, 391, 392, 393, 394,
    395, 396, 398, 400, 401, 402, 404, 405, 409, 410, 414, 419,
    424, 429, 430, 432, 433, 441, 443, 449
  );

-- ---------- 段2: 验证 ----------
-- ① 剩余授权行数与角色数(应为 103 个角色):
--   SELECT oid, COUNT(*) rows_cnt, COUNT(DISTINCT rid) roles
--   FROM communion.roleoperation WHERE oid IN (34,77,280) GROUP BY oid;
-- ② 确认游客/工人已清零(应返回0):
--   SELECT COUNT(*) FROM communion.roleoperation
--   WHERE oid IN (34,77,280) AND rid IN (82, 52);
-- ③ 剩余授权覆盖人数(口径同导出脚本):
--   SELECT ro.oid, COUNT(DISTINCT u.uid) users FROM communion.roleoperation ro
--   JOIN (SELECT uid,rid FROM communion.userrole UNION SELECT uid,roleId FROM communion.user) ur ON ur.rid = ro.rid
--   JOIN communion.user u ON u.uid = ur.uid AND u.status IN (0,2) AND ro.company IN (u.company, 0)
--   WHERE ro.oid IN (34,77,280) GROUP BY ro.oid;
-- ④ 抽查某公司客服/设计师仍可查(应 >0 行):
--   SELECT COUNT(*) FROM communion.roleoperation WHERE oid=77 AND company=<某cid>;
