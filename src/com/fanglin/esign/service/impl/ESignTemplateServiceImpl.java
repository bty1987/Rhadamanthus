package com.fanglin.esign.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.esign.service.ESignTemplateService;
import com.fanglin.esign.utils.EsignClient;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

/**
 * e签宝流程模板免登维护 Service 实现。
 *
 * <p>端点(生产网关实测, 2026-11): 创建/编辑免登链接=sign-template-create-url 与
 * {signTemplateId}/sign-template-edit-url(响应"无需登录,有效期30分钟"); 停用/开启=body 式
 * sign-templates/disable 与 enable(path 式 /{id}/disable|enable 已实测 404 排除)。
 *
 * <p>配置(systemconfig, group=esign, 全局): esign.template.orgid=模板归属企业 orgId
 * (=appId 所属平台自身企业, 免企业授权; 缺失回退 esign.orgid),
 * esign.template.transactor.psnid=维护经办人 psnId(须模板操作权限, 建议管理员)。
 */
@Service("esignTemplateService")
public class ESignTemplateServiceImpl implements ESignTemplateService {

	private Logger logger = LoggerFactory.getLogger(ESignTemplateServiceImpl.class);

	private static final String EP_ST_CREATE_URL = "/v3/sign-templates/sign-template-create-url";

	private static final String EP_ST_EDIT_URL = "/v3/sign-templates/%s/sign-template-edit-url";

	private static final String EP_ST_DISABLE = "/v3/sign-templates/disable";

	private static final String EP_ST_ENABLE = "/v3/sign-templates/enable";

	@Autowired
	private EsignClient esignClient;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String querySignTemplateCreateUrl(String redirectUrl) throws FLException {

		JSONObject body = new JSONObject()
				.fluentPut("orgId", templateOrgId())
				.fluentPut("transactorPsnId", transactorPsnId())
				.fluentPut("redirectUrl", redirectUrl);

		String url = esignClient.post(0, EP_ST_CREATE_URL, body).getString("signTemplateCreateUrl");

		if (url == null || url.trim().isEmpty()) {
			throw new FLException(130192, "e签宝未返回免登链接");
		}

		return url;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String querySignTemplateEditUrl(String signTemplateId, String redirectUrl) throws FLException {

		String orgId = templateOrgId();
		String transactorPsnId = transactorPsnId();

		// 官方编辑流程: 先停用再取编辑链接; 已停用等停用异常不阻断, 由 edit-url 兜底校验
		try {
			esignClient.post(0, EP_ST_DISABLE, new JSONObject()
					.fluentPut("signTemplateId", signTemplateId)
					.fluentPut("orgId", orgId)
					.fluentPut("transactorPsnId", transactorPsnId));
		} catch (FLException e) {
			logger.warn("e签宝流程模板停用失败(继续尝试获取编辑链接), signTemplateId={}, {}", signTemplateId, e.getErrorMessage());
		}

		JSONObject body = new JSONObject()
				.fluentPut("orgId", orgId)
				.fluentPut("transactorPsnId", transactorPsnId)
				.fluentPut("redirectUrl", redirectUrl);

		String url = esignClient.post(0, String.format(EP_ST_EDIT_URL, signTemplateId), body).getString("signTemplateEditUrl");

		if (url == null || url.trim().isEmpty()) {
			throw new FLException(130192, "e签宝未返回免登链接");
		}

		return url;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void enableSignTemplate(String signTemplateId) throws FLException {

		esignClient.post(0, EP_ST_ENABLE, new JSONObject()
				.fluentPut("signTemplateId", signTemplateId)
				.fluentPut("orgId", templateOrgId())
				.fluentPut("transactorPsnId", transactorPsnId()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String queryConfigValue(String key) throws FLException {

		SystemConfigPO configPO = systemConfigDao.querySystemConfig(key);

		return configPO == null || configPO.getValue() == null || "".equals(configPO.getValue().trim()) ? null : configPO.getValue().trim();
	}

	/** 模板归属企业: esign.template.orgid, 缺失回退 esign.orgid(appId所属自身企业免企业授权) */
	private String templateOrgId() throws FLException {

		String orgId = queryConfigValue("esign.template.orgid");

		if (orgId == null) {
			orgId = queryConfigValue("esign.orgid");
		}

		if (orgId == null) {
			throw new FLException(130190, "模板归属企业未配置(esign.template.orgid)");
		}

		return orgId;
	}

	/** 模板维护经办人: 须有模板操作权限(管理员/法定代表人默认有), esign.template.transactor.psnid */
	private String transactorPsnId() throws FLException {

		String psnId = queryConfigValue("esign.template.transactor.psnid");

		if (psnId == null) {
			throw new FLException(130191, "模板维护经办人未配置(esign.template.transactor.psnid)");
		}

		return psnId;
	}

}
