package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.SalesItemService;
import com.fanglin.inventory.service.SalesService;
import com.fanglin.inventory.vo.SalesItemVO;
import com.fanglin.inventory.vo.SalesVO;

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
	public String pageSales() throws FLException{
		
		salesService.pageSales(getPaging(), getFilters(),queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "pageSalesForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesForBalance() throws FLException{
		
		salesService.pageSalesForBalance(getPaging(), getFilters(),queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesBySid() throws FLException{
		
		sales = salesService.querySalesBySid(sales);
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesByNo() throws FLException{
		
		sales = salesService.querySalesByNo(sales);
		
		return SUCCESS;
	}
	
	@Action(value = "addSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSales() throws FLException{
		
		salesService.addSales(sales, salesItems,queryCompany()); 
		
		return SUCCESS;
	}
	
	@Action(value = "updateSalesForCoupon", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesForCoupon() throws FLException{
		
		salesService.updateSalesForCoupon(sales);
		
		return SUCCESS;
	}
	
	@Action(value = "updateSalesForMaling", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesForMaling() throws FLException{
		
		salesService.updateSalesForMaling(sales);
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesItemBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesItemBySid(){
		
		salesItems = salesItemService.querySalesItemBySid(sales);
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesItemBySids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesItemBySids(){
		
		salesItems = salesItemService.querySalesItemBySids(sids);
		
		return SUCCESS;
	}
	
	@Action(value = "addSalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesItem() throws FLException{
		
		salesItemService.addSalesItem(sales, salesItems);
		
		return SUCCESS;
	}
	
	@Action(value = "updateSalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesItem() throws FLException{
		
		salesItemService.updateSalesItem(salesItem);
		
		return SUCCESS;
	}
	
	@Action(value = "updateSalesItemForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesItemForBalance() throws FLException{
		
		salesItemService.updateSalesItemForBalance(salesItem);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteSalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSalesItem() throws FLException{
		
		salesItemService.deleteSalesItem(salesItem);
		
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
