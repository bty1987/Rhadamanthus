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
import com.fanglin.material.vo.MaterialSubOrderItemVO;

/**
 * 审批材料退款(用于主材退货审批)
 * @author lenovo
 *
 */
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
	
	private List<MaterialSubOrderItemVO> materialSubOrderItems;
	
	// 获取主材退货审批项信息
	@Action(value = "queryApprovalMaterialRefundItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalMaterialRefundItem() throws FLException{
		
		approvalMaterialRefundItems = approvalMaterialRefundService.queryApprovalMaterialRefundItem(approval);
		
		return SUCCESS;
	}
	
	// 提交主材退货审批
	@Action(value = "submitApprovalForMaterialRefund", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForMaterialRefund() throws FLException{
		
		approvalMaterialRefundService.submitApprovalForMaterialRefund(approval, approvalMaterialRefund, approvalMaterialRefundItems, queryUserId(),queryCompany());
		
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

	public List<MaterialSubOrderItemVO> getMaterialSubOrderItems() {
		return materialSubOrderItems;
	}

	public void setMaterialSubOrderItems(
			List<MaterialSubOrderItemVO> materialSubOrderItems) {
		this.materialSubOrderItems = materialSubOrderItems;
	}

	

}
