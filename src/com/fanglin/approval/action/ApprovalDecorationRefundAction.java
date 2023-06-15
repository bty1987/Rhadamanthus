/**
 * @File Name		: ApprovalDecorationRefundAction.java
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

import com.fanglin.approval.service.ApprovalDecorationRefundService;
import com.fanglin.approval.vo.ApprovalDecorationRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalDecorationRefundAction extends BaseListAction {

	private static final long serialVersionUID = -1295407298987714951L;

	@Autowired
	private ApprovalDecorationRefundService approvalDecorationRefundService;

	private ApprovalVO approval;

	private ApprovalDecorationRefundVO approvalDecorationRefund;

	private String code;

	private String forms;

	@Action(value = "submitApprovalForDecorationRefund", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForDecorationRefund() throws FLException {

		approvalDecorationRefundService.submitApprovalForDecorationRefund(approval, approvalDecorationRefund, queryUserId(), queryCompany(), code, forms);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalDecorationRefundVO getApprovalDecorationRefund() {
		return approvalDecorationRefund;
	}

	public void setApprovalDecorationRefund(ApprovalDecorationRefundVO approvalDecorationRefund) {
		this.approvalDecorationRefund = approvalDecorationRefund;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getForms() {
		return forms;
	}

	public void setForms(String forms) {
		this.forms = forms;
	}

}
