package com.fanglin.payment.action;

import java.util.List;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.SalesPaymentService;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.payment.vo.SalesReceiptVO;
import com.fanglin.sales.vo.SalesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesPaymentAction extends BaseListAction {

	private static final long serialVersionUID = 4937818909374829481L;

	@Autowired
	private SalesPaymentService salesPaymentService;
	
	private SalesPaymentVO salesPayment;
	
	private List<SalesPaymentVO> salesPayments;
	
	private SalesReceiptVO salesReceipt;
	
	private SalesVO sales;
	
	private List<Long> spids;
	
	@Action(value = "pageSalesPaymentForInit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesPaymentForInit(){
		
		salesPaymentService.pageSalesPaymentForInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageSalesPaymentForCollect", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesPaymentForCollect(){
		
		salesPaymentService.pageSalesPaymentForCollect(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageSalesPaymentForConfirm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesPaymentForConfirm(){
		
		salesPaymentService.pageSalesPaymentForConfirm(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageSalesPaymentForNotInit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesPaymentForNotInit(){
		
		salesPaymentService.pageSalesPaymentForNotInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesPaymentBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPaymentBySid(){
		
		salesPayments = salesPaymentService.querySalesPaymentBySid(salesPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesPaymentByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPaymentByOrderId(){
		
		salesPayments = salesPaymentService.querySalesPaymentByOrderId(sales);
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesPaymentForNotInitBySrid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPaymentForNotInitBySrid(){
		
		salesPayments = salesPaymentService.querySalesPaymentForNotInitBySrid(salesReceipt);
		
		return SUCCESS;
	}
	
	@Action(value = "addSalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesPayment() throws FLException{
		
		salesPaymentService.addSalesPayment(salesPayment, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "collectSalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectSalesPayment() throws FLException{
		
		salesPaymentService.collectSalesPayment(salesPayment, salesReceipt, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "collectSalesPayments", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectSalesPayments() throws FLException{
		
		salesPaymentService.collectSalesPayments(spids,salesPayment, salesReceipt, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "collectSalesPaymentForRefund", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectSalesPaymentForRefund() throws FLException{
		
		salesPaymentService.collectSalesPaymentForRefund(salesPayment, salesReceipt,queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "confirmSalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmSalesPayment() throws FLException{
		
		salesPaymentService.confirmSalesPayment(spids, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "cancelSalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelSalesPayment() throws FLException{
		
		salesPaymentService.cancelSalesPayment(salesPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "refundSalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundSalesPayment() throws FLException{
		
		salesPaymentService.refundSalesPayment(salesPayment, queryUserId());
		
		return SUCCESS;
	}
	
	public SalesPaymentVO getSalesPayment() {
		return salesPayment;
	}

	public void setSalesPayment(SalesPaymentVO salesPayment) {
		this.salesPayment = salesPayment;
	}
	
	public List<SalesPaymentVO> getSalesPayments() {
		return salesPayments;
	}

	public void setSalesPayments(List<SalesPaymentVO> salesPayments) {
		this.salesPayments = salesPayments;
	}
	
	public SalesReceiptVO getSalesReceipt() {
		return salesReceipt;
	}

	public void setSalesReceipt(SalesReceiptVO salesReceipt) {
		this.salesReceipt = salesReceipt;
	}
	
	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}
	
	public List<Long> getSpids() {
		return spids;
	}

	public void setSpids(List<Long> spids) {
		this.spids = spids;
	}
	
}
