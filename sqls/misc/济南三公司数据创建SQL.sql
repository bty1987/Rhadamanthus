-- =====================================================================
-- 济南三公司数据创建脚本(生产执行)
-- 2026-09-20
-- 参照: sqls/misc/北京分公司数据创建SQL.sql 先例 + 补强
--   济南分公司   cid=97 (方林系 block=1, 参照北京方林装饰 cid=91)
--   济南方林装饰 cid=98 (方林系 block=1, 参照北京方林装饰 cid=91)
--   济南爱林装饰 cid=99 (爱林系 block=4, 参照北京方林整装 cid=92)
--
-- 🔴 执行前安检(逐条执行, 任一不符则中止):
--   SELECT MAX(cid) FROM communion.company;                        -- 必须 = 96
--   SELECT cid,name,block FROM communion.company WHERE cid IN (91,92);
--     -- 91=北京方林装饰(block=1), 92=北京方林整装(block=4), 均必须存在
--
-- 钉钉配置说明:
--   旧键(messageAgentId/corpId/secret)  = 老消息链路(messageAgentId=AgentId)
--   新键(group='dingtalk')              = token链路(DINGTALK_CORPID_STR=AppKey/SuiteKey,
--                                         DINGTALK_SECRET_STR=AppSecret/SuiteSecret)
--   本脚本直接写入实际值, 无需二次 UPDATE
--   钉钉部门ID落 communion.company.no(生产实证: 北京91=1075669740/92=1075996281/全国自营96
--   均为钉钉部门ID形态; 北京脚本原文 no=1 系执行后有人修正, 本次直接写对):
--     97=1121813237 / 98=1121827279 / 99=1121974272
-- =====================================================================

-- =====================================================================
-- 一、communion.company 公司表(cid 显式指定, 若 97/98/99 已被占用 INSERT 会主键冲突报错, 不会错插)
-- =====================================================================

-- 济南分公司 (cid=97)
INSERT INTO communion.company (cid, `no`, code, name, fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block)
SELECT 97, 1121813237, '370100', '济南分公司', fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block
FROM communion.company WHERE cid = 91;

-- 济南方林装饰 (cid=98)
INSERT INTO communion.company (cid, `no`, code, name, fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block)
SELECT 98, 1121827279, '370100', '济南方林装饰', fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block
FROM communion.company WHERE cid = 91;

-- 济南爱林装饰 (cid=99)
INSERT INTO communion.company (cid, `no`, code, name, fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block)
SELECT 99, 1121974272, '370100', '济南爱林装饰', fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block
FROM communion.company WHERE cid = 92;

-- =====================================================================
-- 二、factory.server 服务器配置(复制参照公司, sid 自增)
-- =====================================================================

INSERT INTO factory.server (name, host, type, company, comment)
SELECT name, host, type, 97, '济南分公司' FROM factory.server WHERE company = 91;

INSERT INTO factory.server (name, host, type, company, comment)
SELECT name, host, type, 98, '济南方林装饰' FROM factory.server WHERE company = 91;

INSERT INTO factory.server (name, host, type, company, comment)
SELECT name, host, type, 99, '济南爱林装饰' FROM factory.server WHERE company = 92;

-- =====================================================================
-- 三、communion.systemconfig 系统配置(全量复制参照公司, 钉钉键直接写实际值)
-- =====================================================================

-- 济南分公司 (company=97) — 钉钉: AgentId 5007426797 / dingnqgaqmld8aurjwm0
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`,
       CASE `key`
           WHEN 'messageAgentId' THEN '5007426797'
           WHEN 'corpId'         THEN 'dingnqgaqmld8aurjwm0'
           WHEN 'secret'         THEN 'NNgYYjqWyuRDwfqVeQHBfXziHIQ0APyBc8XZZdJ5L0wWGUE4Doop2GYXVXZtiTVR'
           ELSE `value`
       END,
       cuid, NOW(), comment, 97
FROM communion.systemconfig WHERE company = 91;

-- dingtalk 组新键(token 链路)
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`,
       CASE `key`
           WHEN 'DINGTALK_CORPID_STR' THEN 'dingnqgaqmld8aurjwm0'
           WHEN 'DINGTALK_SECRET_STR' THEN 'NNgYYjqWyuRDwfqVeQHBfXziHIQ0APyBc8XZZdJ5L0wWGUE4Doop2GYXVXZtiTVR'
           ELSE `value`
       END,
       cuid, NOW(), comment, 97
FROM communion.systemconfig WHERE company = 91 AND `group` = 'dingtalk';

-- 济南方林装饰 (company=98) — 钉钉: AgentId 5007762451 / dingiz93n3b5p4hcnqq1
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`,
       CASE `key`
           WHEN 'messageAgentId' THEN '5007762451'
           WHEN 'corpId'         THEN 'dingiz93n3b5p4hcnqq1'
           WHEN 'secret'         THEN 'eOa0vqflGnM2RrYdCEYH8tX8AE-2U9ihindv7SGRVOifkN0KSNzZBfj_az9bz98r'
           ELSE `value`
       END,
       cuid, NOW(), comment, 98
FROM communion.systemconfig WHERE company = 91;

-- dingtalk 组新键(token 链路)
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`,
       CASE `key`
           WHEN 'DINGTALK_CORPID_STR' THEN 'dingiz93n3b5p4hcnqq1'
           WHEN 'DINGTALK_SECRET_STR' THEN 'eOa0vqflGnM2RrYdCEYH8tX8AE-2U9ihindv7SGRVOifkN0KSNzZBfj_az9bz98r'
           ELSE `value`
       END,
       cuid, NOW(), comment, 98
FROM communion.systemconfig WHERE company = 91 AND `group` = 'dingtalk';

-- 济南爱林装饰 (company=99) — 钉钉: AgentId 5007631744 / dingwirkqea43bzehiyj
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`,
       CASE `key`
           WHEN 'messageAgentId' THEN '5007631744'
           WHEN 'corpId'         THEN 'dingwirkqea43bzehiyj'
           WHEN 'secret'         THEN 'B5zi66T-8FTHAJR7FVIvw8tqtoKDE7txUCHj3XSNSR9or4jxKjhMF2-oMR0lnHA7'
           ELSE `value`
       END,
       cuid, NOW(), comment, 99
FROM communion.systemconfig WHERE company = 92;

-- dingtalk 组新键(token 链路)
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`,
       CASE `key`
           WHEN 'DINGTALK_CORPID_STR' THEN 'dingwirkqea43bzehiyj'
           WHEN 'DINGTALK_SECRET_STR' THEN 'B5zi66T-8FTHAJR7FVIvw8tqtoKDE7txUCHj3XSNSR9or4jxKjhMF2-oMR0lnHA7'
           ELSE `value`
       END,
       cuid, NOW(), comment, 99
FROM communion.systemconfig WHERE company = 92 AND `group` = 'dingtalk';

-- =====================================================================
-- 四、data 基础数据三表(施工节点/付款类型/装修业务类型, 主键自增)
-- 🔴 2026-10-02: 本段从未在生产执行; 98/99 三表已改由 济南基础数据对齐青岛SQL.sql
--    (源=青岛方林79/青岛爱林80)灌入。如需补跑, 仅可执行 97(济南分总)腿,
--    98/99 两腿补跑会与青岛版重复, 勿执行。
-- =====================================================================

-- 济南分公司 (97) <- 北京方林装饰 (91)
INSERT INTO data.constructionnode (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, company)
SELECT name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, 97
FROM data.constructionnode WHERE company = 91;

INSERT INTO data.paymenttype (name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, company)
SELECT name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, 97
FROM data.paymenttype WHERE company = 91;

INSERT INTO data.decorationbusitype (no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, status, company)
SELECT no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, status, 97
FROM data.decorationbusitype WHERE company = 91;

-- 济南方林装饰 (98) <- 北京方林装饰 (91)
INSERT INTO data.constructionnode (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, company)
SELECT name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, 98
FROM data.constructionnode WHERE company = 91;

INSERT INTO data.paymenttype (name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, company)
SELECT name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, 98
FROM data.paymenttype WHERE company = 91;

INSERT INTO data.decorationbusitype (no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, status, company)
SELECT no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, status, 98
FROM data.decorationbusitype WHERE company = 91;

-- 济南爱林装饰 (99) <- 北京方林整装 (92)
INSERT INTO data.constructionnode (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, company)
SELECT name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, 99
FROM data.constructionnode WHERE company = 92;

INSERT INTO data.paymenttype (name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, company)
SELECT name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, 99
FROM data.paymenttype WHERE company = 92;

INSERT INTO data.decorationbusitype (no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, status, company)
SELECT no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, status, 99
FROM data.decorationbusitype WHERE company = 92;

-- =====================================================================
-- 五、platform.decorationfunctionright 功能授权(🔴 白名单无 company=0 回退,
--     不插则装修单页按钮/列全不显示; 北京先例缺此段, 本脚本补强)
-- =====================================================================

INSERT INTO platform.decorationfunctionright (name, dfid, company)
SELECT r.name, r.dfid, 97
FROM platform.decorationfunctionright r WHERE r.company = 91
  AND NOT EXISTS (SELECT 1 FROM platform.decorationfunctionright x WHERE x.name = r.name AND x.dfid = r.dfid AND x.company = 97);

INSERT INTO platform.decorationfunctionright (name, dfid, company)
SELECT r.name, r.dfid, 98
FROM platform.decorationfunctionright r WHERE r.company = 91
  AND NOT EXISTS (SELECT 1 FROM platform.decorationfunctionright x WHERE x.name = r.name AND x.dfid = r.dfid AND x.company = 98);

INSERT INTO platform.decorationfunctionright (name, dfid, company)
SELECT r.name, r.dfid, 99
FROM platform.decorationfunctionright r WHERE r.company = 92
  AND NOT EXISTS (SELECT 1 FROM platform.decorationfunctionright x WHERE x.name = r.name AND x.dfid = r.dfid AND x.company = 99);

-- =====================================================================
-- 六、hades.isvconfig 钉钉 ISV 配置(hades 服务按 company 取 corpid/secret 换 token,
--     每公司两行, type=2, icid 自增; 🔴 依赖本脚本第一段的 company 97/98/99 先建)
-- =====================================================================

-- 济南分公司 (company=97)
INSERT INTO hades.isvconfig (`key`, `value`, type, company, comment)
SELECT 'corpid', 'dingnqgaqmld8aurjwm0', 2, 97, '钉钉-济南分公司'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM hades.isvconfig WHERE company = 97 AND `key` = 'corpid');

INSERT INTO hades.isvconfig (`key`, `value`, type, company, comment)
SELECT 'secret', 'NNgYYjqWyuRDwfqVeQHBfXziHIQ0APyBc8XZZdJ5L0wWGUE4Doop2GYXVXZtiTVR', 2, 97, '钉钉-济南分公司'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM hades.isvconfig WHERE company = 97 AND `key` = 'secret');

-- 济南方林装饰 (company=98)
INSERT INTO hades.isvconfig (`key`, `value`, type, company, comment)
SELECT 'corpid', 'dingiz93n3b5p4hcnqq1', 2, 98, '钉钉-济南方林'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM hades.isvconfig WHERE company = 98 AND `key` = 'corpid');

INSERT INTO hades.isvconfig (`key`, `value`, type, company, comment)
SELECT 'secret', 'eOa0vqflGnM2RrYdCEYH8tX8AE-2U9ihindv7SGRVOifkN0KSNzZBfj_az9bz98r', 2, 98, '钉钉-济南方林'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM hades.isvconfig WHERE company = 98 AND `key` = 'secret');

-- 济南爱林装饰 (company=99)
INSERT INTO hades.isvconfig (`key`, `value`, type, company, comment)
SELECT 'corpid', 'dingwirkqea43bzehiyj', 2, 99, '钉钉-济南爱林'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM hades.isvconfig WHERE company = 99 AND `key` = 'corpid');

INSERT INTO hades.isvconfig (`key`, `value`, type, company, comment)
SELECT 'secret', 'B5zi66T-8FTHAJR7FVIvw8tqtoKDE7txUCHj3XSNSR9or4jxKjhMF2-oMR0lnHA7', 2, 99, '钉钉-济南爱林'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM hades.isvconfig WHERE company = 99 AND `key` = 'secret');

-- =====================================================================
-- 执行后核验
--   SELECT cid, name, block FROM communion.company WHERE cid IN (97,98,99);
--   SELECT company, COUNT(*) FROM communion.systemconfig WHERE company IN (97,98,99) GROUP BY company;
--   SELECT company, `key`, LEFT(value,32) FROM communion.systemconfig
--     WHERE company IN (97,98,99) AND (`key` IN ('messageAgentId','corpId','secret')
--        OR (`group`='dingtalk' AND `key` LIKE 'DINGTALK_%')) ORDER BY company, `key`;   -- 钉钉5键×3公司=15行
--   SELECT company, COUNT(*) FROM platform.decorationfunctionright WHERE company IN (97,98,99) GROUP BY company;
--     -- 预期: 97 与 91 同(约1557), 98 与 91 同, 99 与 92 同(约1607)
--   SELECT company, COUNT(*) FROM data.constructionnode WHERE company IN (97,98,99) GROUP BY company;
--   SELECT company, `key`, LEFT(value,32) FROM hades.isvconfig WHERE company IN (97,98,99) ORDER BY company, `key`;  -- 应 6 行
-- =====================================================================
--
-- 后续人工事项(非 SQL):
--   1. 公司全称/地址/法人/电话等 communion.company 字段按工商信息补齐(本脚本沿用参照公司值)
--   2. 新公司建部门/用户/角色授权后, decorationstatusright 按人授权随之配置
--   3. 钉钉应用后台将可见范围配置到对应部门(部门ID已落 company.no, 见头注释)
--   4. 若公司命名需调整(如"济南方林装饰"改简称), 直接 UPDATE communion.company.name
-- =====================================================================
