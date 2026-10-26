package com.fanglin.esign.action;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.action.BaseAction;
import com.fanglin.esign.utils.EsignClient;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

/**
 * e签宝印章自动落章授权。
 *
 * <p>流程模板路线的企业自动落章前置：将企业印章授权给全部成员在指定流程模板上自动使用
 * （POST /v3/seals/org-seals/internal-auth, sealAuthScope.autoSign=true）。
 * 发起后返回《电子印章授权书》签署链接，由企业管理员/法定代表人签署完成即授权生效（长期有效）。
 *
 * <p>参数（页面/调用方提供）：orgId=机构账号ID(印章行 signno)、templateIds=绑定的流程模板ID列表(逗号分隔)；
 * transactorPsnId(授权操作人, 建议企业管理员)从 systemconfig 键 esign.autosign.transactor.psnid 读取；
 * 印章自动选择: 该机构名下 sealBizType=CONTRACT 合同专用章, 回退默认章。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class ESignAutoSignAuthAction extends BaseAction {

	private static final long serialVersionUID = 1L;

	private static final String EP_SEAL_ORG_LIST = "/v3/seals/org-own-seal-list";
	private static final String EP_SEAL_INTERNAL_AUTH = "/v3/seals/org-seals/internal-auth";

	@Autowired
	private EsignClient esignClient;

	@Autowired
	private SystemConfigDao systemConfigDao;

	private String orgId;

	private String templateIds;

	@Action(value = "esignAutoSignAuth", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String esignAutoSignAuth() throws Exception {

		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();

		String transactorPsnId = configValue("esign.autosign.transactor.psnid");

		if (orgId == null || orgId.trim().isEmpty() || templateIds == null || templateIds.trim().isEmpty()) {
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write("{\"errorCode\":1,\"errorMsg\":\"orgId与templateIds必传\"}");
			return null;
		}

		if (transactorPsnId == null || transactorPsnId.trim().isEmpty()) {
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write("{\"errorCode\":1,\"errorMsg\":\"未配置授权操作人(esign.autosign.transactor.psnid)\"}");
			return null;
		}

		String sealId = contractSealId(orgId.trim());

		if (sealId == null) {
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write("{\"errorCode\":1,\"errorMsg\":\"该企业名下无已启用印章\"}");
			return null;
		}

		JSONArray templateArr = new JSONArray();
		for (String tid : templateIds.split(",")) {
			if (!tid.trim().isEmpty()) {
				templateArr.add(tid.trim());
			}
		}

		JSONObject body = new JSONObject()
				.fluentPut("orgId", orgId.trim())
				.fluentPut("sealId", sealId)
				.fluentPut("authorizedPsnIds", new JSONArray().fluentAdd("ALL"))
				.fluentPut("sealRole", "SEAL_USER")
				.fluentPut("transactorPsnId", transactorPsnId.trim())
				.fluentPut("sealAuthScope", new JSONObject()
						.fluentPut("templateIds", templateArr)
						.fluentPut("autoSign", true))
				.fluentPut("longTermEffective", true)
				.fluentPut("authConfirmMethod", 1);

		JSONObject result = esignClient.post(Integer.parseInt(request.getParameter("company") == null ? "0" : request.getParameter("company")), EP_SEAL_INTERNAL_AUTH, body);

		result.put("errorCode", 0);

		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write(result.toJSONString());

		return null;
	}

	/** 企业印章 sealId: sealBizType 合同专用章优先, 回退默认章。 */
	private String contractSealId(String orgId) throws Exception {

		Map<String, String> query = new HashMap<String, String>();
		query.put("orgId", orgId);
		query.put("pageNum", "1");
		query.put("pageSize", "20");

		JSONObject list = esignClient.get(0, EP_SEAL_ORG_LIST, query);

		JSONArray seals = list.getJSONArray("seals");

		String fallback = null;

		for (int i = 0; seals != null && i < seals.size(); i++) {

			JSONObject seal = seals.getJSONObject(i);

			if (seal.getIntValue("sealStatus") != 1) {
				continue;
			}

			if ("CONTRACT".equals(seal.getString("sealBizType"))) {
				return seal.getString("sealId");
			}

			if (fallback == null && seal.getBooleanValue("defaultSealFlag")) {
				fallback = seal.getString("sealId");
			}
		}

		return fallback;
	}

	private String configValue(String key) {

		SystemConfigPO configPO = systemConfigDao.querySystemConfig(key);

		return configPO == null || configPO.getValue() == null || "".equals(configPO.getValue().trim()) ? null : configPO.getValue().trim();
	}

	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	public String getTemplateIds() {
		return templateIds;
	}

	public void setTemplateIds(String templateIds) {
		this.templateIds = templateIds;
	}

}
