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
	
	private List<PaymentVO> payments;

	private PaymentVO payment;

	private List<Integer> paymentIds;

	private String status;
	
	private Integer customerAutoId;
	
	private String convertLeftType;
	
	private String convertRightType;
	
	private float convertCash;

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
	public String updatePayment(){
		
		paymentService.updatePayment(payment);
		
		return SUCCESS;
	}
	
	@Action(value = "withdrawPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String withdrawPayment() throws FLException{
		
		paymentService.withdrawPayment(payment, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "convertPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String convertPayment() throws FLException{
		
		paymentService.convertPayment(payment, convertLeftType, convertRightType, convertCash, queryUserId());
		
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

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public Integer getCustomerAutoId(){
		return customerAutoId;
	}

	public void setCustomerAutoId(Integer customerAutoId){
		this.customerAutoId = customerAutoId;
	}

	public String getConvertLeftType(){
		return convertLeftType;
	}

	public void setConvertLeftType(String convertLeftType){
		this.convertLeftType = convertLeftType;
	}

	public String getConvertRightType(){
		return convertRightType;
	}

	public void setConvertRightType(String convertRightType){
		this.convertRightType = convertRightType;
	}

	public float getConvertCash(){
		return convertCash;
	}

	public void setConvertCash(float convertCash){
		this.convertCash = convertCash;
	}

}
