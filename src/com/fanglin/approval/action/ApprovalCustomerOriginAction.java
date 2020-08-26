/**
 * @File Name		: ApprovalAction.java
 * @Package   	: com.fanglin.approval.action
 * @Version		: 1.0
 * @Date			: 2015-10-25
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

import com.fanglin.approval.service.ApprovalCustomerOriginService;
import com.fanglin.approval.vo.ApprovalCustomerOriginVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalCustomerOriginAction extends BaseListAction {

	private static final long serialVersionUID = -549271005174823538L;

	@Autowired
	private ApprovalCustomerOriginService approvalCustomerOriginService;

	private ApprovalVO approval;

	private ApprovalCustomerOriginVO approvalCustomerOrigin;

	@Action(value = "queryApprovalCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalForCustomerOrigin() throws FLException {

		approvalCustomerOrigin = approvalCustomerOriginService.queryApprovalCustomerOrigin(approval);

		return SUCCESS;
	}

	@Action(value = "submitApprovalForCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForCustomerOrigin() throws FLException {

		approvalCustomerOriginService.submitApprovalForCustomerOrigin(approval, approvalCustomerOrigin, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalCustomerOriginVO getApprovalCustomerOrigin() {
		return approvalCustomerOrigin;
	}

	public void setApprovalCustomerOrigin(ApprovalCustomerOriginVO approvalCustomerOrigin) {
		this.approvalCustomerOrigin = approvalCustomerOrigin;
	}

}
