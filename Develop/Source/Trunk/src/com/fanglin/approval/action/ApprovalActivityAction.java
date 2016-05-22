/**
 * @File Name		: ApprovalActivityAction.java
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

import com.fanglin.approval.service.ApprovalActivityService;
import com.fanglin.approval.vo.ApprovalActivityItemVO;
import com.fanglin.approval.vo.ApprovalActivityVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalActivityAction extends BaseListAction {

	private static final long serialVersionUID = -2709953292960667261L;
	
	@Autowired
	private ApprovalActivityService approvalActivityService;
	
	private ApprovalVO approval;
	
	private ApprovalActivityVO approvalActivity;
	
	private List<ApprovalActivityItemVO> approvalActivityItems;
	
	@Action(value = "submitApprovalForDecorationActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForDecorationActivity() throws FLException{
		
		approvalActivityService.submitApprovalForDecorationActivity(approval, approvalActivity, approvalActivityItems, getUserId());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalActivityVO getApprovalActivity() {
		return approvalActivity;
	}

	public void setApprovalActivity(ApprovalActivityVO approvalActivity) {
		this.approvalActivity = approvalActivity;
	}

	public List<ApprovalActivityItemVO> getApprovalActivityItems() {
		return approvalActivityItems;
	}

	public void setApprovalActivityItems(
			List<ApprovalActivityItemVO> approvalActivityItems) {
		this.approvalActivityItems = approvalActivityItems;
	}

}
