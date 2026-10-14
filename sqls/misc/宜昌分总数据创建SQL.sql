-- =====================================================================
-- 宜昌分总数据创建脚本(生产执行)
-- 2026-10-14
-- 参照: sqls/misc/济南三公司数据创建SQL.sql 先例 + 补强
--   宜昌分总 cid=100 (方林系 block=1)
--   参照公司 = 济南分总 cid=97 (2026-09-20 建站投产, 分总形态最新样板)
--
-- 生产核验(2026-10-14 只读库实证):
--   MAX(cid)=99, cid=100 未占用; 全库无"宜昌分总";
--   宜昌名下已有 51=宜昌爱林装饰(block=4)/72=宜昌方林装饰(block=1), 与本脚本无冲突;
--   97 实况: systemconfig 32行(含2行钉钉脏数据, 见下) / decorationfunctionright 1599行 /
--            factory.server 5行 / hades.isvconfig 2行 / decoration 单量 0
--   分总形态不带 data 三表基础数据: 94北京分总/96全国自营/97济南分总
--   constructionnode/paymenttype/decorationbusitype 均 0 行(实证为形态特征非遗漏),
--   故本脚本不含 济南脚本第四段; 宜昌开业需基础数据时另行立项(源可考 72=宜昌方林装饰)
--
-- 钉钉配置(飞哥提供, 2026-10-13):
--   AgentId  = 3273447105
--   AppKey   = dingf6s9vkpq7q7nxiwl
--   AppSecret= ZaKcUzcqru5HglTyCpGlqKMkFwbVZv7xbr2d5HEGCq0T-xfjlKVr5PkIGA07eiJJ
--   旧键(messageAgentId/corpId/secret)  = 老消息链路(messageAgentId=AgentId)
--   新键(group='dingtalk')              = token链路(DINGTALK_CORPID_STR=AppKey,
--                                         DINGTALK_SECRET_STR=AppSecret)
--   本脚本直接写入实际值, 新键段改显式幂等 INSERT
--
-- ⚠️ 济南脚本教训吸收(本脚本已修正):
--   ①济南脚本三段a未过滤 group='dingtalk', 把91的钉钉键也复制进了97,
--     致97现有两行脏数据(DINGTALK_CORPID_STR/SECRET_STR各两行, 其中一对是91的值
--     dingjra9o12gtnd7lgzk/rBX35GH1...); 本脚本三段a已过滤 dingtalk 组, 三段b改显式INSERT
--   ②97脏数据清理见文末附录(注释态, 需拍板后另行执行)
--
-- 🔴 company.no = 钉钉部门ID, 飞哥暂未提供, 本脚本暂写 1 占位(北京先例同款占位);
--    拿到后执行文末"人工事项1"的 UPDATE, 并同步钉钉应用后台可见范围
-- =====================================================================

-- =====================================================================
-- 执行前安检(逐条执行, 任一不符则中止):
--   SELECT MAX(cid) FROM communion.company;                          -- 必须 = 99
--   SELECT cid,name,block FROM communion.company WHERE cid = 97;     -- 必须= 济南分总/block=1
--   SELECT COUNT(*) FROM communion.company WHERE `no` = 1;           -- 必须 = 0(no占位防撞)
--   SELECT COUNT(*) FROM communion.systemconfig
--     WHERE company = 97 AND (`group` IS NULL OR `group` <> 'dingtalk');  -- 预期 = 28
--   SELECT COUNT(*) FROM platform.decorationfunctionright WHERE company = 97;  -- 预期 = 1599
--   SELECT COUNT(*) FROM factory.server WHERE company = 97;          -- 预期 = 5
--   SELECT COUNT(*) FROM communion.systemconfig
--     WHERE company = 97 AND `group` = 'dingtalk' AND `key` = 'DINGTALK_CORPID_STR';  -- 必须 ≥ 1(3b捐主)
-- =====================================================================

-- =====================================================================
-- 一、communion.company 公司表(cid 显式指定, 若 100 已被占用 INSERT 会主键冲突报错, 不会错插)
-- =====================================================================

INSERT INTO communion.company (cid, `no`, code, name, fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block)
SELECT 100, 1, '420500', '宜昌分总', fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block
FROM communion.company WHERE cid = 97;

-- =====================================================================
-- 二、factory.server 服务器配置(复制参照公司, sid 自增)
-- =====================================================================

INSERT INTO factory.server (name, host, type, company, comment)
SELECT name, host, type, 100, '宜昌分总' FROM factory.server WHERE company = 97;

-- =====================================================================
-- 三、communion.systemconfig 系统配置
--   3a 非钉钉组全量复制(过滤dingtalk组, 吸收济南教训①), 钉钉三旧键直接写实际值
-- =====================================================================

-- 宜昌分总 (company=100) — 钉钉: AgentId 3273447105 / dingf6s9vkpq7q7nxiwl
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`,
       CASE `key`
           WHEN 'messageAgentId' THEN '3273447105'
           WHEN 'corpId'         THEN 'dingf6s9vkpq7q7nxiwl'
           WHEN 'secret'         THEN 'ZaKcUzcqru5HglTyCpGlqKMkFwbVZv7xbr2d5HEGCq0T-xfjlKVr5PkIGA07eiJJ'
           ELSE `value`
       END,
       cuid, NOW(), comment, 100
FROM communion.systemconfig
WHERE company = 97 AND (`group` IS NULL OR `group` <> 'dingtalk');

-- 3b dingtalk 组新键(token 链路), 显式幂等 INSERT(97 同键行仅作 group/key/cuid/comment 捐主,
--    不复制 value, 防克隆参照公司重复行/脏值)
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`, 'dingf6s9vkpq7q7nxiwl', cuid, NOW(), comment, 100
FROM communion.systemconfig
WHERE company = 97 AND `group` = 'dingtalk' AND `key` = 'DINGTALK_CORPID_STR'
LIMIT 1;

INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`, 'ZaKcUzcqru5HglTyCpGlqKMkFwbVZv7xbr2d5HEGCq0T-xfjlKVr5PkIGA07eiJJ', cuid, NOW(), comment, 100
FROM communion.systemconfig
WHERE company = 97 AND `group` = 'dingtalk' AND `key` = 'DINGTALK_SECRET_STR'
LIMIT 1;

-- =====================================================================
-- 四、data 基础数据三表: 分总形态不带(94/96/97 生产实证均 0 行), 本脚本不执行;
--     宜昌开业需要时另行立项(源可考 72=宜昌方林装饰: node 19/paymenttype 65/busitype 16)
-- =====================================================================

-- =====================================================================
-- 五、platform.decorationfunctionright 功能授权(🔴 白名单无 company=0 回退,
--     不插则装修单页按钮/列全不显示; NOT EXISTS 防重)
-- =====================================================================

INSERT INTO platform.decorationfunctionright (name, dfid, company)
SELECT r.name, r.dfid, 100
FROM platform.decorationfunctionright r
WHERE r.company = 97
  AND NOT EXISTS (SELECT 1 FROM platform.decorationfunctionright x WHERE x.name = r.name AND x.dfid = r.dfid AND x.company = 100);

-- =====================================================================
-- 六、hades.isvconfig 钉钉 ISV 配置(hades 服务按 company 取 corpid/secret 换 token,
--     每公司两行, type=2, icid 自增; 🔴 依赖第一段 company=100 先建)
-- =====================================================================

INSERT INTO hades.isvconfig (`key`, `value`, type, company, comment)
SELECT 'corpid', 'dingf6s9vkpq7q7nxiwl', 2, 100, '钉钉-宜昌分总'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM hades.isvconfig WHERE company = 100 AND `key` = 'corpid');

INSERT INTO hades.isvconfig (`key`, `value`, type, company, comment)
SELECT 'secret', 'ZaKcUzcqru5HglTyCpGlqKMkFwbVZv7xbr2d5HEGCq0T-xfjlKVr5PkIGA07eiJJ', 2, 100, '钉钉-宜昌分总'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM hades.isvconfig WHERE company = 100 AND `key` = 'secret');

-- =====================================================================
-- 执行后核验
--   SELECT cid, `no`, code, name, block FROM communion.company WHERE cid = 100;
--   SELECT company, COUNT(*) FROM communion.systemconfig WHERE company = 100 GROUP BY company;   -- 预期 = 30
--   SELECT `group`, `key`, LEFT(value,32) FROM communion.systemconfig
--     WHERE company = 100 AND (`key` IN ('messageAgentId','corpId','secret')
--        OR (`group`='dingtalk' AND `key` LIKE 'DINGTALK_%')) ORDER BY `group`, `key`;          -- 钉钉5键=5行
--   SELECT company, COUNT(*) FROM platform.decorationfunctionright WHERE company = 100 GROUP BY company;  -- 预期与97同(1599)
--   SELECT company, COUNT(*) FROM factory.server WHERE company = 100 GROUP BY company;           -- 预期 = 5
--   SELECT company, `key`, LEFT(value,32) FROM hades.isvconfig WHERE company = 100;              -- 应 2 行
-- =====================================================================
--
-- 后续人工事项(非 SQL):
--   1. 🔴 钉钉部门ID拿到后执行(并同步钉钉应用后台可见范围到对应部门):
--      UPDATE communion.company SET `no` = <钉钉部门ID> WHERE cid = 100;
--   2. 公司全称/地址/法人/电话等 communion.company 字段按工商信息补齐(本脚本沿用参照公司空值占位)
--   3. 新公司建部门/用户/角色授权后, decorationstatusright 按人授权随之配置
--   4. 钉钉应用后台将可见范围配置到对应部门(依赖人工事项1的部门ID)
-- =====================================================================

-- =====================================================================
-- 附录(注释态, 与本脚本无执行依赖, 需拍板后另行执行):
-- 济南分总(97)钉钉组脏数据清理——济南脚本教训①遗留, 97 的 dingtalk 组现有两行 91 残值:
--   先核验(应 4 行: 2脏+2正):
--     SELECT `key`, `value` FROM communion.systemconfig
--     WHERE company = 97 AND `group` = 'dingtalk' ORDER BY `key`, `value`;
--   确认脏行后清理(预期删除 2 行):
--     DELETE FROM communion.systemconfig
--     WHERE company = 97 AND `group` = 'dingtalk'
--       AND ( (`key` = 'DINGTALK_CORPID_STR' AND `value` = 'dingjra9o12gtnd7lgzk')
--          OR (`key` = 'DINGTALK_SECRET_STR' AND `value` LIKE 'rBX35GH1JgauZG_tGtt5-JKJ%') );
-- =====================================================================
