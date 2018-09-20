package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.AdvanceService;
import com.fanglin.customer.service.DecorationPaymentService;
import com.fanglin.customer.service.MaterialPaymentService;
import com.fanglin.customer.service.PaymentService;
import com.fanglin.customer.service.SalesPaymentService;
import com.fanglin.customer.service.ServicePaymentService;
import com.fanglin.customer.vo.AdvanceVO;
import com.fanglin.customer.vo.DecorationPaymentVO;
import com.fanglin.customer.vo.MaterialPaymentVO;
import com.fanglin.customer.vo.PaymentVO;
import com.fanglin.customer.vo.SalesPaymentVO;
import com.fanglin.customer.vo.ServicePaymentVO;

@ParentPackage("common")
@Namespace("/")
@Controller("PaymentOrderAction")
public class PaymentAction extends BaseListAction {

	private static final long serialVersionUID = -5147550362380249742L;
	
	@Autowired
	private MaterialPaymentService materialPaymentService;
	
	@Autowired
	private DecorationPaymentService decorationPaymentService;
	
	@Autowired
	private ServicePaymentService servicePaymentOrderService;
	
	@Autowired
	private SalesPaymentService salesPaymentService;
	
	@Autowired
	private AdvanceService advanceService;
	
	@Autowired
	private PaymentService paymentService;
	
	private AdvanceVO advance;
	
	private DecorationPaymentVO decorationPayment;
	
	private MaterialPaymentVO materialPayment;
	
	private ServicePaymentVO servicePayment;
	
	private SalesPaymentVO salesPayment;
	
	private PaymentVO payment;
	
	private String unionId;
	
	@Action(value = "queryCusMaterialPayment", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String queryCusMaterialPayment(){
		
		materialPaymentService.queryCusMaterialPayment(getPaging(), getFilters(), materialPayment, unionId);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCusDecorationPayment", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String queryCusDecorationPayment(){
		
		decorationPaymentService.queryCusDecorationPayment(getPaging(), getFilters(), decorationPayment,unionId);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCusServicePayment", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String queryCusServicePayment(){
		
		servicePaymentOrderService.queryCusServicePayment(getPaging(), getFilters(), servicePayment,unionId);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCusAdvance", results = {@Result (name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String queryCusAdvance() throws FLException{
		
		advance = advanceService.queryCusAdvance(advance);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCusSalesPayment", results = {@Result (name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String queryCusSalesPayment() throws FLException{
		
		salesPaymentService.queryCusSalesPayment(getPaging(), getFilters(), salesPayment,unionId);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCusPayment", results = {@Result (name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String queryCusPayment() throws FLException{
		
		paymentService.queryCusPayment(getPaging(), getFilters(), payment,unionId);
		
		return SUCCESS;
	}

	public AdvanceVO getAdvance() {
		return advance;
	}

	public void setAdvance(AdvanceVO advance) {
		this.advance = advance;
	}

	public DecorationPaymentVO getDecorationPayment() {
		return decorationPayment;
	}

	public void setDecorationPayment(DecorationPaymentVO decorationPayment) {
		this.decorationPayment = decorationPayment;
	}

	public ServicePaymentVO getServicePayment() {
		return servicePayment;
	}

	public void setServicePayment(ServicePaymentVO servicePayment) {
		this.servicePayment = servicePayment;
	}

	public SalesPaymentVO getSalesPayment() {
		return salesPayment;
	}

	public void setSalesPayment(SalesPaymentVO salesPayment) {
		this.salesPayment = salesPayment;
	}

	public PaymentVO getPayment() {
		return payment;
	}

	public void setPayment(PaymentVO payment) {
		this.payment = payment;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public MaterialPaymentVO getMaterialPayment() {
		return materialPayment;
	}

	public void setMaterialPayment(MaterialPaymentVO materialPayment) {
		this.materialPayment = materialPayment;
	}

	
}
