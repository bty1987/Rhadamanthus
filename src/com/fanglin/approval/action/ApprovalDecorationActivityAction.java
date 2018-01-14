/**
 * @File Name		: ApprovalDecorationActivityAction.java
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

import com.fanglin.approval.service.ApprovalDecorationActivityService;
import com.fanglin.approval.vo.ApprovalDecorationActivityItemVO;
import com.fanglin.approval.vo.ApprovalDecorationActivityVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalDecorationActivityAction extends BaseListAction {

	private static final long serialVersionUID = -2709953292960667261L;
	
	@Autowired
	private ApprovalDecorationActivityService approvalDecorationActivityService;
	
	private ApprovalVO approval;
	
	private ApprovalDecorationActivityVO approvalDecorationActivity;
	
	private List<ApprovalDecorationActivityItemVO> approvalDecorationActivityItems;
//	提交装修活动以及活动物品审批
	@Action(value = "submitApprovalForDecorationActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForDecorationActivity() throws FLException{
		
		approvalDecorationActivityService.submitApprovalForDecorationActivity(approval, approvalDecorationActivity, approvalDecorationActivityItems, queryUserId(),queryCompany());
		
		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalDecorationActivityVO getApprovalDecorationActivity() {
		return approvalDecorationActivity;
	}

	public void setApprovalDecorationActivity(ApprovalDecorationActivityVO approvalDecorationActivity) {
		this.approvalDecorationActivity = approvalDecorationActivity;
	}

	public List<ApprovalDecorationActivityItemVO> getApprovalDecorationActivityItems() {
		return approvalDecorationActivityItems;
	}

	public void setApprovalDecorationActivityItems(
			List<ApprovalDecorationActivityItemVO> approvalDecorationActivityItems) {
		this.approvalDecorationActivityItems = approvalDecorationActivityItems;
	}

}
