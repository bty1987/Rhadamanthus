/**
 * @File Name		: ApprovalProtationPreferAction.java
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

import com.fanglin.approval.service.ApprovalProtationPreferService;
import com.fanglin.approval.vo.ApprovalProtationPreferVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.ProtationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalProtationPreferAction extends BaseListAction {

	private static final long serialVersionUID = -6930218639120369013L;

	@Autowired
	private ApprovalProtationPreferService approvalProtationPreferService;

	private ApprovalVO approval;

	private ApprovalProtationPreferVO approvalProtationPrefer;

	private ProtationVO protation;

	private String code;

	private String forms;

	@Action(value = "submitApprovalForProtationPrefer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForProtationPrefer() throws FLException {

		approvalProtationPreferService.submitApprovalForProtationPrefer(approval, approvalProtationPrefer, protation, queryUserId(), queryCompany(), code, forms);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalProtationPreferVO getApprovalProtationPrefer() {
		return approvalProtationPrefer;
	}

	public void setApprovalProtationPrefer(ApprovalProtationPreferVO approvalProtationPrefer) {
		this.approvalProtationPrefer = approvalProtationPrefer;
	}

	public ProtationVO getProtation() {
		return protation;
	}

	public void setProtation(ProtationVO protation) {
		this.protation = protation;
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
