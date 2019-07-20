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
import com.fanglin.sales.service.SalesActivityService;
import com.fanglin.sales.vo.SalesActivityItemVO;
import com.fanglin.sales.vo.SalesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesActivityAction extends BaseListAction {

	private static final long serialVersionUID = -5034707429644411659L;
	
	@Autowired
	private SalesActivityService salesActivityService;
	
	private List<SalesActivityItemVO> saleActivityItems;
	
	private SalesVO sales;
	
	private SalesActivityItemVO salesActivityItem;
	
	private String orderId;
	
	private Object salesActivitys;
	
	@Action(value="querySalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String querySalesActivityItem() throws FLException{
		
		saleActivityItems = salesActivityService.querySalesActivityItem(orderId);
		
		return SUCCESS;
	}
	
	@Action(value="querySalesActivity", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String querySalesActivity() throws FLException{
		
		salesActivitys=salesActivityService.querySalesActivity(orderId);
		
		return SUCCESS;
	}
	
	@Action(value="addSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addSalesActivityItem() throws FLException{
		
		salesActivityService.addSalesActivityItem(saleActivityItems);
		
		return SUCCESS;
	}
	
	@Action(value="abateSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String abateSalesActivityItem() throws FLException{
		
		salesActivityService.abateSalesActivityItem(salesActivityItem, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="receiveSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String receiveSalesActivityItem() throws FLException{
		
		salesActivityService.receiveSalesActivityItem(salesActivityItem, queryUserId(), queryUserName());
		
		return SUCCESS;
	}
	
	@Action(value="deliveSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deliveSalesActivityItem() throws FLException{
		
		salesActivityService.deliveSalesActivityItem(salesActivityItem, queryUserId(), queryUserName());
		
		return SUCCESS;
	}
	
	@Action(value="unrefundSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String unrefundSalesActivityItem() throws FLException{
		
		salesActivityService.unrefundSalesActivityItem(salesActivityItem);
		
		return SUCCESS;
	}
	
	@Action(value="refundSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String refundSalesActivityItem() throws FLException{
		
		salesActivityService.refundSalesActivityItem(salesActivityItem, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="expendSalesActivityItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String expendSalesActivityItem() throws FLException{
		
		salesActivityService.expendSalesActivityItem(salesActivityItem);
		
		return SUCCESS;
	}

	public List<SalesActivityItemVO> getSaleActivityItems() {
		return saleActivityItems;
	}

	public void setSaleActivityItems(List<SalesActivityItemVO> saleActivityItems) {
		this.saleActivityItems = saleActivityItems;
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

	public Object getSalesActivitys() {
		return salesActivitys;
	}

	public void setSalesActivitys(Object salesActivitys) {
		this.salesActivitys = salesActivitys;
	}

}
