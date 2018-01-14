/**
 * @File Name		: AprovalDecorationHouseAction.java
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

import com.fanglin.approval.service.ApprovalDecorationHouseService;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.approval.vo.ApprovalDecorationHouseVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalDecorationHouseAction extends BaseListAction {

	private static final long serialVersionUID = 2581522377164215715L;
	
	@Autowired
	private ApprovalDecorationHouseService approvalDecorationHouseService;
	
	private ApprovalVO approval;
	
	private ApprovalDecorationHouseVO approvalDecorationHouse;
	
	@Action(value = "submitApprovalForDecorationHouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalDecorationHouse() throws FLException{
		
		approvalDecorationHouseService.submitApprovalDecorationHouse(approval, approvalDecorationHouse, queryUserId(),queryCompany());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalDecorationHouseVO getApprovalDecorationHouse() {
		return approvalDecorationHouse;
	}

	public void setApprovalDecorationHouse(
			ApprovalDecorationHouseVO approvalDecorationHouse) {
		this.approvalDecorationHouse = approvalDecorationHouse;
	}


}
