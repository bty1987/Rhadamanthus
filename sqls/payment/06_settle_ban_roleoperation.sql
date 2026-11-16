-- =============================================================
-- 用途: 部分公司和角色取消落款权限(纯roleoperation配置,零代码)——
--       数据源《自营公司取消落款权限.xlsx》26对公司-角色
--       (5正林兴邦/10花溪软装/11致美灯饰/15智家科技/17铚林商贸/23正林鑫万石/96全国自营)
-- 机制: 两落款接口(settleSalesPayment oid=911 / settleDecorationPayment oid=970)
--       由 through=1免检 翻 through=0强权限 → checkOperation按
--       (主角色+附加角色)×(oid×company) 判定,无授权行即 -2"无操作权限";
--       影子收集(fillOperation)只对校验通过者补行,被拒角色不会自动获得授权
-- 步骤: 0.备份两张表  ①翻through  ②删26禁对存量授权行  ③封附加角色漏点
--       (被禁在职用户持有的、在其公司存在落款授权行的附加角色绑定,147行/144人:
--        游客82×67/主材管家135×50/导购164×13/综合服务专员122×8/驻店导购104×5/
--        自营管家137×2/花溪设计师425×1/设计经理通用159×1)
-- 副作用: ③中被删绑定=全局生效(该用户全系统失去该附加角色权限,非仅落款);
--         翻强权限后新建角色/组合默认无落款,需权配页面按 (rid,oid,company) 手工补授权
-- 前置: 纯数据操作,无jar依赖,免重启;SQL幂等(②③天然幂等,①带状态守卫)
-- 回滚: UPDATE communion.operation SET through=1 WHERE oid IN (911,970);
--       ②③删行从备份表回插(communion.bak_20261115_ro_911_970 / bak_20261115_ur_settleban)
-- 验证: SELECT through,name FROM communion.operation WHERE oid IN (911,970);        -- 两行均0
--       SELECT COUNT(*) FROM communion.roleoperation WHERE oid IN (911,970)
--         AND (company,rid) IN ((5,135),(5,350),(10,104),(10,122),(10,159),(10,350),
--         (10,351),(10,394),(10,425),(11,104),(11,122),(11,350),(15,350),(17,135),
--         (17,137),(17,164),(17,350),(23,135),(23,164),(23,350),(96,46),(96,104),
--         (96,135),(96,137),(96,164),(96,350));                                     -- 预期0
--       被禁在职用户(164人)登录后点落款应提示"无操作权限"; 其余公司角色不受影响
-- =============================================================

-- 0. 备份(先建备份表并核对行数, 再执行后续步骤)
CREATE TABLE IF NOT EXISTS communion.bak_20261115_ro_911_970 AS
SELECT * FROM communion.roleoperation WHERE oid IN (911, 970);

CREATE TABLE IF NOT EXISTS communion.bak_20261115_ur_settleban AS
SELECT ur.* FROM communion.userrole ur
JOIN communion.user u ON u.uid = ur.uid
WHERE u.status = 0
  AND CONCAT(u.company,'-',u.roleId) IN ('5-135','5-350','10-104','10-122','10-159','10-350','10-351','10-394','10-425','11-104','11-122','11-350','15-350','17-135','17-137','17-164','17-350','23-135','23-164','23-350','96-46','96-104','96-135','96-137','96-164','96-350')
  AND EXISTS (SELECT 1 FROM communion.roleoperation ro WHERE ro.oid IN (911,970) AND ro.company = u.company AND ro.rid = ur.rid);

-- ① 两落款接口翻强权限(免检→需授权行)
UPDATE communion.operation SET through = 0 WHERE oid IN (911, 970) AND through = 1;

-- ② 删26禁对的存量授权行(影子收集历史行)
DELETE FROM communion.roleoperation
WHERE oid IN (911, 970)
  AND (company, rid) IN ((5,135),(5,350),(10,104),(10,122),(10,159),(10,350),(10,351),(10,394),(10,425),(11,104),(11,122),(11,350),(15,350),(17,135),(17,137),(17,164),(17,350),(23,135),(23,164),(23,350),(96,46),(96,104),(96,135),(96,137),(96,164),(96,350));

-- ③ 封附加角色漏点: 被禁在职用户持有的、在其公司存在落款授权行的附加角色绑定
DELETE ur
FROM communion.userrole ur
JOIN communion.user u ON u.uid = ur.uid
WHERE u.status = 0
  AND CONCAT(u.company,'-',u.roleId) IN ('5-135','5-350','10-104','10-122','10-159','10-350','10-351','10-394','10-425','11-104','11-122','11-350','15-350','17-135','17-137','17-164','17-350','23-135','23-164','23-350','96-46','96-104','96-135','96-137','96-164','96-350')
  AND EXISTS (SELECT 1 FROM communion.roleoperation ro WHERE ro.oid IN (911,970) AND ro.company = u.company AND ro.rid = ur.rid);
