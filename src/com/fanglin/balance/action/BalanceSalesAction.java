package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceSalesService;
import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.balance.vo.BalanceSalesVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceSalesAction extends BaseListAction {

	private static final long serialVersionUID = 4861644463792131364L;

	@Autowired
	private BalanceSalesService balanceSalesService;

	private List<BalanceSalesVO> balanceSaleses;

	private List<BalanceSalesBalanceVO> balanceSalesBalances;

	private BalanceSalesVO balanceSales;

	@Action(value = "pageBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceSales() throws FLException {

		balanceSalesService.pageBalanceSales(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageBalanceSalesForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceSalesForBalance() throws FLException {

		balanceSalesService.pageBalanceSalesForBalance(getPaging(), getFilters(), balanceSales, queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageBalanceSalesForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceSalesForSupplier() throws FLException {

		balanceSalesService.pageBalanceSalesForSupplier(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceSales() throws FLException {

		balanceSaleses = balanceSalesService.queryBalanceSales(balanceSales, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryBalanceSalesByBsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceSalesByBsid() throws FLException {

		balanceSales = balanceSalesService.queryBalanceSalesByBsid(balanceSales);

		return SUCCESS;
	}

	@Action(value = "createBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createBalanceSales() throws FLException {

		balanceSalesService.createBalanceSales(balanceSales, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBalanceSales() throws FLException {

		balanceSalesService.updateBalanceSales(balanceSales);

		return SUCCESS;
	}

	@Action(value = "splitBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String splitBalanceSales() throws FLException {

		balanceSalesService.splitBalanceSales(balanceSales, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "amountBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountBalanceSales() throws FLException {

		balanceSalesService.amountBalanceSales(balanceSales);

		return SUCCESS;
	}

	@Action(value = "submitBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitBalanceSales() throws FLException {

		balanceSalesService.submitBalanceSales(balanceSales, balanceSalesBalances, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "unbindBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unbindBalanceSales() throws FLException {

		balanceSalesService.unbindBalanceSales(balanceSales, balanceSalesBalances, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "balanceBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String balanceBalanceSales() throws FLException {

		balanceSalesService.balanceBalanceSales(balanceSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "lockBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String lockBalanceSales() throws FLException {

		balanceSalesService.lockBalanceSales(balanceSales);

		return SUCCESS;
	}

	@Action(value = "unlockBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unlockBalanceSales() throws FLException {

		balanceSalesService.unlockBalanceSales(balanceSales);

		return SUCCESS;
	}

	@Action(value = "affirmBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affirmBalanceSales() throws FLException {

		balanceSalesService.affirmBalanceSales(balanceSales);

		return SUCCESS;
	}

	@Action(value = "deleteBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBalanceSales() throws FLException {

		balanceSalesService.deleteBalanceSales(balanceSales);

		return SUCCESS;
	}

	public BalanceSalesVO getBalanceSales() {
		return balanceSales;
	}

	public void setBalanceSales(BalanceSalesVO balanceSales) {
		this.balanceSales = balanceSales;
	}

	public List<BalanceSalesBalanceVO> getBalanceSalesBalances() {
		return balanceSalesBalances;
	}

	public void setBalanceSalesBalances(List<BalanceSalesBalanceVO> balanceSalesBalances) {
		this.balanceSalesBalances = balanceSalesBalances;
	}

	public List<BalanceSalesVO> getBalanceSaleses() {
		return balanceSaleses;
	}

	public void setBalanceSaless(List<BalanceSalesVO> balanceSaleses) {
		this.balanceSaleses = balanceSaleses;
	}

}
