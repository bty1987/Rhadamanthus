package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.SalesBalanceItemService;
import com.fanglin.sales.service.SalesBalanceService;
import com.fanglin.sales.vo.SalesBalanceItemVO;
import com.fanglin.sales.vo.SalesBalanceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesBalanceAction extends BaseListAction {

	private static final long serialVersionUID = -1983581510336617599L;

	@Autowired
	private SalesBalanceService salesBalanceService;

	@Autowired
	private SalesBalanceItemService salesBalanceItemService;

	private SalesBalanceVO salesBalance;

	private List<Long> sid;

	private List<SalesBalanceVO> salesBalances;

	private List<SalesBalanceItemVO> salesBalanceItems;

	@Action(value = "pageSalesBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesBalance() throws FLException {

		salesBalanceService.pageSalesBalance(getPaging(), getFilters(), salesBalance, queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesBalanceForDompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesBalanceForDompany() throws FLException {

		salesBalanceService.pageSalesBalanceForDompany(getPaging(), getFilters(), salesBalance, queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesBalanceForPompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesBalanceForPompany() throws FLException {

		salesBalanceService.pageSalesBalanceForPompany(getPaging(), getFilters(), salesBalance, queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesBalanceForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesBalanceForSupplier() throws FLException {

		salesBalanceService.pageSalesBalanceForSupplier(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesBalanceForCheck", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesBalanceForCheck() throws FLException {

		salesBalanceService.pageSalesBalanceForCheck(getPaging(), getFilters(), salesBalance, queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySalesBalanceByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesBalanceByOrderId() throws FLException {

		salesBalances = salesBalanceService.querySalesBalanceByOrderId(sid, salesBalance);

		return SUCCESS;
	}

	@Action(value = "querySalesBalanceItemBySbid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesBalanceItemBySbid() throws FLException {

		salesBalanceItems = salesBalanceItemService.querySalesBalanceItemBySbid(salesBalance);

		return SUCCESS;
	}

	@Action(value = "updateSalesBalanceForVBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesBalanceForVBalance() throws FLException {

		salesBalanceService.updateSalesBalanceForVBalance(salesBalance);

		return SUCCESS;
	}

	@Action(value = "updateSalesBalanceForPBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesBalanceForPBalance() throws FLException {

		salesBalanceService.updateSalesBalanceForPBalance(salesBalance);

		return SUCCESS;
	}

	@Action(value = "rpreSalesBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rpreSalesBalance() throws FLException {

		salesBalanceService.rpreSalesBalance(salesBalance);

		return SUCCESS;
	}

	@Action(value = "passSalesBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String passSalesBalance() throws FLException {

		salesBalanceService.passSalesBalance(sid);

		return SUCCESS;
	}

	@Action(value = "preSalesBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String preSalesBalance() throws FLException {

		salesBalanceService.preSalesBalance(sid, queryUserId());

		return SUCCESS;
	}

	@Action(value = "vpostSalesBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String vpostSalesBalance() throws FLException {

		salesBalanceService.vpostSalesBalance(salesBalances, queryUserId());

		return SUCCESS;
	}

	@Action(value = "postSalesBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String postSalesBalance() throws FLException {

		salesBalanceService.postSalesBalance(salesBalances, queryUserId());

		return SUCCESS;
	}

	@Action(value = "rejectSalesBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rejectSalesBalance() throws FLException {

		salesBalanceService.rejectSalesBalance(salesBalance, queryUserId());

		return SUCCESS;
	}

	public SalesBalanceVO getSalesBalance() {
		return salesBalance;
	}

	public void setSalesBalance(SalesBalanceVO salesBalance) {
		this.salesBalance = salesBalance;
	}

	public List<Long> getSid() {
		return sid;
	}

	public void setSid(List<Long> sid) {
		this.sid = sid;
	}

	public List<SalesBalanceVO> getSalesBalances() {
		return salesBalances;
	}

	public void setSalesBalances(List<SalesBalanceVO> salesBalances) {
		this.salesBalances = salesBalances;
	}

	public List<SalesBalanceItemVO> getSalesBalanceItems() {
		return salesBalanceItems;
	}

	public void setSalesBalanceItems(List<SalesBalanceItemVO> salesBalanceItems) {
		this.salesBalanceItems = salesBalanceItems;
	}

}
