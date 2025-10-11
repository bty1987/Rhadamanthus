package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceSelectionService;
import com.fanglin.balance.vo.BalanceSelectionItemVO;
import com.fanglin.balance.vo.BalanceSelectionVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceSelectionAction extends BaseListAction {

	private static final long serialVersionUID = 7859276632402703821L;

	@Autowired
	private BalanceSelectionService balanceSelectionService;

	private BalanceSelectionVO balanceSelection;

	private List<BalanceSelectionVO> balanceSelections;

	private List<BalanceSelectionItemVO> balanceSelectionItems;

	@Action(value = "pageBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceSelection() throws FLException {

		balanceSelectionService.pageBalanceSelection(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageBalanceSelectionForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceSelectionForBalance() throws FLException {

		balanceSelectionService.pageBalanceSelectionForBalance(getPaging(), getFilters(), balanceSelection, queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageBalanceSelectionForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceSelectionForSupplier() throws FLException {

		balanceSelectionService.pageBalanceSelectionForSupplier(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceSelection() throws FLException {

		balanceSelections = balanceSelectionService.queryBalanceSelection(balanceSelection, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryBalanceSelectionByBsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceSelectionByBsid() throws FLException {

		balanceSelection = balanceSelectionService.queryBalanceSelectionByBsid(balanceSelection);

		return SUCCESS;
	}

	@Action(value = "createBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createBalanceSelection() throws FLException {

		balanceSelectionService.createBalanceSelection(balanceSelection, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "submitBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitBalanceSelection() throws FLException {

		balanceSelectionService.submitBalanceSelection(balanceSelection, balanceSelectionItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "batchBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String batchBalanceSelection() throws FLException {

		balanceSelectionService.batchBalanceSelection(balanceSelection, balanceSelectionItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "unbindBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unbindBalanceSelection() throws FLException {

		balanceSelectionService.unbindBalanceSelection(balanceSelection, balanceSelectionItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "lockBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String lockBalanceSelection() throws FLException {

		balanceSelectionService.lockBalanceSelection(balanceSelection, queryUserId());

		return SUCCESS;
	}

	@Action(value = "unlockBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unlockBalanceSelection() throws FLException {

		balanceSelectionService.unlockBalanceSelection(balanceSelection, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBalanceSelection() throws FLException {

		balanceSelectionService.updateBalanceSelection(balanceSelection);
		return SUCCESS;
	}

	@Action(value = "balanceBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String balanceBalanceSelection() throws FLException {

		balanceSelectionService.balanceBalanceSelection(balanceSelection, queryUserId());

		return SUCCESS;
	}

	@Action(value = "auditBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String auditBalanceSelection() throws FLException {

		balanceSelectionService.auditBalanceSelection(balanceSelection, queryUserId());

		return SUCCESS;
	}

	@Action(value = "unauditBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unauditBalanceSelection() throws FLException {

		balanceSelectionService.unauditBalanceSelection(balanceSelection, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBalanceSelection() throws FLException {

		balanceSelectionService.deleteBalanceSelection(balanceSelection);
		return SUCCESS;
	}

	@Action(value = "amountBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountBalanceSelection() throws FLException {

		balanceSelectionService.amountBalanceSelection(balanceSelection);
		return SUCCESS;
	}

	@Action(value = "discountBalanceSelection", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String discountBalanceSelection() throws FLException {

		balanceSelectionService.discountBalanceSelection(balanceSelection);
		return SUCCESS;
	}

	public BalanceSelectionVO getBalanceSelection() {
		return balanceSelection;
	}

	public void setBalanceSelection(BalanceSelectionVO balanceSelection) {
		this.balanceSelection = balanceSelection;
	}

	public List<BalanceSelectionVO> getBalanceSelections() {
		return balanceSelections;
	}

	public void setBalanceSelections(List<BalanceSelectionVO> balanceSelections) {
		this.balanceSelections = balanceSelections;
	}

	public List<BalanceSelectionItemVO> getBalanceSelectionItems() {
		return balanceSelectionItems;
	}

	public void setBalanceSelectionItems(List<BalanceSelectionItemVO> balanceSelectionItems) {
		this.balanceSelectionItems = balanceSelectionItems;
	}

}
