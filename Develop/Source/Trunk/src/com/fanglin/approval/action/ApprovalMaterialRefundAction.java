/**
 * @File Name		: ApprovalMaterialRefundAction.java
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

import com.fanglin.approval.service.ApprovalMaterialRefundService;
import com.fanglin.approval.vo.ApprovalMaterialRefundItemVO;
import com.fanglin.approval.vo.ApprovalMaterialRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalMaterialRefundAction extends BaseListAction {

	private static final long serialVersionUID = -2586982934676604057L;
	
	@Autowired
	private ApprovalMaterialRefundService approvalMaterialRefundService;
	
	private ApprovalVO approval;
	
	private ApprovalMaterialRefundVO approvalMaterialRefund;
	
	private List<ApprovalMaterialRefundItemVO> approvalMaterialRefundItems;
	
	@Action(value = "submitApprovalForMaterialRefund", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForMaterialRefund() throws FLException{
		
		approvalMaterialRefundService.submitApprovalForMaterialRefund(approval, approvalMaterialRefund, approvalMaterialRefundItems, queryUserId());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalMaterialRefundVO getApprovalMaterialRefund() {
		return approvalMaterialRefund;
	}

	public void setApprovalMaterialRefund(
			ApprovalMaterialRefundVO approvalMaterialRefund) {
		this.approvalMaterialRefund = approvalMaterialRefund;
	}

	public List<ApprovalMaterialRefundItemVO> getApprovalMaterialRefundItems() {
		return approvalMaterialRefundItems;
	}

	public void setApprovalMaterialRefundItems(
			List<ApprovalMaterialRefundItemVO> approvalMaterialRefundItems) {
		this.approvalMaterialRefundItems = approvalMaterialRefundItems;
	}

}
