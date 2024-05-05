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
import com.fanglin.sales.service.SalesItemService;
import com.fanglin.sales.service.SalesService;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesAction extends BaseListAction {

	private static final long serialVersionUID = -4124455926491393165L;

	@Autowired
	private SalesService salesService;

	@Autowired
	private SalesItemService salesItemService;

	private SalesItemVO salesItem;

	private SalesVO sales;

	private List<Long> sids;

	private List<SalesItemVO> salesItems;

	@Action(value = "pageSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSales() throws FLException {

		salesService.pageSales(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesForAdvance() throws FLException {

		salesService.pageSalesForAdvance(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesForBalance() throws FLException {

		salesService.pageSalesForBalance(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesForDompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesForDompany() throws FLException {

		salesService.pageSalesForDompany(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesForBalanceByDompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesForBalanceByDompany() throws FLException {

		salesService.pageSalesForBalanceByDompany(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesForPompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesForPompany() throws FLException {

		salesService.pageSalesForPompany(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesForBalanceByPompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesForBalanceByPompany() throws FLException {

		salesService.pageSalesForBalanceByPompany(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesForSupplier() throws FLException {

		salesService.pageSalesForSupplier(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSalesByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesByOrderId() throws FLException {

		salesService.pageSalesByOrderId(getPaging(), getFilters(), queryCompany(), queryUserId(), sales.getOrderId());

		return SUCCESS;
	}

	@Action(value = "querySalesBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesBySid() throws FLException {

		sales = salesService.querySalesBySid(sales);

		return SUCCESS;
	}

	@Action(value = "querySalesByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesByNo() throws FLException {

		sales = salesService.querySalesByNo(sales);

		return SUCCESS;
	}

	@Action(value = "checkSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkSales() throws FLException {

		salesService.checkSales(sales);

		return SUCCESS;
	}

	@Action(value = "addSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSales() throws FLException {

		salesService.addSales(sales, salesItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSales() throws FLException {

		salesService.updateSales(sales);

		return SUCCESS;
	}

	@Action(value = "updateSalesForCoupon", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesForCoupon() throws FLException {

		salesService.updateSalesForCoupon(sales);

		return SUCCESS;
	}

	@Action(value = "updateSalesForMaling", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesForMaling() throws FLException {

		salesService.updateSalesForMaling(sales);

		return SUCCESS;
	}

	@Action(value = "querySalesItemBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesItemBySid() {

		salesItems = salesItemService.querySalesItemBySid(sales);

		return SUCCESS;
	}

	@Action(value = "querySalesItemBySids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesItemBySids() {

		salesItems = salesItemService.querySalesItemBySids(sids);

		return SUCCESS;
	}

	@Action(value = "addSalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesItem() throws FLException {

		salesItemService.addSalesItem(sales, salesItem);

		return SUCCESS;
	}

	@Action(value = "updateSalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesItem() throws FLException {

		salesItemService.updateSalesItem(sales, salesItem);

		return SUCCESS;
	}

	@Action(value = "updateSalesItemForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesItemForBalance() throws FLException {

		salesItemService.updateSalesItemForBalance(salesItem);

		return SUCCESS;
	}

	@Action(value = "deleteSalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSalesItem() throws FLException {

		salesItemService.deleteSalesItem(sales, salesItem);

		return SUCCESS;
	}

	@Action(value = "updateSalesForActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesForActivity() throws FLException {

		salesService.updateSalesForActivity(sales);

		return SUCCESS;
	}

	@Action(value = "updateSalesForBelong", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesForBelong() throws FLException {

		salesService.updateSalesForBelong(sales);

		return SUCCESS;
	}

	@Action(value = "updateSalesForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesForAdvance() throws FLException {

		salesService.updateSalesForAdvance(sales);

		return SUCCESS;
	}

	@Action(value = "sendSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendSales() throws FLException {

		salesService.sendSales(sales);

		return SUCCESS;
	}

	@Action(value = "affirmSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affirmSales() throws FLException {

		salesService.affirmSales(sales);

		return SUCCESS;
	}

	@Action(value = "terminalSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String terminalSales() throws FLException {

		salesService.terminalSales(sales);

		return SUCCESS;
	}

	@Action(value = "finishSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishSales() throws FLException {

		salesService.finishSales(sales, queryUserId());

		return SUCCESS;
	}

	public SalesItemVO getSalesItem() {
		return salesItem;
	}

	public void setSalesItem(SalesItemVO salesItem) {
		this.salesItem = salesItem;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public List<SalesItemVO> getSalesItems() {
		return salesItems;
	}

	public void setSalesItems(List<SalesItemVO> salesItems) {
		this.salesItems = salesItems;
	}

	public List<Long> getSids() {
		return sids;
	}

	public void setSids(List<Long> sids) {
		this.sids = sids;
	}
}
