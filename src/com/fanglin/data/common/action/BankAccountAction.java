package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.BankAccountService;
import com.fanglin.data.common.vo.BankAccountVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BankAccountAction extends BaseListAction {

	private static final long serialVersionUID = 8173596571115100890L;

	@Autowired
	private BankAccountService bankAccountService;

	private BankAccountVO bankAccount;

	private List<BankAccountVO> bankAccounts;

	@Action(value = "pageBankAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBankAccount() throws FLException {

		bankAccountService.pageBankAccount(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryBankAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBankAccount() throws FLException {

		bankAccount = bankAccountService.queryBankAccount(bankAccount);

		return SUCCESS;
	}

	@Action(value = "addBankAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBankAccount() throws FLException {

		bankAccountService.addBankAccount(bankAccount, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateBankAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBankAccount() throws FLException {

		bankAccountService.updateBankAccount(bankAccount);

		return SUCCESS;
	}

	@Action(value = "updateBankAccountForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBankAccountForStatus() throws FLException {

		bankAccountService.updateBankAccountForStatus(bankAccount);

		return SUCCESS;
	}

	public BankAccountVO getBankAccount() {
		return bankAccount;
	}

	public void setBankAccount(BankAccountVO bankAccount) {
		this.bankAccount = bankAccount;
	}

	public List<BankAccountVO> getBankAccounts() {
		return bankAccounts;
	}

	public void setBankAccounts(List<BankAccountVO> bankAccounts) {
		this.bankAccounts = bankAccounts;
	}

}
