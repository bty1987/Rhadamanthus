-- ============================================================================
-- 文件: 18_quotetion_copy_split_menus.sql
-- 库表: communion.module(菜单) / communion.rolemodule(角色授权)
-- 用途: 预报单页拷贝三拆分(预报单拷贝/个人报价拷贝/他人报价拷贝)的两页面变体
--       菜单与授权——quotetionIndex.js 按 url 的 type 参数显示按钮变体:
--       type=designer 显示 预报单拷贝+个人报价拷贝(个人=校验设计师/业务员归属为本人);
--       type=quoter  显示 预报单拷贝+他人报价拷贝(不校验归属)。
-- 内容两部分:
--   一、菜单: 报价(316)下插两行变体(签单原 317 无 type 参数=三按钮全显, 存量口径);
--   二、授权: 对现授权 mid=317 的全部 (rid, company) 组合按角色名分流——
--       角色名含"设计师" → 授权 designer 版; 其余角色 → 授权 quoter 版;
--       最后下线 mid=317 的授权(旧无约束页面退出; 菜单本体保留不删)。
-- 执行前置条件:
--   ① 前端已发布(6639270ac, 三按钮+变体逻辑);
--   ② SELECT * FROM communion.module WHERE mid IN (316,317); ——确认父/子菜单现状
--   ③ 分流预演:
--      SELECT r.rid, r.name, r.company, (r.name LIKE '%设计师%') AS to_designer, COUNT(*) cnt
--      FROM communion.rolemodule rm JOIN communion.role r ON rm.rid = r.rid
--      WHERE rm.mid = 317 GROUP BY rm.rid, r.company ORDER BY to_designer DESC, cnt DESC;
--      ——🔴 请业务过目角色清单: 匹配口径=角色名含"设计师"(含设计师通用/规划设计师/
--         1918设计师改等变体, 全库共8个设计师类角色), 若有含"设计师"字样但不应走
--         designer 版的角色, 先修角色名或改匹配条件再执行;
--   ④ SELECT COUNT(*) FROM communion.module WHERE url LIKE '%type=designer%' AND name LIKE '预报单%';
--      期望 = 0(变体菜单未建过)
-- 回滚方式:
--   DELETE FROM communion.rolemodule WHERE mid IN (@designer_mid, @quoter_mid);
--   DELETE FROM communion.module WHERE mid IN (@designer_mid, @quoter_mid);
--   INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, company)
--     SELECT rid, mid, link, access, cuid, company FROM communion.rolemodule_bak_mid317_20261023;
-- 幂等性: 菜单按 url 守卫、授权按 (rid,mid,company) NOT EXISTS 守卫, 可重复执行;
--         旧授权 DELETE 幂等。
-- ============================================================================

-- ① 菜单: designer 变体(参数式 mid 捕获, 供授权引用)
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`, helpKey)
SELECT 316, '预报单(设计师)', '预报单(设计师)', '', 'icon-legal',
       '/views/quotation/quotetionIndex.html?depage=quotetion&type=designer', 2, 1, 2, NULL
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.module WHERE url = '/views/quotation/quotetionIndex.html?depage=quotetion&type=designer');

SET @designer_mid = (SELECT mid FROM communion.module WHERE url = '/views/quotation/quotetionIndex.html?depage=quotetion&type=designer' LIMIT 1);

-- ② 菜单: quoter 变体
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`, helpKey)
SELECT 316, '预报单(报价)', '预报单(报价)', '', 'icon-legal',
       '/views/quotation/quotetionIndex.html?depage=quotetion&type=quoter', 2, 1, 3, NULL
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.module WHERE url = '/views/quotation/quotetionIndex.html?depage=quotetion&type=quoter');

SET @quoter_mid = (SELECT mid FROM communion.module WHERE url = '/views/quotation/quotetionIndex.html?depage=quotetion&type=quoter' LIMIT 1);

-- ③ 授权备份(回滚与审计依据, 幂等: 表已存在则跳过)
CREATE TABLE IF NOT EXISTS communion.rolemodule_bak_mid317_20261023 AS
SELECT * FROM communion.rolemodule WHERE mid = 317;

-- ④ 授权分流: 设计师角色 → designer 版(按 rid+company 组合去重)
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, company)
SELECT DISTINCT rm.rid, @designer_mid, rm.link, IFNULL(rm.access, 0), 34, rm.company
FROM communion.rolemodule rm
JOIN communion.role r ON rm.rid = r.rid
WHERE rm.mid = 317 AND r.name LIKE '%设计师%'
  AND NOT EXISTS (SELECT 1 FROM communion.rolemodule t WHERE t.rid = rm.rid AND t.mid = @designer_mid AND t.company = rm.company);

-- ⑤ 授权分流: 其余角色 → quoter 版
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, company)
SELECT DISTINCT rm.rid, @quoter_mid, rm.link, IFNULL(rm.access, 0), 34, rm.company
FROM communion.rolemodule rm
JOIN communion.role r ON rm.rid = r.rid
WHERE rm.mid = 317 AND r.name NOT LIKE '%设计师%'
  AND NOT EXISTS (SELECT 1 FROM communion.rolemodule t WHERE t.rid = rm.rid AND t.mid = @quoter_mid AND t.company = rm.company);

-- ⑥ 下线旧无约束页面授权(菜单本体 317 保留; 如需保留旧入口并行, 跳过本句)
DELETE FROM communion.rolemodule WHERE mid = 317;

-- ============================================================================
-- 验证语句(执行后核对):
--   ① SELECT mid, name, url, `order` FROM communion.module WHERE fatherModuleId = 316;
--      ——应见 317(预报单, 无type) + 两个变体行(order 2/3)
--   ② SELECT mid, COUNT(*) FROM communion.rolemodule
--      WHERE mid IN (317, @designer_mid, @quoter_mid) GROUP BY mid;
--      ——317 应为 0(已下线); 变体两行合计应≈备份行数(4004, 一角色一变体不重不漏)
--   ③ 设计师角色抽查:
--      SELECT rm.rid, r.name, rm.mid FROM communion.rolemodule rm
--      JOIN communion.role r ON rm.rid = r.rid
--      WHERE rm.mid IN (@designer_mid, @quoter_mid) AND r.name LIKE '%设计师%';
--      ——全部应落在 designer 版
-- 生效方式: 菜单/授权数据, 用户重新登录或刷新菜单后即时可见, 免发版。
-- ============================================================================
