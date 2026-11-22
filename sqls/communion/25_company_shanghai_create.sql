-- ============================== 创建上海三公司(上海分总/上海方林装饰/上海方林整装) ==============================
-- 用途: 照济南三连(97济南分总/98济南方林装饰/99济南爱林装饰, 2026-09建)与北京(91-94)先例创建上海三公司 + 通用必配 systemconfig。
-- 口径: code=行政区划代码(上海310100); atttype=1(装饰); block=方林系惯例(装饰/分总=1, 整装=4, 照82/83安庆与91/92北京先例);
--       shortname=''铁律(公司简称参与单号生成, 非空会污染orderId, 历史超长单教训, updateCompany亦强制置空);
--       no=1占位(未分配先例x7: 方林辅料/智林慧达/中迈劳务/成都1918/青岛四家), 后续拿到正式编号再UPDATE。
-- 缺省待补(不阻塞建司, 见文件尾待补清单): 钉钉corpId/secret/messageAgentId/金蝶KINGDEEENABLE/工商fullname/地址电话/报价版本及项目/平台装修单查询三权限。
-- 前置: 2026-11-01 实查三名字均不存在(照addCompany同名查重逻辑), cid将顺延101/102/103(auto_increment); MySQL 5.6 整篇执行, 两段均幂等可重跑。
-- 回滚: 文件尾回滚段(删配置按key清单+公司按name, 建司后尚未加人/建单时方可删)。
-- 验证: 三公司行 atttype=1/block=1,1,4; systemconfig 每公司24行; 三公司均0专属角色(全局角色通用, 无需建角色, 济南先例)。

-- ===== 段0: 公司主行(3行, NOT EXISTS按name幂等) =====
INSERT INTO communion.company (no, code, name, shortname, atttype, status, block)
SELECT 1, '310100', '上海分总', '', 1, 0, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.company WHERE name = '上海分总');

INSERT INTO communion.company (no, code, name, shortname, atttype, status, block)
SELECT 1, '310100', '上海方林装饰', '', 1, 0, 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.company WHERE name = '上海方林装饰');

INSERT INTO communion.company (no, code, name, shortname, atttype, status, block)
SELECT 1, '310100', '上海方林整装', '', 1, 0, 4 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.company WHERE name = '上海方林整装');

-- ===== 段1: 通用必配 systemconfig(24键 x 3公司, 值照济南97/98/99模板通用口径; NOT EXISTS按company+key幂等; cuid=34照济南配置行操作人惯例) =====
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, company)
SELECT s.g, s.k, s.v, 34, c.cid
FROM communion.company c,
(
         SELECT NULL    AS g, 'password'                        AS k, 'fanglin'                       AS v UNION ALL
         SELECT NULL,         'manageRate',                           '0.165,0.195,0.215,0.245'           UNION ALL
         SELECT NULL,         'trafficRate',                          '0.012'                             UNION ALL
         SELECT NULL,         'quotationlimit',                       '5'                                 UNION ALL
         SELECT NULL,         'supplierlimit',                        '500'                               UNION ALL
         SELECT NULL,         'userlimit',                            '500'                               UNION ALL
         SELECT NULL,         'workerDepositLimit',                   '0'                                 UNION ALL
         SELECT NULL,         'contractPath',                         'decorationContract1.html'          UNION ALL
         SELECT NULL,         'PAYMENT_PLATFORM_PATH_STR',            'com.fanglin.postar.airpos'         UNION ALL
         SELECT NULL,         'PAYMENT_PLATFORM_POSPAY_PATH_STR',     'com.fanglin.postar.airpos'         UNION ALL
         SELECT NULL,         'PAYMENT_PLATFORM_WXPAY_PATH_STR',      'com.fanglin.swiftpass.airpos'      UNION ALL
         SELECT 'customer',   'CUSTOMER_CHANCE_ISSUE_RULE',           'enable'                            UNION ALL
         SELECT 'customer',   'CUSTOMER_PROFILE_TEMPLATE_0',          '96'                                UNION ALL
         SELECT 'customer',   'CUSTOMER_PROFILE_TEMPLATE_1',          '97'                                UNION ALL
         SELECT 'customer',   'MEMBER_ENABLE_FLAG',                   '1'                                 UNION ALL
         SELECT 'quotation',  'CONSTRUCTION_TAG_PROFILE_TEMPLATE',    '107'                               UNION ALL
         SELECT 'quotation',  'DRAWLINE_TAG_PROFILE_TEMPLATE',        '104'                               UNION ALL
         SELECT 'quotation',  'QUOTATION_ADDREDUCE_PROFILE_TEMPLATE', '106'                               UNION ALL
         SELECT 'quotation',  'QUOTATION_CMPREH_CONFIG',              '1'                                 UNION ALL
         SELECT 'quotation',  'QUOTATION_PROFILE_TEMPLATE',           '108'                               UNION ALL
         SELECT 'quotation',  'QUOTATION_TAG_PROFILE_TEMPLATE',       '105'                               UNION ALL
         SELECT 'quotation',  'QUOTETION_CMPREH_CONFIG',              '1'                                 UNION ALL
         SELECT 'construction','WORKER_SALARY_LIMIT_TOTAL_INT',       '5000000'
) s
WHERE c.name IN ('上海分总', '上海方林装饰', '上海方林整装')
  AND NOT EXISTS (SELECT 1 FROM communion.systemconfig sc WHERE sc.company = c.cid AND sc.`key` = s.k);

-- ===== 验证 =====
-- 1. 三公司行(期望3行: atttype=1, block=1/1/4, status=0, shortname='')
SELECT cid, no, code, name, shortname, atttype, status, block
FROM communion.company
WHERE name IN ('上海分总', '上海方林装饰', '上海方林整装');

-- 2. 每公司配置数(期望各24行)
SELECT c.cid, c.name, COUNT(sc.scid) cfgs
FROM communion.company c
LEFT JOIN communion.systemconfig sc ON sc.company = c.cid
WHERE c.name IN ('上海分总', '上海方林装饰', '上海方林整装')
GROUP BY c.cid, c.name;

-- ===== 回滚(仅建司后未加人/未建单时可用; 先查cid再删) =====
-- DELETE sc FROM communion.systemconfig sc, communion.company c
--   WHERE sc.company = c.cid AND c.name IN ('上海分总','上海方林装饰','上海方林整装');
-- DELETE FROM communion.company WHERE name IN ('上海分总','上海方林装饰','上海方林整装');

-- ============================== 待补清单(信息到位后另行执行) ==============================
-- 1. company 行: no(正式公司编号, 现占位1)/fullname(工商全名)/address/corporation/phone/doid/soid —— UPDATE company SET ...
-- 2. 钉钉: 每公司新租户 corpId/messageAgentId/secret + dingtalk 组 DINGTALK_CORPID_STR/DINGTALK_SECRET_STR
--    (济南先例每司两组: 集团corpId dingjra9o12gtnd7lgzk + 自有corpId, 各配一套secret) —— 照样例补 systemconfig
-- 3. 金蝶: KINGDEEENABLE(济南97/98=15, 99=7, 每司不同账套标识)
-- 4. 报价版本: 济南先例=分总无版本, 方林装饰(98,QV_245默认)/爱林(99,QV_246默认)各一; 上海版本名与报价项业务定后,
--    照 sqls/quotation/QUOTATIONVERSION_INFO_INSERT.sql 建版本(下一可用编号从QV_3008顺延, QV_249=3007已是max) +
--    QUOTATIONITEM_IMPORT 套路导项(页内本仓库有现成脚本范式)
-- 5. 员工: 加人时配平台装修单查询三权限表(设计/业务/状态right, 无行=查不到任何单), 员工工号counting行加首人时自动初始化(济南先例0行)
-- 6. cookieOvertime 为全局键(company=0)无需配
