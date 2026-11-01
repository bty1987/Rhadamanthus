package com.fanglin.esign.action;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.esign.utils.EsignClient;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

/**
 * e签宝流程模板免登维护。
 *
 * <p>合同模板页(data.contract)的e签宝流程模板创建/编辑原跳转 e签宝SaaS控制台(web.esign.cn)需人工登录,
 * 现改走 v3 免登页面链接接口: 服务端以 模板归属企业(orgId)+维护经办人(transactorPsnId) 换取
 * 无需登录的模板制作页链接(有效期30分钟), 创建/编辑完成后 e签宝重定向回站内落点页
 * (views/data/contract4esignCreate/Edit.html, redirectUrl拼接 signTemplateId)完成建档与重新开启。
 *
 * <p>接口(端点经生产网关实测, 2026-11):
 * <ul>
 * <li>获取《创建流程模板》页面链接: POST /v3/sign-templates/sign-template-create-url</li>
 * <li>获取《编辑流程模板》页面链接: POST /v3/sign-templates/{signTemplateId}/sign-template-edit-url,
 * 官方流程要求先停用({@code #EP_ST_DISABLE}), 编辑完成重新开启({@code #EP_ST_ENABLE})</li>
 * </ul>
 *
 * <p>配置(systemconfig, group=esign, 全局): {@code esign.template.orgid}=模板归属企业orgId
 * (即 appId 所属平台自身企业, 免企业授权; 缺失回退 esign.orgid),
 * {@code esign.template.transactor.psnid}=维护经办人psnId(须有模板操作权限, 建议管理员)。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class ESignTemplateAction extends BaseAction {

	private static final long serialVersionUID = 6210070100000200L;

	private Logger logger = LoggerFactory.getLogger(ESignTemplateAction.class);

	private static final String EP_ST_CREATE_URL = "/v3/sign-templates/sign-template-create-url";

	private static final String EP_ST_EDIT_URL = "/v3/sign-templates/%s/sign-template-edit-url";

	private static final String EP_ST_DISABLE = "/v3/sign-templates/disable";

	private static final String EP_ST_ENABLE = "/v3/sign-templates/enable";

	/** 创建/编辑完成后的站内落点页(同源iframe承载, 拦截器所需 authentication 由 parent 桥接提供) */
	private static final String LANDING_CREATE = "/views/data/contract4esignCreate.html";

	private static final String LANDING_EDIT = "/views/data/contract4esignEdit.html";

	@Autowired
	private EsignClient esignClient;

	@Autowired
	private SystemConfigDao systemConfigDao;

	/** 免登页面链接(返回) */
	private String url;

	/** 流程模板ID(入参: 编辑/开启) */
	private String signTemplateId;

	@Action(value = "querySignTemplateCreateUrl", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySignTemplateCreateUrl() throws FLException {

		JSONObject body = new JSONObject()
				.fluentPut("orgId", templateOrgId())
				.fluentPut("transactorPsnId", transactorPsnId())
				.fluentPut("redirectUrl", redirectUrl(LANDING_CREATE));

		url = esignClient.post(0, EP_ST_CREATE_URL, body).getString("signTemplateCreateUrl");

		if (url == null || url.trim().isEmpty()) {
			throw new FLException(130192, "e签宝未返回免登链接");
		}

		return SUCCESS;
	}

	@Action(value = "querySignTemplateEditUrl", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySignTemplateEditUrl() throws FLException {

		if (signTemplateId == null || signTemplateId.trim().isEmpty()) {
			throw new FLException(130193, "流程模板编号不能为空");
		}

		String orgId = templateOrgId();
		String transactorPsnId = transactorPsnId();

		// 官方编辑流程: 先停用再取编辑链接; 已停用等停用异常不阻断, 由 edit-url 兜底校验
		try {
			esignClient.post(0, EP_ST_DISABLE, new JSONObject()
					.fluentPut("signTemplateId", signTemplateId.trim())
					.fluentPut("orgId", orgId)
					.fluentPut("transactorPsnId", transactorPsnId));
		} catch (FLException e) {
			logger.warn("e签宝流程模板停用失败(继续尝试获取编辑链接), signTemplateId={}, {}", signTemplateId, e.getErrorMessage());
		}

		JSONObject body = new JSONObject()
				.fluentPut("orgId", orgId)
				.fluentPut("transactorPsnId", transactorPsnId)
				.fluentPut("redirectUrl", redirectUrl(LANDING_EDIT));

		url = esignClient.post(0, String.format(EP_ST_EDIT_URL, signTemplateId.trim()), body).getString("signTemplateEditUrl");

		if (url == null || url.trim().isEmpty()) {
			throw new FLException(130192, "e签宝未返回免登链接");
		}

		return SUCCESS;
	}

	@Action(value = "enableSignTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String enableSignTemplate() throws FLException {

		if (signTemplateId == null || signTemplateId.trim().isEmpty()) {
			throw new FLException(130193, "流程模板编号不能为空");
		}

		esignClient.post(0, EP_ST_ENABLE, new JSONObject()
				.fluentPut("signTemplateId", signTemplateId.trim())
				.fluentPut("orgId", templateOrgId())
				.fluentPut("transactorPsnId", transactorPsnId()));

		return SUCCESS;
	}

	/** 模板归属企业: esign.template.orgid, 缺失回退 esign.orgid(appId所属自身企业免企业授权) */
	private String templateOrgId() throws FLException {

		String orgId = configValue("esign.template.orgid");

		if (orgId == null) {
			orgId = configValue("esign.orgid");
		}

		if (orgId == null) {
			throw new FLException(130190, "模板归属企业未配置(esign.template.orgid)");
		}

		return orgId;
	}

	/** 模板维护经办人: 须有模板操作权限(管理员/法定代表人默认有), esign.template.transactor.psnid */
	private String transactorPsnId() throws FLException {

		String psnId = configValue("esign.template.transactor.psnid");

		if (psnId == null) {
			throw new FLException(130191, "模板维护经办人未配置(esign.template.transactor.psnid)");
		}

		return psnId;
	}

	/** 站内落点页绝对地址: 与当前会话同源(iframe回跳带登录态所需的 parent 桥接同源可达) */
	private String redirectUrl(String landing) {

		HttpServletRequest request = ServletActionContext.getRequest();

		StringBuilder base = new StringBuilder();

		base.append(request.getScheme()).append("://").append(request.getServerName());

		int port = request.getServerPort();

		if (port != 80 && port != 443) {
			base.append(":").append(port);
		}

		base.append(request.getContextPath());

		return base.append(landing).toString();
	}

	private String configValue(String key) {

		SystemConfigPO configPO = systemConfigDao.querySystemConfig(key);

		return configPO == null || configPO.getValue() == null || "".equals(configPO.getValue().trim()) ? null : configPO.getValue().trim();
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getSignTemplateId() {
		return signTemplateId;
	}

	public void setSignTemplateId(String signTemplateId) {
		this.signTemplateId = signTemplateId;
	}

}
