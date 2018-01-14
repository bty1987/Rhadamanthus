/**
 * @File Name		: ApprovalQuotationDiscountAction.java
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

import com.fanglin.approval.service.ApprovalQuotationDiscountService;
import com.fanglin.approval.vo.ApprovalQuotationDiscountVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalQuotationDiscountAction extends BaseListAction {

	private static final long serialVersionUID = -2161074768558759346L;
	
	@Autowired
	private ApprovalQuotationDiscountService approvalQuotationDiscountService;
	
	private ApprovalVO approval;
	
	private ApprovalQuotationDiscountVO approvalQuotationDiscount;
//	提交报价折扣修改
	@Action(value = "submitApprovalForQuotationDiscount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForQuotationDiscount() throws FLException{
		
		approvalQuotationDiscountService.submitApprovalForQuotationDiscount(approval, approvalQuotationDiscount, queryUserId(),queryCompany());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalQuotationDiscountVO getApprovalQuotationDiscount() {
		return approvalQuotationDiscount;
	}

	public void setApprovalQuotationDiscount(
			ApprovalQuotationDiscountVO approvalQuotationDiscount) {
		this.approvalQuotationDiscount = approvalQuotationDiscount;
	}

}
