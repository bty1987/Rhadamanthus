package com.fanglin.approval.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalDecorationTerminalService;
import com.fanglin.approval.vo.ApprovalDecorationTerminalItemVO;
import com.fanglin.approval.vo.ApprovalDecorationTerminalVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalDecorationTerminalAction extends BaseListAction {

	private static final long serialVersionUID = -1242706845264016950L;

	@Autowired
	private ApprovalDecorationTerminalService approvalDecorationTerminalService;

	private ApprovalVO approval;

	private ApprovalDecorationTerminalVO approvalDecorationTerminal;

	private List<ApprovalDecorationTerminalItemVO> approvalDecorationTerminalItems;

	private String code;

	private String forms;

	@Action(value = "submitApprovalForDecorationTerminal", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForDecorationTerminal() throws FLException {

		approvalDecorationTerminalService.submitApprovalForDecorationTerminal(approval, approvalDecorationTerminal, approvalDecorationTerminalItems, queryUserId(), queryCompany(), code, forms);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalDecorationTerminalVO getApprovalDecorationTerminal() {
		return approvalDecorationTerminal;
	}

	public void setApprovalDecorationTerminal(ApprovalDecorationTerminalVO approvalDecorationTerminal) {
		this.approvalDecorationTerminal = approvalDecorationTerminal;
	}

	public List<ApprovalDecorationTerminalItemVO> getApprovalDecorationTerminalItems() {
		return approvalDecorationTerminalItems;
	}

	public void setApprovalDecorationTerminalItems(List<ApprovalDecorationTerminalItemVO> approvalDecorationTerminalItems) {
		this.approvalDecorationTerminalItems = approvalDecorationTerminalItems;
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
