/**
 * @File Name		: ApprovalVillageAction.java
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

import com.fanglin.approval.service.ApprovalVillageService;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.approval.vo.ApprovalVillageVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalVillageAction extends BaseListAction {

	private static final long serialVersionUID = 2581522377164215715L;
	
	@Autowired
	private ApprovalVillageService approvalVillageService;
	
	private ApprovalVO approval;
	
	private ApprovalVillageVO approvalVillage;
	
	@Action(value = "submitApprovalForVillage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForVillage() throws FLException{
		
		approvalVillageService.submitApprovalForVillage(approval, approvalVillage, queryUserId());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalVillageVO getApprovalVillage() {
		return approvalVillage;
	}

	public void setApprovalVillage(ApprovalVillageVO approvalVillage) {
		this.approvalVillage = approvalVillage;
	}

}
