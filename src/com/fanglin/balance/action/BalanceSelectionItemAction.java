package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceSelectionItemService;
import com.fanglin.balance.vo.BalanceSelectionItemVO;
import com.fanglin.balance.vo.BalanceSelectionVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceSelectionItemAction extends BaseListAction {

	private static final long serialVersionUID = -6761422113796569614L;

	@Autowired
	private BalanceSelectionItemService balanceSelectionItemService;

	private BalanceSelectionVO balanceSelection;

	private BalanceSelectionItemVO balanceSelectionItem;

	private List<BalanceSelectionItemVO> balanceSelectionItems;

	private int count;

	@Action(value = "pageBalanceSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceSelectionItem() throws FLException {

		balanceSelectionItemService.pageBalanceSelectionItem(getPaging(), getFilters(), balanceSelection.getBsid());

		return SUCCESS;
	}

	@Action(value = "queryBalanceSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceSelectionItem() {

		balanceSelectionItems = balanceSelectionItemService.queryBalanceSelectionItem(balanceSelectionItem);

		return SUCCESS;
	}

	@Action(value = "countBalanceSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countBalanceSelectionItem() throws FLException {

		count = balanceSelectionItemService.countBalanceSelectionItem(balanceSelection);

		return SUCCESS;
	}

	@Action(value = "pendingBalanceSelectionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pendingBalanceSelectionItem() throws FLException {

		balanceSelectionItemService.pendingBalanceSelectionItem(balanceSelection, balanceSelectionItem, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public BalanceSelectionVO getBalanceSelection() {
		return balanceSelection;
	}

	public void setBalanceSelection(BalanceSelectionVO balanceSelection) {
		this.balanceSelection = balanceSelection;
	}

	public BalanceSelectionItemVO getBalanceSelectionItem() {
		return balanceSelectionItem;
	}

	public void setBalanceSelectionItem(BalanceSelectionItemVO balanceSelectionItem) {
		this.balanceSelectionItem = balanceSelectionItem;
	}

	public List<BalanceSelectionItemVO> getBalanceSelectionItems() {
		return balanceSelectionItems;
	}

	public void setBalanceSelectionItems(List<BalanceSelectionItemVO> balanceSelectionItems) {
		this.balanceSelectionItems = balanceSelectionItems;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

}
