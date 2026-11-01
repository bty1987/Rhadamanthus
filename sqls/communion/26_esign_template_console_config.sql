-- =====================================================================
-- 用途: e签宝合同模板免登创建/维护——systemconfig 补配两键
--       (ESignTemplateAction.querySignTemplateCreateUrl/EditUrl + enableSignTemplate,
--        替跳 web.esign.cn 控制台人工登录, 免登链接30分钟有效)
-- 值来源: orgId 实查 e签宝 identity-info(orgName=沈阳数林科技有限责任公司, realnameStatus=1,
--         =appId 5112065795 所属平台自身企业, 创建/编辑模板免企业授权);
--         psnId=数林管理员(董馨童)个人账号ID, 与 esign.autosign.transactor.psnid 同值,
--         2026-11-01 组合实调 sign-template-create-url 返回 code=0 免登链接实证可用
-- 执行前置条件:
--   1) fanglin-esign-8.3.030.jar(含 ESignTemplateService, >=31739B/2026-11-01版)已部署
--   2) WebContent 6 文件(contract.html/contract.js/js/api/data.js/js/data/contract4esign.js/
--      views/data/contract4esignCreate.html/contract4esignEdit.html)已同步
-- 回滚方式: DELETE FROM communion.systemconfig WHERE `key` IN
--   ('esign.template.orgid','esign.template.transactor.psnid') AND company=0;
--   (免登功能随即回到 130190/130191 配置缺失报错, 不影响其他 e签宝流程)
-- 验证语句: 见文件末尾; 页面验证=数据管理→合同模板→添加→厂商选e签宝→点"创建流程模板(免登)"
--   弹出 h5.esign.cn 模板制作页即通(无需登录)
-- 幂等: NOT EXISTS 守卫, 重复执行零影响
-- =====================================================================

-- 键1: 模板归属企业 orgId = 沈阳数林科技有限责任公司
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, comment, company)
SELECT 'esign', 'esign.template.orgid', '0b94fe62e691451e8e342cdea237ae8d', 0,
       'e签宝模板归属企业orgId=沈阳数林科技有限责任公司(appId自身企业免授权)', 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM (SELECT 1 FROM communion.systemconfig
                 WHERE `key` = 'esign.template.orgid' AND company = 0) t
);

-- 键2: 模板维护经办人 psnId = 数林管理员(董馨童), 须有模板操作权限
INSERT INTO communion.systemconfig (`group`, `key`, value, cuid, comment, company)
SELECT 'esign', 'esign.template.transactor.psnid', '5dd502d7d0004efaaf9b2a7a4b14f12d', 0,
       'e签宝模板维护经办人psnId(数林管理员董馨童)', 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM (SELECT 1 FROM communion.systemconfig
                 WHERE `key` = 'esign.template.transactor.psnid' AND company = 0) t
);

-- ===================== 验证语句 =====================
-- 预期 2 行:
SELECT scid, `key`, value, `group`, company
FROM communion.systemconfig
WHERE `key` IN ('esign.template.orgid', 'esign.template.transactor.psnid') AND company = 0;
