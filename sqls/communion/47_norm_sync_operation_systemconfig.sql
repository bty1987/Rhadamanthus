-- ============================================================================
-- 47_norm_sync_operation_systemconfig.sql
-- 三方定额补数(syncNormriceItem/syncNormoodItem) operation 登记 + systemconfig 配置
-- ============================================================================
-- 背景：
--   seiya 模块 A20261117Action 新增两个补数端点(Phase 1 独立触发, 沿 NERP 同步家族
--   一接口一端点惯例, 后续 makeNormtion 接线复用同服务层):
--     syncNormriceItem  工费清单查询(/erp/quotation/labor-fee/get) → quotation.normriceitem
--     syncNormoodItem   辅料单查询(/erp/quotation/auxiliary-material-list/get) → quotation.normooditem
--   数据模型: 三方定额不关联报价项(这类单报价无明细), 以 normtion 单据(qid)锚单落实例层——
--   qiid/areald/quoteld/npid(ngid)=0, type=3 定额行(幸存 makeNormtion 重跑 disable);
--   工费 normtype=1 附加确认流(确认后计入工资核算), trannum=0 总额行(salary=amount厘);
--   辅料 normtype=0, normnum=storenum=quantity毫(辅料管控 INIT 即计);
--   仅补缺(同 cnid/nid 现存有效行跳过), fail-closed(200132~200135)。
--   详见 docs/01-方案设计/定额数据接口补充评估方案.md 第 7 节。
--
-- 1) operation 登记: 沿 seiya 同步端点家族惯例(20/46号): moduleId=6(装修域), through=2
--    (必传 authentication, 免角色授权; Phase 2 如需收权改 through=0 + roleoperation 授权行另行插入)
-- 2) systemconfig:
--    - (company=0) norm.sync.url = 上方系统网关基地址(daily/正式各自配, 含 /open-api/sync 前缀,
--      代码追加两接口路径); 公司行可覆盖集团行(同一 key 配 company=公司id)
--    - 密钥复用既有 cost.app.secret(appId=erp_project_sync 同 appId, 禁止重复配键, 本文件不插)
--    - 公司开关 norm.sync.enable: 按公司 INSERT(value='1' 启用); 未配置的公司自动走现有逻辑
--
-- ⚠️ 注意：
--   1. 三条 INSERT 均幂等(NOT EXISTS 防重)。
--   2. 执行前置: 先于 seiya jar 发版(端点未注册时调用被拦截器拒绝); 本批零 DAO 改动, seiya jar 单模块发版。
--   3. norm.sync.url 的 value 按环境调整: daily=daily 网关前缀, 正式=正式网关前缀。
--   4. cuid=34 沿 11 号惯例(配置创建人), 可按实际运维账号调整。
--
-- 回滚方式：
--   DELETE FROM communion.operation WHERE operation IN ('syncNormriceItem', 'syncNormoodItem');
--   DELETE FROM communion.systemconfig WHERE `key` = 'norm.sync.url';
--   DELETE FROM communion.systemconfig WHERE `key` = 'norm.sync.enable';  -- 按需逐公司
--
-- 验证语句：
--   SELECT oid, moduleId, operation, through, status FROM communion.operation
--     WHERE operation IN ('syncNormriceItem', 'syncNormoodItem');  -- 预期 2 行, moduleId=6, through=2
--   SELECT scid, company, `group`, `key`, value FROM communion.systemconfig
--     WHERE `key` IN ('norm.sync.url', 'norm.sync.enable');  -- url 1 行(company=0), enable 按已启用公司
-- ============================================================================

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, '三方工费补数', 'syncNormriceItem', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncNormriceItem');

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, '三方辅料补数', 'syncNormoodItem', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'syncNormoodItem');

-- 集团行(company=0): 上方定额接口基地址(value 按环境调整)
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, company, comment)
SELECT 'normsync', 'norm.sync.url', 'https://daily-gateway.fanglin.vip/open-api/sync', 34, 0, '上方系统定额接口基地址(工费/辅料两接口公共前缀), 密钥复用 cost.app.secret'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'norm.sync.url' AND company = 0);

-- 公司开关行模板(逐公司执行, value='1' 启用三方补数; 未配置的公司走现有逻辑):
-- INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, company, comment)
-- SELECT 'normsync', 'norm.sync.enable', '1', 34, <公司id>, '三方定额补数公司开关'
-- FROM DUAL
-- WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'norm.sync.enable' AND company = <公司id>);
