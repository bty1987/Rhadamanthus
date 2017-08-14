/**
 * @File Name		: ApprovalOrderBelongAction.java
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

import com.fanglin.approval.service.ApprovalOrderBelongService;
import com.fanglin.approval.vo.ApprovalOrderBelongItemVO;
import com.fanglin.approval.vo.ApprovalOrderBelongVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalOrderBelongAction extends BaseListAction {

	private static final long serialVersionUID = -6930218639120369013L;
	
	@Autowired
	private ApprovalOrderBelongService approvalOrderBelongService;
	
	private ApprovalVO approval;
	
	private ApprovalOrderBelongVO approvalOrderBelong;
	
	private List<ApprovalOrderBelongItemVO> approvalOrderBelongItems;
//	提交装修订单归属信息修改
	@Action(value = "submitApprovalForOrderBelong", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForOrderBelong() throws FLException{
		
		approvalOrderBelongService.submitApprovalForOrderBelong(approval, approvalOrderBelong, approvalOrderBelongItems, queryUserId(),queryCompany());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalOrderBelongVO getApprovalOrderBelong() {
		return approvalOrderBelong;
	}

	public void setApprovalOrderBelong(ApprovalOrderBelongVO approvalOrderBelong) {
		this.approvalOrderBelong = approvalOrderBelong;
	}

	public List<ApprovalOrderBelongItemVO> getApprovalOrderBelongItems() {
		return approvalOrderBelongItems;
	}

	public void setApprovalOrderBelongItems(
			List<ApprovalOrderBelongItemVO> approvalOrderBelongItems) {
		this.approvalOrderBelongItems = approvalOrderBelongItems;
	}

}
