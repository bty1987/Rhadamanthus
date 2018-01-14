/**
 * @File Name		: ApprovalDecorationCustomerAction.java
 * @Package   	: com.fanglin.approval.action
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalDecorationCustomerService;
import com.fanglin.approval.vo.ApprovalDecorationCustomerVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalDecorationCustomerAction extends BaseListAction {

	private static final long serialVersionUID = 1374958353504673850L;
	
	@Autowired
	private ApprovalDecorationCustomerService approvalDecorationCustomerService;
	
	private ApprovalVO approval;
	
	private ApprovalDecorationCustomerVO approvalDecorationCustomer;
//	提交客户信息修改审批
	@Action(value = "submitApprovalForDecorationCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForDecorationCustomer() throws FLException{
		
		approvalDecorationCustomerService.submitApprovalForCustomer(approval, approvalDecorationCustomer, queryUserId(),queryCompany());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalDecorationCustomerVO getApprovalDecorationCustomer() {
		return approvalDecorationCustomer;
	}

	public void setApprovalDecorationCustomer(ApprovalDecorationCustomerVO approvalDecorationCustomer) {
		this.approvalDecorationCustomer = approvalDecorationCustomer;
	}

}
