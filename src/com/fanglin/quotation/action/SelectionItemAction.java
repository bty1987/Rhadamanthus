package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.SelectionItemService;
import com.fanglin.quotation.vo.SelectionItemVO;
import com.fanglin.quotation.vo.SelectionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SelectionItemAction extends BaseListAction {

	private static final long serialVersionUID = -6806927760509036921L;

	@Autowired
	private SelectionItemService selectionItemService;

	private SelectionVO selection;

	private SelectionItemVO selectionItem;

	private List<SelectionItemVO> selectionItems;

	@Action(value = "pageSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSelectionItem() throws FLException {

		selectionItemService.pageSelectionItem(getPaging(), getFilters(), queryCompany(), selectionItem);

		return SUCCESS;
	}

	@Action(value = "pageSelectionItemForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSelectionItemForSupplier() throws FLException {

		selectionItemService.pageSelectionItemForSupplier(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSelectionItemForEscorter", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSelectionItemForEscorter() throws FLException {

		selectionItemService.pageSelectionItemForEscorter(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "querySelectionItemByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySelectionItemByOrderId() throws FLException {

		selectionItems = selectionItemService.querySelectionItemByOrderId(selectionItem);

		return SUCCESS;
	}

	@Action(value = "querySelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySelectionItem() throws FLException {

		selectionItems = selectionItemService.querySelectionItem(selection);

		return SUCCESS;
	}

	@Action(value = "collateSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collateSelectionItem() throws FLException {

		selectionItemService.collateSelectionItem(selection);

		return SUCCESS;
	}

	@Action(value = "addSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSelectionItem() throws FLException {

		selectionItemService.addSelectionItem(selection, selectionItem, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSelectionItem() throws FLException {

		selectionItemService.updateSelectionItem(selectionItem);

		return SUCCESS;
	}

	@Action(value = "tranSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String tranSelectionItem() throws FLException {

		selectionItemService.tranSelectionItem(selectionItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "checkSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkSelectionItem() throws FLException {

		selectionItemService.checkSelectionItem(selectionItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "confirmSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmSelectionItem() throws FLException {

		selectionItemService.confirmSelectionItem(selectionItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "finishSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishSelectionItem() throws FLException {

		selectionItemService.finishSelectionItem(selectionItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "reviewSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String reviewSelectionItem() throws FLException {

		selectionItemService.reviewSelectionItem(selectionItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "balanceSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String balanceSelectionItem() throws FLException {

		selectionItemService.balanceSelectionItem(selectionItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSelectionItem() throws FLException {

		selectionItemService.deleteSelectionItem(selection, selectionItem);

		return SUCCESS;
	}

	@Action(value = "cutoffSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cutoffSelectionItem() throws FLException {

		selectionItemService.cutoffSelectionItem(selectionItem);

		return SUCCESS;
	}

	public SelectionVO getSelection() {
		return selection;
	}

	public void setSelection(SelectionVO selection) {
		this.selection = selection;
	}

	public SelectionItemVO getSelectionItem() {
		return selectionItem;
	}

	public void setSelectionItem(SelectionItemVO selectionItem) {
		this.selectionItem = selectionItem;
	}

	public List<SelectionItemVO> getSelectionItems() {
		return selectionItems;
	}

	public void setSelectionItems(List<SelectionItemVO> selectionItems) {
		this.selectionItems = selectionItems;
	}

}
