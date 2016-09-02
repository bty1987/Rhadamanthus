/**
 * @File Name		: ApprovalAction.java
 * @Package   	: com.fanglin.approval.action
 * @Version		: 1.0
 * @Date			: 2015-10-25
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

import com.fanglin.approval.service.ApprovalService;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalAction extends BaseListAction {

	private static final long serialVersionUID = -549271005174823538L;
	
	@Autowired
	private ApprovalService approvalService;
	
	private ApprovalVO approval;
	
	@Action(value = "pageApprovalByReceiveId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageApprovalByReceiveId() throws FLException{
		
		approvalService.pageApprovalByReceiveId(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryApprovalByAId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalByAId() throws FLException{
		
		approval = approvalService.queryApprovalByAId(approval);
		
		return SUCCESS;
	}
	
	@Action(value = "approveApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String approve() throws FLException{
		
		approvalService.approve(approval);
		
		return SUCCESS;
	}
	
	@Action(value = "refuseApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refuseApproval() throws FLException{
		
		approvalService.refuse(approval);
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

}
