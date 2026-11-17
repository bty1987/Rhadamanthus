-- ============================================================================
-- 47_norm_sync_operation_systemconfig.sql
-- 三方定额补数(supplementNormForSync) operation 登记 + systemconfig 配置
-- ============================================================================
-- 背景：
--   seiya 模块 A20261117Action 新增 supplementNormForSync 端点(Phase 1 独立触发):
--     按装修单(erpOrderCode)调上方系统工费清单/辅料单两接口(appId=erp_project_sync),
--     补充 data.normrice/data.normood(工费 trannum=0 总额行挂锚点报价项 salary=amount厘;
--     辅料挂锚点报价项 normnum=storenum=quantity毫÷锚点工程量; 仅补缺: 同 cnid/nid 已有定额行跳过),
--     并建 quotation.normtion 单据头(判断不存在进行创建)。
--     后续 makeNormtion 接线复用同服务(Phase 2, 见 docs/01-方案设计/定额数据接口补充评估方案.md 第7节)。
--
-- 1) operation 登记: 沿 seiya 同步端点家族惯例(20/46号): moduleId=6(装修域), through=2
--    (必传 authentication, 免角色授权; Phase 2 如需收权改 through=0 + roleoperation 授权行另行插入)
-- 2) systemconfig:
--    - (company=0) norm.sync.url = 上方系统网关基地址(daily/正式各自配, 含 /open-api/sync 前缀,
--      代码追加 /erp/quotation/labor-fee/get 与 /erp/quotation/auxiliary-material-list/get);
--      公司行可覆盖集团行(同一 key 配 company=公司id)
--    - 密钥复用既有 cost.app.secret(appId=erp_project_sync 同 appId, 禁止重复配键, 本文件不插)
--    - 公司开关 norm.sync.enable: 按公司 INSERT(value='1' 启用); 未配置的公司自动走现有逻辑
--
-- ⚠️ 注意：
--   1. 三条 INSERT 均幂等(NOT EXISTS 防重)。
--   2. 执行前置: 先于 seiya jar 发版(端点未注册时调用被拦截器拒绝); data jar 同批
--      (normriceDao/normoodDao 新增 queryNormriceByQiids/queryNormoodByQiids)。
--   3. norm.sync.url 的 value 按环境调整: daily=daily 网关前缀, 正式=正式网关前缀。
--   4. cuid=34 沿 11 号惯例(配置创建人), 可按实际运维账号调整。
--
-- 回滚方式：
--   DELETE FROM communion.operation WHERE operation = 'supplementNormForSync';
--   DELETE FROM communion.systemconfig WHERE `key` = 'norm.sync.url';
--   DELETE FROM communion.systemconfig WHERE `key` = 'norm.sync.enable';  -- 按需逐公司
--
-- 验证语句：
--   SELECT oid, moduleId, operation, through, status FROM communion.operation
--     WHERE operation = 'supplementNormForSync';  -- 预期 1 行, moduleId=6, through=2
--   SELECT scid, company, `group`, `key`, value FROM communion.systemconfig
--     WHERE `key` IN ('norm.sync.url', 'norm.sync.enable');  -- url 1 行(company=0), enable 按已启用公司
-- ============================================================================

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, '三方定额补充', 'supplementNormForSync', 2, 2, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'supplementNormForSync');

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
