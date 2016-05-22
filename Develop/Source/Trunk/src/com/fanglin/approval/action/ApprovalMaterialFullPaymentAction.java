/**
 * @File Name		: ApprovalMaterialFullPaymentAction.java
 * @Package   	: com.fanglin.approval.action
 * @Version		: 1.0
 * @Date			: 2015-11-16
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

import com.fanglin.approval.service.ApprovalMaterialFullPaymentService;
import com.fanglin.approval.vo.ApprovalMaterialFullPaymentVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalMaterialFullPaymentAction extends BaseListAction {

	private static final long serialVersionUID = -318203606952543380L;
	
	@Autowired
	private ApprovalMaterialFullPaymentService approvalMaterialFullPaymentService;
	
	private ApprovalVO approval;
	
	private ApprovalMaterialFullPaymentVO approvalMaterialFullPayment;
	
	@Action(value = "submitApprovalForMaterialFullPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForMaterialFullPayment() throws FLException{
		
		approvalMaterialFullPaymentService.submitApprovalForDecorationRefund(approval, approvalMaterialFullPayment, getUserId());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalMaterialFullPaymentVO getApprovalMaterialFullPayment() {
		return approvalMaterialFullPayment;
	}

	public void setApprovalMaterialFullPayment(
			ApprovalMaterialFullPaymentVO approvalMaterialFullPayment) {
		this.approvalMaterialFullPayment = approvalMaterialFullPayment;
	}

}
