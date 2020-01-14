package com.fanglin.approval.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApproverService;
import com.fanglin.approval.vo.ApproverVO;
import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApproverAction extends BaseListAction {

	private static final long serialVersionUID = 4493385608040589247L;

	@Autowired
	private ApproverService approverService;

	private ApproverVO approver;

	private List<ApproverVO> approvers;

	private List<KeyValueVO> autoFillKeyValue;

	@Action(value = "pageApprover", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPageapprover() throws FLException {

		approverService.pageApprover(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryApproverByType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApproverByType() throws FLException {

		approvers = approverService.queryApproverByType(approver, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addApprover", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addApprover() throws FLException {

		approverService.addApprover(approver, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteApprover", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteApprover() throws FLException {

		approverService.deleteApprover(approver);

		return SUCCESS;
	}

	public ApproverVO getApprover() {
		return approver;
	}

	public void setApprover(ApproverVO approver) {
		this.approver = approver;
	}

	public List<ApproverVO> getApprovers() {
		return approvers;
	}

	public void setApprovers(List<ApproverVO> approvers) {
		this.approvers = approvers;
	}

	public List<KeyValueVO> getAutoFillKeyValue() {
		if (autoFillKeyValue == null) {
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue) {
		this.autoFillKeyValue = autoFillKeyValue;
	}

}
