package com.fanglin.approval.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalFunctionService;
import com.fanglin.approval.vo.ApprovalFunctionVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalFunctionAction extends BaseListAction {

	private static final long serialVersionUID = 3639201153300872503L;

	@Autowired
	private ApprovalFunctionService approvalFunctionService;

	private ApprovalFunctionVO approvalFunction;

	private List<ApprovalFunctionVO> approvalFunctions;

	@Action(value = "queryApprovalFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalFunction() throws FLException {

		approvalFunctions = approvalFunctionService.queryApprovalFunction(approvalFunction);

		return SUCCESS;
	}

	public ApprovalFunctionVO getApprovalFunction() {
		return approvalFunction;
	}

	public void setApprovalFunction(ApprovalFunctionVO approvalFunction) {
		this.approvalFunction = approvalFunction;
	}

	public List<ApprovalFunctionVO> getApprovalFunctions() {
		return approvalFunctions;
	}

	public void setApprovalFunctions(List<ApprovalFunctionVO> approvalFunctions) {
		this.approvalFunctions = approvalFunctions;
	}

}
