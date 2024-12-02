package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.service.ApprovalFunctionRightService;
import com.fanglin.right.vo.ApprovalFunctionRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalFunctionRightAction extends BaseListAction {

	private static final long serialVersionUID = 2597130375439493479L;

	@Autowired
	private ApprovalFunctionRightService approvalFunctionRightService;

	private List<ApprovalFunctionRightVO> approvalFunctionRights;

	private ApprovalFunctionRightVO approvalFunctionRight;

	private List<Long> cfids;

	@Action(value = "queryApprovalFunctionRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalFunctionRight() throws FLException {

		approvalFunctionRights = approvalFunctionRightService.queryApprovalFunctionRight(approvalFunctionRight);

		return SUCCESS;
	}

	@Action(value = "updateApprovalFunctionRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateApprovalFunctionRight() throws FLException {

		approvalFunctionRightService.updateApprovalFunctionRight(approvalFunctionRight, cfids, queryCompany());

		return SUCCESS;
	}

	public List<ApprovalFunctionRightVO> getApprovalFunctionRights() {
		return approvalFunctionRights;
	}

	public void setApprovalFunctionRights(List<ApprovalFunctionRightVO> approvalFunctionRights) {
		this.approvalFunctionRights = approvalFunctionRights;
	}

	public ApprovalFunctionRightVO getApprovalFunctionRight() {
		return approvalFunctionRight;
	}

	public void setApprovalFunctionRight(ApprovalFunctionRightVO approvalFunctionRight) {
		this.approvalFunctionRight = approvalFunctionRight;
	}

	public List<Long> getCfids() {
		return cfids;
	}

	public void setCfids(List<Long> cfids) {
		this.cfids = cfids;
	}

}
