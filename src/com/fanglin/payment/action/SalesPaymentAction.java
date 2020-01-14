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
	
	private List<Long> posids;
	
	private String companyType;
	
	@Action(value = "pageSalesPaymentForInit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesPaymentForInit() throws FLException{
		
		salesPaymentService.pageSalesPaymentForInit(getPaging(), getFilters(), queryCompany(), companyType);
		
		return SUCCESS;
	}
	
	@Action(value = "pageSalesPaymentForNotInit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesPaymentForNotInit() throws FLException{
		
		salesPaymentService.pageSalesPaymentForNotInit(getPaging(), getFilters(), queryCompany(), companyType);
		
		return SUCCESS;
	}
	
	@Action(value = "pageSalesPaymentForCollect", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesPaymentForCollect() throws FLException{
		
		salesPaymentService.pageSalesPaymentForCollect(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "pageSalesPaymentForConfirm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesPaymentForConfirm() throws FLException{
		
		salesPaymentService.pageSalesPaymentForConfirm(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPayment() throws FLException{
		
		salesPayments = salesPaymentService.querySalesPayment(getFilters(), queryCompany(), companyType);
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesPaymentByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPaymentByOrderId(){
		
		salesPayments = salesPaymentService.querySalesPaymentByOrderId(sales);
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesPaymentBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPaymentBySid(){
		
		salesPayments = salesPaymentService.querySalesPaymentBySid(salesPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesPaymentForNotInitBySrid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPaymentForNotInitBySrid(){
		
		salesPayments = salesPaymentService.querySalesPaymentForNotInitBySrid(salesReceipt);
		
		return SUCCESS;
	}
	
	@Action(value = "addSalesPaymentForDeposit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesPaymentForDeposit() throws FLException{
		
		salesPaymentService.addSalesPaymentForDeposit(salesPayment, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "addSalesPaymentForFullpay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesPaymentForFullpay() throws FLException{
		
		salesPaymentService.addSalesPaymentForFullpay(salesPayment, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "cancelSalesPaymentForDeposit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelSalesPaymentForDeposit() throws FLException{
		
		salesPaymentService.cancelSalesPaymentForDeposit(salesPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "cancelSalesPaymentForFullpay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelSalesPaymentForFullpay() throws FLException{
		
		salesPaymentService.cancelSalesPaymentForFullpay(salesPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "collectSalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectSalesPayment() throws FLException{
		
		salesPaymentService.collectSalesPayment(salesPayment, salesReceipt, posids, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "collectSalesPayments", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectSalesPayments() throws FLException{
		
		salesPaymentService.collectSalesPayments(spids,salesPayment, salesReceipt, posids, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "refundSalesPaymentForDeposit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundSalesPaymentForDeposit() throws FLException{
		
		salesPaymentService.refundSalesPaymentForDeposit(salesPayment, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "refundSalesPaymentForCoupon", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundSalesPaymentForCoupon() throws FLException{
		
		salesPaymentService.refundSalesPaymentForCoupon(sales, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "updateSalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesPayment() throws FLException{
		
		salesPaymentService.updateSalesPayment(salesPayment, salesReceipt);
		
		return SUCCESS;
	}
	
	@Action(value = "refundSalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundSalesPayment() throws FLException{
		
		salesPaymentService.refundSalesPayment(salesPayment, salesReceipt, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "confirmSalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmSalesPayment() throws FLException{
		
		salesPaymentService.confirmSalesPayment(spids, queryUserId());
		
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

	public List<Long> getPosids() {
		return posids;
	}

	public void setPosids(List<Long> posids) {
		this.posids = posids;
	}

	public String getCompanyType() {
		return companyType;
	}

	public void setCompanyType(String companyType) {
		this.companyType = companyType;
	}
	
}
