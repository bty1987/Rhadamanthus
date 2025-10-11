package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceApportService;
import com.fanglin.balance.vo.BalanceApportVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceApportAction extends BaseListAction {

	private static final long serialVersionUID = 4493385608040589247L;

	@Autowired
	private BalanceApportService balanceApportService;

	private BalanceApportVO balanceApport;

	private List<BalanceApportVO> balanceApports;

	@Action(value = "queryBalanceApportForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceApportForBalance() throws FLException {

		balanceApports = balanceApportService.queryBalanceApportForBalance(balanceApport);

		return SUCCESS;
	}

	@Action(value = "addBalanceApport", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBalanceApport() throws FLException {

		balanceApportService.addBalanceApport(balanceApport, queryUserId());

		return SUCCESS;
	}

	public BalanceApportVO getBalanceApport() {
		return balanceApport;
	}

	public void setBalanceApport(BalanceApportVO balanceApport) {
		this.balanceApport = balanceApport;
	}

	public List<BalanceApportVO> getBalanceApports() {
		return balanceApports;
	}

	public void setBalanceApports(List<BalanceApportVO> balanceApports) {
		this.balanceApports = balanceApports;
	}

}
