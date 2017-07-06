/**
 * Title: PaymentAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

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
import com.fanglin.payment.service.PaymentService;
import com.fanglin.payment.vo.PaymentVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PaymentAction extends BaseListAction {

	private static final long serialVersionUID = -2224739825533869496L;
	
	@Autowired
	private PaymentService paymentService;
	
	private PaymentVO payment;
	
	private List<PaymentVO> payments;

	private List<Integer> paymentIds;
	
	@Action(value = "pagePaymentForHistory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePaymentForHistory(){
		
		paymentService.pagePaymentForHistory(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryPaymentByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentByOrderId() throws FLException{
		
		payments = paymentService.queryPaymentByOrderId(payment);
		
		return SUCCESS;
	}
	
	@Action(value = "queryPaymentByPaymentId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentByPaymentId() throws FLException{
		
		payment = paymentService.queryPaymentByPaymentId(payment, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "collectPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectPayment() throws FLException{
		
		paymentService.collectPayment(payment, queryUserId());
		
		return SUCCESS;
	}

	@Action(value = "confirmPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmPayment() throws FLException{
		
		paymentService.confirmPayment(paymentIds, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "updatePayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePayment() throws FLException{
		
		paymentService.updatePayment(payment);
		
		return SUCCESS;
	}
	
	@Action(value = "payPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String payPayment() throws FLException{
		
		paymentService.payPayment(payment, queryUserId());
		
		return SUCCESS;
	}

	@Action(value = "withdrawPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String withdrawPayment() throws FLException{
		
		paymentService.withdrawPayment(payment, queryUserId());
		
		return SUCCESS;
	}
	
	public List<PaymentVO> getPayments() {
		return payments;
	}

	public void setPayments(List<PaymentVO> payments) {
		this.payments = payments;
	}

	public PaymentVO getPayment(){
		return payment;
	}

	public void setPayment(PaymentVO payment){
		this.payment = payment;
	}

	public List<Integer> getPaymentIds(){
		return paymentIds;
	}

	public void setPaymentIds(List<Integer> paymentIds){
		this.paymentIds = paymentIds;
	}

}
