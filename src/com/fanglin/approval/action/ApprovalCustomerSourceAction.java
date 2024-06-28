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

import com.fanglin.approval.service.ApprovalCustomerSourceService;
import com.fanglin.approval.vo.ApprovalCustomerSourceVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalCustomerSourceAction extends BaseListAction {

	private static final long serialVersionUID = -549271005174823538L;

	@Autowired
	private ApprovalCustomerSourceService approvalCustomerSourceService;

	private ApprovalVO approval;

	private ApprovalCustomerSourceVO approvalCustomerSource;

	@Action(value = "queryApprovalCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalForCustomerSource() throws FLException {

		approvalCustomerSource = approvalCustomerSourceService.queryApprovalCustomerSource(approval);

		return SUCCESS;
	}

	@Action(value = "submitApprovalForCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForCustomerSource() throws FLException {

		approvalCustomerSourceService.submitApprovalForCustomerSource(approval, approvalCustomerSource, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalCustomerSourceVO getApprovalCustomerSource() {
		return approvalCustomerSource;
	}

	public void setApprovalCustomerSource(ApprovalCustomerSourceVO approvalCustomerSource) {
		this.approvalCustomerSource = approvalCustomerSource;
	}

}
