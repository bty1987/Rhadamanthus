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
import com.fanglin.inventory.vo.SalesItemVO;
import com.fanglin.inventory.vo.SalesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesItemAction extends BaseListAction  {


	private static final long serialVersionUID = 3474050727800940828L;
	
	@Autowired
	private SalesItemService salesItemService;
	
	private SalesVO sales;
	
	private SalesItemVO salesItem;
	
	private List<SalesItemVO> salesItems;
	
	@Action(value = "querySalesItemBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesItemBySid(){
		
		salesItems = salesItemService.querySalesItemBySid(sales);
		
		return SUCCESS;
	}
	
	@Action(value = "addSalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesItem() throws FLException{
		
		salesItemService.addSalesItem(sales, salesItem);
		
		return SUCCESS;
	}
	
	@Action(value = "updateSalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesItem() throws FLException{
		
		salesItemService.updateSalesItem(salesItem);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteSalesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSalesItem() throws FLException{
		
		salesItemService.deleteSalesItem(salesItem);
		
		return SUCCESS;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public SalesItemVO getSalesItem() {
		return salesItem;
	}

	public void setSalesItem(SalesItemVO salesItem) {
		this.salesItem = salesItem;
	}

	public List<SalesItemVO> getSalesItems() {
		return salesItems;
	}

	public void setSalesItems(List<SalesItemVO> salesItems) {
		this.salesItems = salesItems;
	}


}
