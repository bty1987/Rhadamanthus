package com.fanglin.quotation.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.quotation.service.SelectionService;
import com.fanglin.quotation.vo.SelectionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SelectionAction extends BaseListAction {

	private static final long serialVersionUID = -8184788573384438830L;

	@Autowired
	private SelectionService selectionService;

	private SelectionVO selection;

	private DecorationVO decoration;

	private String securityCode;

	private String verifyCode;

	private String phoneCode;

	private String company;

	@Action(value = "pageSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSelection() throws FLException {

		selectionService.pageSelection(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySelectionByQid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySelectionByQid() throws FLException {

		selection = selectionService.querySelectionByQid(selection);

		return SUCCESS;
	}

	@Action(value = "querySelectionByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySelectionByOrderId() throws FLException {

		selection = selectionService.querySelectionByOrderId(selection);

		return SUCCESS;
	}

	@Action(value = "addSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSelection() throws FLException {

		selection = selectionService.addSelection(selection, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSelection() throws FLException {

		selectionService.updateSelection(selection);

		return SUCCESS;
	}

	@Action(value = "updateSelectionForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSelectionForAdvance() throws FLException {

		selectionService.updateSelectionForAdvance(selection);

		return SUCCESS;
	}

	@Action(value = "sendSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendSelection() throws FLException {

		selectionService.sendSelection(selection, queryUserId());

		return SUCCESS;
	}

	@Action(value = "affirmSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affirmSelection() throws FLException {

		selectionService.affirmSelection(decoration, selection, securityCode, verifyCode, phoneCode, company);

		return SUCCESS;
	}

	@Action(value = "lockSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String lockSelection() throws FLException {

		selectionService.lockSelection(selection);

		return SUCCESS;
	}

	@Action(value = "unlockSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unlockSelection() throws FLException {

		selectionService.unlockSelection(selection);

		return SUCCESS;
	}

	@Action(value = "resetSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String resetSelection() throws FLException {

		selectionService.resetSelection(selection);

		return SUCCESS;
	}

	public SelectionVO getSelection() {
		return selection;
	}

	public void setSelection(SelectionVO selection) {
		this.selection = selection;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public String getSecurityCode() {
		return securityCode;
	}

	public void setSecurityCode(String securityCode) {
		this.securityCode = securityCode;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

	public String getPhoneCode() {
		return phoneCode;
	}

	public void setPhoneCode(String phoneCode) {
		this.phoneCode = phoneCode;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

}
