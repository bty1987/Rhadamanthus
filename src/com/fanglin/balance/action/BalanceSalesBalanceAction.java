package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceSalesBalanceService;
import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.balance.vo.BalanceSalesVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceSalesBalanceAction extends BaseListAction {

	private static final long serialVersionUID = 3683011826956315171L;

	@Autowired
	private BalanceSalesBalanceService balanceSalesBalanceService;

	private BalanceSalesVO balanceSales;

	private BalanceSalesBalanceVO balanceSalesBalance;

	private List<BalanceSalesBalanceVO> balanceSalesBalances;

	private List<BalanceSalesVO> balanceSaleses;

	private int count;

	@Action(value = "pageBalanceSalesBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceSalesBalance() throws FLException {

		balanceSalesBalanceService.pageBalanceSalesBalance(getPaging(), getFilters(), balanceSales.getBsid());

		return SUCCESS;
	}

	@Action(value = "queryBalanceSalesBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceSalesBalance() {

		balanceSalesBalances = balanceSalesBalanceService.queryBalanceSalesBalance(balanceSalesBalance);

		return SUCCESS;
	}

	@Action(value = "countBalanceSalesBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countBalanceSalesBalance() throws FLException {

		count = balanceSalesBalanceService.countBalanceSalesBalance(balanceSales);

		return SUCCESS;
	}

	public BalanceSalesBalanceVO getBalanceSalesBalance() {
		return balanceSalesBalance;
	}

	public void setBalanceSalesBalance(BalanceSalesBalanceVO balanceSalesBalance) {
		this.balanceSalesBalance = balanceSalesBalance;
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

	public void setBalanceSaleses(List<BalanceSalesVO> balanceSaleses) {
		this.balanceSaleses = balanceSaleses;
	}

	public BalanceSalesVO getBalanceSales() {
		return balanceSales;
	}

	public void setBalanceSales(BalanceSalesVO balanceSales) {
		this.balanceSales = balanceSales;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

}
