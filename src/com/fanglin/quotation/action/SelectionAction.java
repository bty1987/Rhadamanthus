package com.fanglin.quotation.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
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

	@Action(value = "updateSelectionForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSelectionForAdvance() throws FLException {

		selectionService.updateSelectionForAdvance(selection);

		return SUCCESS;
	}

	@Action(value = "addSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSelection() throws FLException {

		selection = selectionService.addSelection(selection, queryUserId());

		return SUCCESS;
	}

	public SelectionVO getSelection() {
		return selection;
	}

	public void setSelection(SelectionVO selection) {
		this.selection = selection;
	}

}
