package com.fanglin.esign.action;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.esign.service.ESignTemplateService;

/**
 * e签宝流程模板免登维护。
 *
 * <p>合同模板页(data.contract)的e签宝流程模板创建/编辑原跳转 e签宝SaaS控制台(web.esign.cn)需人工登录,
 * 现改走 v3 免登页面链接接口: 服务端以 模板归属企业(orgId)+维护经办人(transactorPsnId) 换取
 * 无需登录的模板制作页链接(有效期30分钟), 创建/编辑完成后 e签宝重定向回站内落点页
 * (views/data/contract4esignCreate/Edit.html, redirectUrl拼接 signTemplateId)完成建档与重新开启。
 *
 * <p>配置读取与端点调用在 {@link ESignTemplateService}(@Transactional, Action 层无事务 session 不得直调 DAO);
 * 配置键与端点清单见该服务实现类注释。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class ESignTemplateAction extends BaseAction {

	private static final long serialVersionUID = 6210070100000200L;

	/** 创建/编辑完成后的站内落点页(同源iframe承载, 拦截器所需 authentication 由 parent 桥接提供) */
	private static final String LANDING_CREATE = "/views/data/contract4esignCreate.html";

	private static final String LANDING_EDIT = "/views/data/contract4esignEdit.html";

	@Autowired
	private ESignTemplateService esignTemplateService;

	/** 免登页面链接(返回) */
	private String url;

	/** 流程模板ID(入参: 编辑/开启) */
	private String signTemplateId;

	@Action(value = "querySignTemplateCreateUrl", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySignTemplateCreateUrl() throws FLException {

		url = esignTemplateService.querySignTemplateCreateUrl(redirectUrl(LANDING_CREATE));

		return SUCCESS;
	}

	@Action(value = "querySignTemplateEditUrl", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySignTemplateEditUrl() throws FLException {

		if (signTemplateId == null || signTemplateId.trim().isEmpty()) {
			throw new FLException(130193, "流程模板编号不能为空");
		}

		url = esignTemplateService.querySignTemplateEditUrl(signTemplateId.trim(), redirectUrl(LANDING_EDIT));

		return SUCCESS;
	}

	@Action(value = "enableSignTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String enableSignTemplate() throws FLException {

		if (signTemplateId == null || signTemplateId.trim().isEmpty()) {
			throw new FLException(130193, "流程模板编号不能为空");
		}

		esignTemplateService.enableSignTemplate(signTemplateId.trim());

		return SUCCESS;
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
