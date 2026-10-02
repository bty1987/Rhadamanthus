-- ============================================================================
-- 决算单菜单注册 + 角色授权(communion.module / communion.rolemodule)
-- ============================================================================
-- 背景:
--   "决算单"管理页(decorationAccount.html, 装修决算列表/决算明细/发送)此前无任何菜单入口;
--   dev 库已建菜单(mid=934, 挂"装修"mid=6 下, 仅 rid=86/company=1 一行测试授权)。
--   本脚本将该菜单落到生产, 并按"双闸门"口径授权。
--
-- 生产 module 现状(2026-10-02 核验):
--   生产不存在"决算单"module(name LIKE '%决算%' / url LIKE '%decorationAccount%' 均 0 行),
--   MAX(mid)=931; 第1段为"先查后插"结构, 若已存在则跳过 INSERT, 不会重复插。
--
-- 授权口径(用户定稿 2026-10-02 双闸门, 两条件同时满足):
--   闸门A(菜单路径): 持有"签约(sign dfid=87)/决算(cal dfid=83)按钮所在视图对应的
--     装修单-xxx菜单"(按钮→decorationfunctionright视图→module url depage=视图名→rolemodule持有);
--   闸门B(岗位职能): roleoperation 持有装修决算操作族任一
--     (oid 36 生成/84 查询/86 确认/788/789 更新装修决算)。
--   生产实测: ≈3321 行(DISTINCT rid+company) / 76 角色 / 99 公司。
--
--   口径演进记录: 仅菜单闸门=16680行/276角色(装修单-设计68/通用70系近全员浏览菜单,
--   designer/common 视图在75+公司配了决算按钮, 打印主管/礼品主管/工程文员等全部卷入, 过宽被否);
--   仅roleoperation=4307行/86角色(卷入无菜单路径角色); 双闸门=两者交集, 为定稿。
--   如需调整: 仅签约按钮(7240行/160角色)→第2段 f.value 只留('sign');
--   放回纯菜单口径(16680行)→删去 EXISTS 闸门B 括号段。
--
-- 权限模型说明(2026-10-02 核验):
--   决算单页三接口 pageDecorationAccount / sendDecorationAccount / queryDecorationAccountItem
--   均未注册 communion.operation, AccessInterceptor 对未注册接口登录即放行
--   (OperationServiceImpl.checkOperation 四参版 operationPO==null 时 return true),
--   故本菜单授权就是该页面的唯一门禁。
--
-- ⚠️ 注意:
--   1. 生产 order 槽位: "装修"(mid=6)下 order 0~5 已占(…4=量尺计划, 5=功能配置373),
--      dev 的 order=5 在生产会撞序, 本脚本用 order=6 追加, 不动存量菜单。
--   2. 🔴 mid 勿硬编码: dev 是 934, 生产自增(执行后预计 932), 本脚本全程用
--      变量 @mid_account 取实际值, 幂等可重跑。
--   3. 🔴 第2段必须保持 STRAIGHT_JOIN 驱动顺序(按钮→授权→菜单→角色菜单持有):
--      platform.decorationfunctionright 只有 PK(dfrid) 和 idx_dfid 索引,
--      若优化器反从 rolemodule(96万行)侧驱动, 按 (name,company) 探测将全表扫 13 万行/次,
--      只读副本实测超时; 生产主库执行同理, 勿改写 join 顺序。
--   4. 快照语义: 后续新增按钮配置/菜单授权/决算操作不会自动带出, 重跑本脚本即可补齐。
-- ============================================================================

-- ---------- 0. 执行前安检(人工核对) ----------
-- SELECT MAX(mid) FROM communion.module;                                -- 2026-10-02 实测 931, 预期执行后 932
-- SELECT mid, name FROM communion.module WHERE name LIKE '%决算%' OR url LIKE '%decorationAccount%';
--                                                                       -- 预期 0 行; 若已有决算单菜单, 跳过第1段只跑第2段
-- SELECT mid, name, `order` FROM communion.module WHERE fatherModuleId = 6 ORDER BY `order`;
--                                                                       -- 确认 order 6 空闲

-- ---------- 1. 菜单注册(先查后插, 已存在则跳过) ----------
SET @mid_account := (SELECT mid FROM communion.module WHERE fatherModuleId = 6 AND name = '决算单' LIMIT 1);

INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`)
SELECT 6, '决算单', '决算单', '', 'icon-tag', '/views/decoration/decorationAccount.html', 2, 1, 6
FROM DUAL
WHERE @mid_account IS NULL;

SET @mid_account := (SELECT mid FROM communion.module WHERE fatherModuleId = 6 AND name = '决算单' LIMIT 1);

-- ---------- 2. 角色授权(双闸门: 菜单路径 ∩ 岗位决算职能, 幂等) ----------
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT DISTINCT rm.rid, @mid_account, 1, 0, 34, NOW(), q.company
FROM (
    SELECT r.name AS viewName, r.company
    FROM platform.decorationfunctionright r
    JOIN decoration.decorationfunction f ON f.dfid = r.dfid
    WHERE f.`key` = 'pageBtn' AND f.type = 4 AND f.value IN ('sign', 'cal')
    GROUP BY r.name, r.company
) q
STRAIGHT_JOIN communion.module m
    ON m.url = CONCAT('/views/decoration/decoration.html?depage=', q.viewName)
STRAIGHT_JOIN communion.rolemodule rm
    ON rm.mid = m.mid AND rm.company = q.company
WHERE EXISTS (
    SELECT 1 FROM communion.roleoperation ro
    WHERE ro.rid = rm.rid AND ro.company = rm.company
      AND ro.oid IN (36, 84, 86, 788, 789)
)
  AND NOT EXISTS (
    SELECT 1 FROM communion.rolemodule rm2
    WHERE rm2.rid = rm.rid AND rm2.mid = @mid_account AND rm2.company = rm.company
);

-- ---------- 3. 执行后核验 ----------
-- SELECT COUNT(*) AS grantRows, COUNT(DISTINCT rid) AS roles, COUNT(DISTINCT company) AS comps
-- FROM communion.rolemodule WHERE mid = @mid_account;                   -- 预期 ≈ 3321 行 / 76 角色 / 99 公司
-- SELECT ro.name AS roleName, COUNT(DISTINCT rm.company) AS comps
-- FROM communion.rolemodule rm JOIN communion.role ro ON ro.rid = rm.rid
-- WHERE rm.mid = @mid_account GROUP BY rm.rid, ro.name ORDER BY comps DESC LIMIT 80;
