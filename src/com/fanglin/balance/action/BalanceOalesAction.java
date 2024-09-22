package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceOalesService;
import com.fanglin.balance.vo.BalanceOalesItemVO;
import com.fanglin.balance.vo.BalanceOalesVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceOalesAction extends BaseListAction {

	private static final long serialVersionUID = 1897317659108691440L;

	@Autowired
	private BalanceOalesService balanceOalesService;

	private BalanceOalesVO balanceOales;

	private List<BalanceOalesVO> balanceOaleses;

	private List<BalanceOalesItemVO> balanceOalesItems;

	@Action(value = "pageBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceOales() throws FLException {

		balanceOalesService.pageBalanceOales(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageBalanceOalesForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceOalesForBalance() throws FLException {

		balanceOalesService.pageBalanceOalesForBalance(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceOales() throws FLException {

		balanceOaleses = balanceOalesService.queryBalanceOales(balanceOales, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryBalanceOalesByBoid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceOalesByBoid() throws FLException {

		balanceOales = balanceOalesService.queryBalanceOalesByBoid(balanceOales);

		return SUCCESS;
	}

	@Action(value = "createBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createBalanceOales() throws FLException {

		balanceOalesService.createBalanceOales(balanceOales, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "submitBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitBalanceOales() throws FLException {

		balanceOalesService.submitBalanceOales(balanceOales, balanceOalesItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "unbindBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unbindBalanceOales() throws FLException {

		balanceOalesService.unbindBalanceOales(balanceOales, balanceOalesItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "lockBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String lockBalanceOales() throws FLException {

		balanceOalesService.lockBalanceOales(balanceOales);

		return SUCCESS;
	}

	@Action(value = "unlockBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unlockBalanceOales() throws FLException {

		balanceOalesService.unlockBalanceOales(balanceOales);

		return SUCCESS;
	}

	@Action(value = "updateBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBalanceOales() throws FLException {

		balanceOalesService.updateBalanceOales(balanceOales);
		return SUCCESS;
	}

	@Action(value = "balanceBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String balanceBalanceOales() throws FLException {

		balanceOalesService.balanceBalanceOales(balanceOales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBalanceOales() throws FLException {

		balanceOalesService.deleteBalanceOales(balanceOales);
		return SUCCESS;
	}

	@Action(value = "amountBalanceOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountBalanceOales() throws FLException {

		balanceOalesService.amountBalanceOales(balanceOales);
		return SUCCESS;
	}

	public BalanceOalesVO getBalanceOales() {
		return balanceOales;
	}

	public void setBalanceOales(BalanceOalesVO balanceOales) {
		this.balanceOales = balanceOales;
	}

	public List<BalanceOalesVO> getBalanceOaleses() {
		return balanceOaleses;
	}

	public void setBalanceOaleses(List<BalanceOalesVO> balanceOaleses) {
		this.balanceOaleses = balanceOaleses;
	}

	public List<BalanceOalesItemVO> getBalanceOalesItems() {
		return balanceOalesItems;
	}

	public void setBalanceOalesItems(List<BalanceOalesItemVO> balanceOalesItems) {
		this.balanceOalesItems = balanceOalesItems;
	}

}
