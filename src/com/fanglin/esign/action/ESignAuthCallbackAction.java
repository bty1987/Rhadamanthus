package com.fanglin.esign.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.core.action.BaseAction;
import com.fanglin.data.common.dao.SignetDao;
import com.fanglin.data.po.SignetPO;
import com.fanglin.elecsign.router.ElecsignRouter;
import com.fanglin.utils.SystemConfig;

/**
 * e签宝认证完成回调。
 *
 * <p>org-auth-url 发起认证时 notifyUrl 指向本接口（test-erp/生产同路径：
 * {isv}/esignAuthCallback.do）。e签宝在认证流状态变更时回调，
 * 按 authFlowId（认证发起时存于印章 token）反查印章，
 * 认证通过则走 identity-info 取 orgId 并自动推进状态 2(已认证)→3(确认)，
 * 替代人工"确认认证"步骤（人工确认保留为兜底）。
 *
 * <p>回调报文（实测结构）：{ action: "SIGN_FLOW_PASS" 等, authFlowId: "RN-xxx", ... }，
 * 本接口响应 200 即应答成功，业务失败不重试（人工确认兜底）。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class ESignAuthCallbackAction extends BaseAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private SignetDao signetDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private ElecsignRouter elecsignRouter;

	@Action(value = "esignAuthCallback", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String esignAuthCallback() throws Exception {

		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();

		String flowId = request.getParameter("authFlowId");
		String authAction = request.getParameter("action");

		if (flowId == null || flowId.trim().isEmpty()) {
			response.getWriter().write("no authFlowId");
			return null;
		}

		SignetPO signetPO = signetDao.querySignetByToken(flowId);

		if (signetPO == null) {
			response.getWriter().write("signet not found");
			return null;
		}

		// 认证通过
		if ("SIGN_FLOW_PASS".equals(authAction)) {
			try {
				// 机构分支: identity-info 取 orgId 写回 + 状态推进(对齐人工 confirmSignet)
				elecsignRouter.route(signetPO.getProvider(), signetPO.getCompany()).company(signetPO);
				signetPO.setStatus(SignetPO.STATUS_CONFIRM_INT);
				signetDao.update(signetPO);
			} catch (Exception e) {
				// 回调内失败不阻断应答, 人工确认兜底
			}
		}

		// 个人认证回调: psnId 在 psnInfo 里, 按 token(authFlowId) 反查客户写回 signno + 状态推进
		String psnId = request.getParameter("psnId");

		if (psnId != null && !psnId.trim().isEmpty()) {
			com.fanglin.communion.po.CustomerPO customerPO = customerDao.queryCustomerByToken(flowId);

			if (customerPO != null) {
				customerPO.setSignno(psnId);
				customerPO.setStatus(CustomerPO.STATUS_AUTH_INT);
				customerDao.update(customerPO);
			}
		}

		response.getWriter().write("success");
		return null;
	}

}
