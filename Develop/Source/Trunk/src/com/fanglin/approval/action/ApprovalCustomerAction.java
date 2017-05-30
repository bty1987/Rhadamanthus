/**
 * @File Name		: ApprovalCustomerAction.java
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

import com.fanglin.approval.service.ApprovalCustomerService;
import com.fanglin.approval.vo.ApprovalCustomerVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalCustomerAction extends BaseListAction {

	private static final long serialVersionUID = 1374958353504673850L;
	
	@Autowired
	private ApprovalCustomerService approvalCustomerService;
	
	private ApprovalVO approval;
	
	private ApprovalCustomerVO approvalCustomer;
//	提交客户信息修改审批
	@Action(value = "submitApprovalForCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForCustomer() throws FLException{
		
		approvalCustomerService.submitApprovalForCustomer(approval, approvalCustomer, queryUserId());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalCustomerVO getApprovalCustomer() {
		return approvalCustomer;
	}

	public void setApprovalCustomer(ApprovalCustomerVO approvalCustomer) {
		this.approvalCustomer = approvalCustomer;
	}

}
