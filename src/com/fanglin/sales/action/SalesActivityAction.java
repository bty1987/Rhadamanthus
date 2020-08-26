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
import com.fanglin.sales.vo.SalesActivityVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesActivityAction extends BaseListAction {

	private static final long serialVersionUID = -5034707429644411659L;
	
	@Autowired
	private SalesActivityService salesActivityService;
	
	private List<SalesActivityVO> salesActivitys;
	
	private SalesActivityVO salesActivity;
	
	private String orderId;
	
	
	@Action(value="pageSalesActivity", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageSalesActivity() throws FLException{
		
		salesActivityService.pageSalesActivity(getPaging(), getFilters(), orderId);
		
		return SUCCESS;
	}
	
	@Action(value="amountSalesActivity", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String amountSalesActivity() throws FLException{
		
		salesActivitys = salesActivityService.amountSalesActivity(orderId);
		
		return SUCCESS;
	}
	
	@Action(value="amountSalesActivityForActivity", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String amountSalesActivityForActivity() throws FLException{
		
		salesActivityService.amountSalesActivityForActivity(salesActivity);
		
		return SUCCESS;
	}
	
	@Action(value="amountSalesActivityForPayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String amountSalesActivityForPayment() throws FLException{
		
		salesActivityService.amountSalesActivityForPayment(salesActivity);
		
		return SUCCESS;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public List<SalesActivityVO> getSalesActivitys() {
		return salesActivitys;
	}

	public void setSalesActivitys(List<SalesActivityVO> salesActivitys) {
		this.salesActivitys = salesActivitys;
	}

	public SalesActivityVO getSalesActivity() {
		return salesActivity;
	}

	public void setSalesActivity(SalesActivityVO salesActivity) {
		this.salesActivity = salesActivity;
	}
	
}
