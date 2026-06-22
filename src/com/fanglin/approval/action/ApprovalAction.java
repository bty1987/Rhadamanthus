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

	private int count;

	private String piid;

	private String approve;

	@Action(value = "pageApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageApproval() throws FLException {

		approvalService.pageApproval(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageApprovalForReceive", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageApprovalForReceive() throws FLException {

		approvalService.pageApprovalForReceive(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageApprovalForSend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageApprovalForSend() throws FLException {

		approvalService.pageApprovalForSend(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageApprovalForReceiveDept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageApprovalForReceiveDept() throws FLException {

		approvalService.pageApprovalForReceiveDept(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryApprovalByAId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalByAId() throws FLException {

		approval = approvalService.queryApprovalByAId(approval);

		return SUCCESS;
	}

	@Action(value = "countApprovalForReceive", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countApprovalForReceive() throws FLException {

		count = approvalService.countApprovalForReceive(queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "countApprovalForSend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countApprovalForSend() throws FLException {

		count = approvalService.countApprovalForSend(queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "approveApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String approve() throws FLException {

		approvalService.approve(approval, queryUserId());

		return SUCCESS;
	}

	@Action(value = "affirmApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affirm() throws FLException {

		approvalService.affirm(approval);

		return SUCCESS;
	}

	@Action(value = "refuseApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refuseApproval() throws FLException {

		approvalService.refuse(approval, queryUserId());

		return SUCCESS;
	}

	@Action(value = "callbackApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String callbackApproval() throws FLException {

		if (approval == null) approval = new ApprovalVO();

		if (piid != null) approval.setPiid(piid);

		approvalService.callback(approval, approve);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public String getPiid() {
		return piid;
	}

	public void setPiid(String piid) {
		this.piid = piid;
	}

	public String getApprove() {
		return approve;
	}

	public void setApprove(String approve) {
		this.approve = approve;
	}

}
