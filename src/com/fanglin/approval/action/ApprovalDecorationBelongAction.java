/**
 * @File Name		: ApprovalDecorationBelongAction.java
 * @Package   	: com.fanglin.approval.action
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalDecorationBelongService;
import com.fanglin.approval.vo.ApprovalDecorationBelongItemVO;
import com.fanglin.approval.vo.ApprovalDecorationBelongVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalDecorationBelongAction extends BaseListAction {

	private static final long serialVersionUID = -6930218639120369013L;

	@Autowired
	private ApprovalDecorationBelongService approvalDecorationBelongService;

	private ApprovalVO approval;

	private ApprovalDecorationBelongVO approvalDecorationBelong;

	private List<ApprovalDecorationBelongItemVO> approvalDecorationBelongItems;

	private String code;

	private String forms;

	@Action(value = "submitApprovalForDecorationBelong", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForDecorationBelong() throws FLException {

		approvalDecorationBelongService.submitApprovalForDecorationBelong(approval, approvalDecorationBelong, approvalDecorationBelongItems, queryUserId(), queryCompany(), code, forms);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalDecorationBelongVO getApprovalDecorationBelong() {
		return approvalDecorationBelong;
	}

	public void setApprovalDecorationBelong(ApprovalDecorationBelongVO approvalDecorationBelong) {
		this.approvalDecorationBelong = approvalDecorationBelong;
	}

	public List<ApprovalDecorationBelongItemVO> getApprovalDecorationBelongItems() {
		return approvalDecorationBelongItems;
	}

	public void setApprovalDecorationBelongItems(List<ApprovalDecorationBelongItemVO> approvalDecorationBelongItems) {
		this.approvalDecorationBelongItems = approvalDecorationBelongItems;
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
