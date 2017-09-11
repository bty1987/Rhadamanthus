package com.fanglin.approval.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalSalesRefundService;
import com.fanglin.approval.vo.ApprovalSalesRefundItemVO;
import com.fanglin.approval.vo.ApprovalSalesRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.SalesItemVO;




@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalSalesRefundAction extends BaseListAction {

	private static final long serialVersionUID = -3887295167120478138L;

	@Autowired
	private ApprovalSalesRefundService approvalSalesRefundService;

	private ApprovalVO approval;

	private ApprovalSalesRefundVO approvalSalesRefund;

	private List<ApprovalSalesRefundItemVO> approvalSalesRefundItem;

	private List<SalesItemVO> salesItems;

	@Action(value = "queryApprovalSalesRefundItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryApprovalSalesRefundItem() throws FLException {

		approvalSalesRefundItem = approvalSalesRefundService.queryApprovalSalesRefundItem(approval);

		return SUCCESS;
	};

	@Action(value = "submitApprovalForSalesRefund", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String submitApprovalForSalesRefund() throws FLException {

		approvalSalesRefundService.submitApprovalForSalesRefund(approval,approvalSalesRefund, approvalSalesRefundItem, queryUserId(),queryCompany());

		return SUCCESS;

	}

	public ApprovalSalesRefundVO getApprovalSalesRefund() {
		return approvalSalesRefund;
	}

	public void setApprovalSalesRefund(ApprovalSalesRefundVO approvalSalesRefund) {
		this.approvalSalesRefund = approvalSalesRefund;
	}

	public List<ApprovalSalesRefundItemVO> getApprovalSalesRefundItem() {
		return approvalSalesRefundItem;
	}

	public void setApprovalSalesRefundItem(
			List<ApprovalSalesRefundItemVO> approvalSalesRefundItem) {
		this.approvalSalesRefundItem = approvalSalesRefundItem;
	}

	public List<SalesItemVO> getSalesItems() {
		return salesItems;
	}

	public void setSalesItems(List<SalesItemVO> salesItems) {
		this.salesItems = salesItems;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

}
