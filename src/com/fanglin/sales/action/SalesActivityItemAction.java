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
import com.fanglin.sales.service.SalesActivityItemService;
import com.fanglin.sales.vo.SalesActivityItemVO;
import com.fanglin.sales.vo.SalesActivityVO;
import com.fanglin.sales.vo.SalesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesActivityItemAction extends BaseListAction {

	private static final long serialVersionUID = -5034707429644411659L;
	
	@Autowired
	private SalesActivityItemService salesActivityItemService;
	
	private List<SalesActivityItemVO> salesActivityItems;
	
	private SalesVO sales;
	
	private SalesActivityItemVO salesActivityItem;
	
	private SalesActivityVO salesActivity;
	
	private String orderId;
	
	@Action(value="querySalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String querySalesActivityItem() throws FLException{
		
		salesActivityItems = salesActivityItemService.querySalesActivityItem(orderId);
		
		return SUCCESS;
	}
	
	@Action(value="addSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addSalesActivityItem() throws FLException{
		
		salesActivityItemService.addSalesActivityItem(salesActivity, salesActivityItems,queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="abateSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String abateSalesActivityItem() throws FLException{
		
		salesActivityItemService.abateSalesActivityItem(salesActivityItem, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="receiveSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String receiveSalesActivityItem() throws FLException{
		
		salesActivityItemService.receiveSalesActivityItem(salesActivityItem, queryUserId(), queryUserName());
		
		return SUCCESS;
	}
	
	@Action(value="deliveSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deliveSalesActivityItem() throws FLException{
		
		salesActivityItemService.deliveSalesActivityItem(salesActivityItem, queryUserId(), queryUserName());
		
		return SUCCESS;
	}
	
	@Action(value="unrefundSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String unrefundSalesActivityItem() throws FLException{
		
		salesActivityItemService.unrefundSalesActivityItem(salesActivityItem,queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="refundSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String refundSalesActivityItem() throws FLException{
		
		salesActivityItemService.refundSalesActivityItem(salesActivityItem, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="expendSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String expendSalesActivityItem() throws FLException{
		
		salesActivityItemService.expendSalesActivityItem(salesActivityItem,queryUserId());
		
		return SUCCESS;
	}
	
	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public SalesActivityItemVO getSalesActivityItem() {
		return salesActivityItem;
	}

	public void setSalesActivityItem(SalesActivityItemVO salesActivityItem) {
		this.salesActivityItem = salesActivityItem;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public SalesActivityVO getSalesActivity() {
		return salesActivity;
	}

	public void setSalesActivity(SalesActivityVO salesActivity) {
		this.salesActivity = salesActivity;
	}

	public List<SalesActivityItemVO> getSalesActivityItems() {
		return salesActivityItems;
	}

	public void setSalesActivityItems(List<SalesActivityItemVO> salesActivityItems) {
		this.salesActivityItems = salesActivityItems;
	}
	
}
