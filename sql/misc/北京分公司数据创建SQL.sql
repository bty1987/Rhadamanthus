-- ============================================
-- 北京分公司数据创建脚本 (简化版)
-- 创建时间: 2026-04-11
-- 说明: 参考天津方林/天津爱林创建北京方林/北京方林整装
-- ============================================

-- ============================================
-- 一、communion.company 公司表
-- ============================================
-- 天津方林装饰 cid=66, 天津爱林 cid=67

-- 北京方林装饰
INSERT INTO communion.company (cid, `no`, code, name, fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block)
SELECT 91, 1, '110100', '北京方林装饰', fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block
FROM communion.company WHERE cid = 66;

-- 北京方林整装
INSERT INTO communion.company (cid, `no`, code, name, fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block)
SELECT 92, 1, '110100', '北京方林整装', fullname, shortname, address, corporation, phone, doid, soid, atttype, status, block
FROM communion.company WHERE cid = 67;


-- ============================================
-- 二、factory.server 服务器配置表
-- ============================================
-- 主键 sid 由系统自动生成 (AUTO_INCREMENT)

-- 北京方林装饰 (cid=91) 服务器配置
INSERT INTO factory.server (name, host, type, company, comment)
SELECT name, host, type, 91, '北京方林装饰'
FROM factory.server WHERE company = 66;

-- 北京方林整装 (cid=92) 服务器配置
INSERT INTO factory.server (name, host, type, company, comment)
SELECT name, host, type, 92, '北京方林整装'
FROM factory.server WHERE company = 67;


-- ============================================
-- 三、communion.systemconfig 系统配置表
-- ============================================
-- 主键 scid 由系统自动生成 (AUTO_INCREMENT)

-- 北京方林装饰 (company=91) 系统配置
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`,
       CASE WHEN `key` IN ('messageAgentId', 'corpId', 'secret') THEN '待配置' ELSE `value` END,
       cuid, NOW(), comment, 91
FROM communion.systemconfig WHERE company = 66;

-- 北京方林装饰 钉钉企业配置 (dingtalk 分组) - 单独处理待配置
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`, '待配置', cuid, NOW(), comment, 91
FROM communion.systemconfig WHERE company = 66 AND `group` = 'dingtalk';

-- 北京方林整装 (company=92) 系统配置
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`,
       CASE WHEN `key` IN ('messageAgentId', 'corpId', 'secret') THEN '待配置' ELSE `value` END,
       cuid, NOW(), comment, 92
FROM communion.systemconfig WHERE company = 67;

-- 北京方林整装 钉钉企业配置 (dingtalk 分组) - 单独处理待配置
INSERT INTO communion.systemconfig (`group`, `key`, `value`, cuid, createTime, comment, company)
SELECT `group`, `key`, '待配置', cuid, NOW(), comment, 92
FROM communion.systemconfig WHERE company = 67 AND `group` = 'dingtalk';


-- ============================================
-- 四、data.constructionnode 施工节点表
-- ============================================
-- 主键 cnid 由系统自动生成 (AUTO_INCREMENT)

-- 北京方林装饰 (company=91) 施工节点
INSERT INTO data.constructionnode (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, company)
SELECT name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, 91
FROM data.constructionnode WHERE company = 66;

-- 北京方林整装 (company=92) 施工节点
INSERT INTO data.constructionnode (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, company)
SELECT name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, 92
FROM data.constructionnode WHERE company = 67;


-- ============================================
-- 五、data.paymenttype 付款类型表
-- ============================================
-- 主键 ptid 由系统自动生成 (AUTO_INCREMENT)

-- 北京方林装饰 (company=91) 付款类型
INSERT INTO data.paymenttype (name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, company)
SELECT name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, 91
FROM data.paymenttype WHERE company = 66;

-- 北京方林整装 (company=92) 付款类型
INSERT INTO data.paymenttype (name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, company)
SELECT name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, 92
FROM data.paymenttype WHERE company = 67;


-- ============================================
-- 六、data.decorationbusitype 装修业务类型表
-- ============================================
-- 主键 dbid 由系统自动生成 (AUTO_INCREMENT)

-- 北京方林装饰 (company=91) 业务类型
INSERT INTO data.decorationbusitype (no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, status, company)
SELECT no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, status, 91
FROM data.decorationbusitype WHERE company = 66;

-- 北京方林整装 (company=92) 业务类型
INSERT INTO data.decorationbusitype (no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, status, company)
SELECT no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, status, 92
FROM data.decorationbusitype WHERE company = 67;


-- ============================================
-- 执行说明
-- ============================================
-- 1. 本脚本使用 INSERT INTO ... SELECT 方式直接从天津公司数据复制
-- 2. 钉钉相关配置(messageAgentId, corpId, secret)已设置为'待配置'，需北京方林创建钉钉企业后手动更新
-- 3. doid/soid 字段从天津公司复制，需要后续根据北京分公司实际部门结构调整
-- 4. block 字段: 1=方林装饰, 4=方林整装
-- 5. 北京区域代码: 110100 (天津市为 120100)
-- 6. 除 company 表外，其他表的主键由系统自动生成 (AUTO_INCREMENT)
-- ============================================


-- ============================================
-- 后续需要手动更新的配置项
-- ============================================
-- UPDATE communion.systemconfig SET `value` = '北京实际钉钉AgentId' WHERE `key` = 'messageAgentId' AND company IN (91, 92);
-- UPDATE communion.systemconfig SET `value` = '北京实际钉钉CorpId' WHERE `key` = 'corpId' AND company IN (91, 92);
-- UPDATE communion.systemconfig SET `value` = '北京实际钉钉Secret' WHERE `key` = 'secret' AND company IN (91, 92);
-- UPDATE communion.systemconfig SET `value` = '北京实际钉钉CorpId' WHERE `group` = 'dingtalk' AND `key` = 'DINGTALK_CORPID_STR' AND company IN (91, 92);
-- UPDATE communion.systemconfig SET `value` = '北京实际钉钉Secret' WHERE `group` = 'dingtalk' AND `key` = 'DINGTALK_SECRET_STR' AND company IN (91, 92);
-- ============================================
