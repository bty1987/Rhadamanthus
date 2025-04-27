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

import com.fanglin.approval.service.ApprovalCustomerChanceService;
import com.fanglin.approval.vo.ApprovalCustomerChanceVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalCustomerChanceAction extends BaseListAction {

	private static final long serialVersionUID = -549271005174823538L;

	@Autowired
	private ApprovalCustomerChanceService approvalCustomerChanceService;

	private ApprovalVO approval;

	private ApprovalCustomerChanceVO approvalCustomerChance;

	@Action(value = "queryApprovalCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalCustomerChance() throws FLException {

		approvalCustomerChance = approvalCustomerChanceService.queryApprovalCustomerChance(approval);

		return SUCCESS;
	}

	@Action(value = "submitApprovalForCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForCustomerChance() throws FLException {

		approvalCustomerChanceService.submitApprovalForCustomerChance(approval, approvalCustomerChance, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "submitApprovalForCustomerChanceToDisabled", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForCustomerChanceToDisabled() throws FLException {

		approvalCustomerChanceService.submitApprovalForCustomerChanceToDisabled(approval, approvalCustomerChance, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalCustomerChanceVO getApprovalCustomerChance() {
		return approvalCustomerChance;
	}

	public void setApprovalCustomerChance(ApprovalCustomerChanceVO approvalCustomerChance) {
		this.approvalCustomerChance = approvalCustomerChance;
	}

}
