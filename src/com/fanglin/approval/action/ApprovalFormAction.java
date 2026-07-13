/**
 * @File Name		: ApprovalFormAction.java
 * @Package   		: com.fanglin.approval.action
 * @Version			: 1.0
 * @Description		: 审批表单定义管理控制器。提供表单 + 字段的增删改查接口,供表单设计器后台使用。
 */

package com.fanglin.approval.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalFormDataService;
import com.fanglin.approval.service.ApprovalFormService;
import com.fanglin.approval.vo.ApprovalFormDataVO;
import com.fanglin.approval.vo.ApprovalFormFieldVO;
import com.fanglin.approval.vo.ApprovalFormVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalFormAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private ApprovalFormService approvalFormService;

	@Autowired
	private ApprovalFormDataService approvalFormDataService;

	private ApprovalFormVO form;

	private List<ApprovalFormVO> forms;

	private List<ApprovalFormFieldVO> formFields;

	private Long flowId;

	private long aid;

	private List<ApprovalFormDataVO> formDataList;

	@Action(value = "pageApprovalForm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageApprovalForm() throws FLException {

		approvalFormService.pageApprovalForm(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryApprovalFormByFormId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalFormByFormId() throws FLException {

		form = approvalFormService.queryApprovalFormByFormId(form);

		return SUCCESS;
	}

	@Action(value = "queryApprovalFormByFlowId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalFormByFlowId() {

		form = approvalFormService.queryApprovalFormByFlowId(flowId);

		return SUCCESS;
	}

	@Action(value = "queryApprovalFormField", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalFormField() {

		formFields = approvalFormService.queryApprovalFormField(form);

		return SUCCESS;
	}

	@Action(value = "addApprovalForm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addApprovalForm() throws FLException {

		approvalFormService.addApprovalForm(form, formFields, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateApprovalForm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateApprovalForm() throws FLException {

		approvalFormService.updateApprovalForm(form, formFields);

		return SUCCESS;
	}

	@Action(value = "updateApprovalFormForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateApprovalFormForStatus() throws FLException {

		approvalFormService.updateApprovalFormForStatus(form);

		return SUCCESS;
	}

	@Action(value = "deleteApprovalForm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteApprovalForm() throws FLException {

		approvalFormService.deleteApprovalForm(form);

		return SUCCESS;
	}

	@Action(value = "queryApprovalFormData", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalFormData() throws FLException {

		formDataList = approvalFormDataService.queryFormDataList(aid);

		return SUCCESS;
	}

	public ApprovalFormVO getForm() {
		return form;
	}

	public void setForm(ApprovalFormVO form) {
		this.form = form;
	}

	public List<ApprovalFormVO> getForms() {
		return forms;
	}

	public void setForms(List<ApprovalFormVO> forms) {
		this.forms = forms;
	}

	public List<ApprovalFormFieldVO> getFormFields() {
		return formFields;
	}

	public void setFormFields(List<ApprovalFormFieldVO> formFields) {
		this.formFields = formFields;
	}

	public Long getFlowId() {
		return flowId;
	}

	public void setFlowId(Long flowId) {
		this.flowId = flowId;
	}

	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	public List<ApprovalFormDataVO> getFormDataList() {
		return formDataList;
	}

	public void setFormDataList(List<ApprovalFormDataVO> formDataList) {
		this.formDataList = formDataList;
	}

}
