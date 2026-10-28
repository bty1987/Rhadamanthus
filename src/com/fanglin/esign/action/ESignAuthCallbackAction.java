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

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.core.action.BaseAction;
import com.fanglin.data.common.dao.SignetDao;
import com.fanglin.data.po.SignetPO;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.elecsign.enums.ElecsignProvider;
import com.fanglin.elecsign.router.ElecsignRouter;
import com.fanglin.utils.DateUtil;

/**
 * e签宝回调入口（认证 + 签署流完结）。
 * 
 * <p>
 * org-auth-url 发起认证时 notifyUrl 指向本接口（test-erp/生产同路径： {isv}/esignAuthCallback.do）。e签宝在认证流状态变更时回调， 按 authFlowId（认证发起时存于印章 token）反查印章， 认证通过则走 identity-info 取 orgId 并自动推进状态 2(已认证)→3(确认)， 替代人工"确认认证"步骤（人工确认保留为兜底）。
 * 
 * <p>
 * 签署流完结回调（action=SIGN_FLOW_COMPLETE，参数 signFlowId）同样落在本接口： 双方签完推合同"已签"状态（等价人工 affix，人工确认保留为兜底）。 注意：签署流回调以应用控制台配置的回调地址推送为主（建流时 signFlowConfig.notifyUrl 一并下发）， 若回调始终未达，检查 e签宝控制台应用回调地址是否指向本接口。
 * 
 * <p>
 * 回调报文（实测结构）：{ action: "SIGN_FLOW_PASS" 等, authFlowId: "RN-xxx", ... }， 本接口响应 200 即应答成功，业务失败不重试（人工确认兜底）。
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
	private com.fanglin.elecsign.dao.ElecsignAuthDao elecsignAuthDao;

	@Autowired
	private ElecsignRouter elecsignRouter;

	@Autowired
	private DecorationContractDao decorationContractDao;

	@Action(value = "esignAuthCallback", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String esignAuthCallback() throws Exception {

		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();

		String authAction = request.getParameter("action");

		// 签署流完结回调: 参数是 signFlowId 而非 authFlowId, 先于认证分支分流处理
		if ("SIGN_FLOW_COMPLETE".equals(authAction)) {
			signFlowComplete(request, response);
			return null;
		}

		String flowId = request.getParameter("authFlowId");

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

		// 个人认证回调: psnId 在 psnInfo 里, 按 token(authFlowId) 反查认证行写回 signno + 状态推进;
		// 行查不到(未迁入/新表未建)回退 customer.token 反查——双写保持 customer 兼容视图
		String psnId = request.getParameter("psnId");

		if (psnId != null && !psnId.trim().isEmpty()) {

			com.fanglin.elecsign.po.ElecsignAuthPO authPO = null;

			try {
				authPO = elecsignAuthDao.queryElecsignAuthByToken(flowId);
			} catch (Exception e) {
				// 兜底: 新表不可用, 走 customer 回查
			}

			if (authPO != null) {
				authPO.setSignno(psnId);
				authPO.setStatus(com.fanglin.elecsign.po.ElecsignAuthPO.STATUS_AUTH_INT);

				try {
					elecsignAuthDao.update(authPO);

					// customer 双写(最近一次认证视图), 行侧为准; get须Long装箱(PO主键Long,int装箱Integer报wrong type)
					CustomerPO synced = customerDao.get((long) authPO.getCid());
					if (synced != null) {
						synced.setProvider((short) 2);
						synced.setSignno(psnId);
						if (synced.getStatus() == CustomerPO.STATUS_INIT_INT) synced.setStatus(CustomerPO.STATUS_AUTH_INT);
						customerDao.update(synced);
					}

					response.getWriter().write("success");
					return null;
				} catch (Exception e) {
					// 行更新失败落 customer 兜底
				}
			}

			CustomerPO customerPO = customerDao.queryCustomerByToken(flowId);

			if (customerPO != null) {
				customerPO.setSignno(psnId);
				// 回调必然来自e签宝, provider幂等兜底(防数据修正后命名空间错位)
				customerPO.setProvider((short) 2);
				customerPO.setStatus(CustomerPO.STATUS_AUTH_INT);
				customerDao.update(customerPO);
			}
		}

		response.getWriter().write("success");
		return null;
	}

	/**
	 * 签署流完结回调：按流号反查装修合同，双方签完(signFlowStatus=2)推"已签"状态 （等价人工 affixDecorationContract，不落 signner——系统驱动无操作人；人工确认保留为兜底）。 撤销/过期/拒签(3/5/7)不动 ERP 状态，退单等异常走人工处理。
	 */
	private void signFlowComplete(HttpServletRequest request, HttpServletResponse response) throws Exception {

		String signFlowId = request.getParameter("signFlowId");

		if (signFlowId == null || signFlowId.trim().isEmpty()) {
			response.getWriter().write("no signFlowId");
			return;
		}

		// 完结子状态: 2完成/3撤销/5过期/7拒签; 参数缺失按完成处理(action 已表明是完结回调)
		String signFlowStatus = request.getParameter("signFlowStatus");

		if (signFlowStatus != null && !"2".equals(signFlowStatus.trim())) {
			response.getWriter().write("skip flowStatus=" + signFlowStatus);
			return;
		}

		try {
			java.util.List<DecorationContractPO> contractPOs = decorationContractDao.queryDecorationContractByFlowId(ElecsignProvider.ESIGN.code(), signFlowId);

			if (contractPOs == null || contractPOs.isEmpty()) {
				response.getWriter().write("contract not found");
				return;
			}

			DecorationContractPO contractPO = contractPOs.get(0);

			if (contractPO.getStatus() == DecorationContractPO.STATUS_VALID_INT) {
				contractPO.setStatus(DecorationContractPO.STATUS_SIGN_INT);
				contractPO.setCussignTime(DateUtil.getDateToTimestamp(new java.util.Date()));
				decorationContractDao.update(contractPO);
			}
		} catch (Exception e) {
			// 回调内失败不阻断应答(200即应答成功), 人工确认兜底
		}

		response.getWriter().write("success");
	}

}
