-- =============================================================================
-- 驻店人员(user.type=4)维护页面 —— 菜单/权限/角色配置初始化
-- 日期: 2026-08-28
-- 背景: InstorerAction(pageInstorer/addInstorer/updateInstorer)后端能力早已存在,
--       但生产从未启用:
--         1) communion.module 无驻店人员维护菜单(仅 mid=815"驻店"指向
--            /views/data/instorer.html,那是"数据→厂商→驻店"的品牌驻店配置页,另一功能)
--         2) communion.systemconfig 无 key='instorer' 配置,
--            addInstorer 取不到驻店角色会直接抛 FLException(230010,"角色不存在")
--       本次新增前台页面 app/views/personnel/instorer.html(纯 LayUI 骨架),
--       本脚本补齐菜单 + 权限 + 角色配置三件套。
--
-- 生产核查(2026-08-28 只读库):
--   communion.user type=4 存量 0 行(全新启用,无存量迁移问题)
--   驻店角色: rid=104 "驻店导购"(no=R_49, level=0, company=0)
--   人员父菜单: mid=507(人事→人员),子菜单 order 已用到 6
--
-- 幂等性: 全部 WHERE NOT EXISTS / INSERT...SELECT 防重,重复执行安全
-- =============================================================================

-- ---------- 1. systemconfig: 驻店人员角色配置 ----------
-- InstorerServiceImpl.addInstorer 用 querySystemConfig("instorer")(不限 company)
-- 取驻店人员的默认角色;缺此配置添加即报"角色不存在"。
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, `comment`, company)
SELECT '', 'instorer', '104', 0, '驻店人员角色ID(rid=104 驻店导购)', 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'instorer');

-- ---------- 2. module: 菜单(人事→人员 下挂"驻店人员") ----------
-- level=3 三级菜单;system=1;order=7(人员子菜单 1~6 已占用)
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`, helpKey)
SELECT 507, '驻店人员', '', '', '', '/views/personnel/instorer.html', 3, 1, 7, ''
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.module WHERE url = '/views/personnel/instorer.html'
);

-- ---------- 3. rolemodule: 角色授权(与"员工"菜单 mid=31 同可见范围) ----------
-- checkModule 对非超管角色查 rolemodule(rid, mid, company),无记录即"无操作权限"。
-- 复制 mid=31(员工)的全部授权行到新菜单,保证能在系统管理里按角色再细调。
-- (MySQL 的 ERROR 1093 限制只针对 UPDATE/DELETE,INSERT...SELECT 引用目标表自身是允许的)
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, company)
SELECT rm.rid, m.mid, 1, 0, 0, rm.company
FROM communion.rolemodule rm
CROSS JOIN communion.module m
WHERE m.url = '/views/personnel/instorer.html'
  AND rm.mid = 31
  AND NOT EXISTS (
      SELECT 1 FROM communion.rolemodule x
      WHERE x.rid = rm.rid AND x.mid = m.mid AND x.company = rm.company
  );

-- ---------- 4. 执行后核验 ----------
-- 应各返回 1 行 / 授权行数 = mid=31 的行数:
-- SELECT COUNT(*) FROM communion.systemconfig WHERE `key`='instorer';
-- SELECT mid,name,url FROM communion.module WHERE url='/views/personnel/instorer.html';
-- SELECT COUNT(*) FROM communion.rolemodule WHERE mid=(SELECT mid FROM communion.module WHERE url='/views/personnel/instorer.html');
