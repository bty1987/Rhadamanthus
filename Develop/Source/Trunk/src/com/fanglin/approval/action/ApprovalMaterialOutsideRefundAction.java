/**
 * @File Name		: ApprovalMaterialOutsideRefundAction.java
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

import com.fanglin.approval.service.ApprovalMaterialOutsideRefundService;
import com.fanglin.approval.vo.ApprovalMaterialOutsideRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalMaterialOutsideRefundAction extends BaseListAction {

	private static final long serialVersionUID = 5386616940276455441L;
	
	@Autowired
	private ApprovalMaterialOutsideRefundService approvalMaterialOutsideRefundService;
	
	private ApprovalVO approval;
	
	private ApprovalMaterialOutsideRefundVO approvalMaterialOutsideRefund;
	
	@Action(value = "submitApprovalForMaterialOutsideRefund", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForMaterialOutsideRefund() throws FLException{
		
		approvalMaterialOutsideRefundService.submitApprovalForMaterialOutsideRefund(approval, approvalMaterialOutsideRefund, getUserId());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalMaterialOutsideRefundVO getApprovalMaterialOutsideRefund() {
		return approvalMaterialOutsideRefund;
	}

	public void setApprovalMaterialOutsideRefund(
			ApprovalMaterialOutsideRefundVO approvalMaterialOutsideRefund) {
		this.approvalMaterialOutsideRefund = approvalMaterialOutsideRefund;
	}

}
