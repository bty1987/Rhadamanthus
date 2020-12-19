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
import com.fanglin.payment.service.PaymentFunctionService;
import com.fanglin.payment.vo.PaymentFunctionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PaymentFunctionAction extends BaseListAction {

	private static final long serialVersionUID = -9022056208512794697L;

	@Autowired
	private PaymentFunctionService paymentFunctionService;
	
	private List<PaymentFunctionVO> paymentFunctions;
	
	private PaymentFunctionVO paymentFunction;
	
	@Action(value = "queryPaymentFunction", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentFunction() throws FLException{
		
		paymentFunctions = paymentFunctionService.queryPaymentFunction(paymentFunction);
		
		return SUCCESS;
	}

	public List<PaymentFunctionVO> getPaymentFunctions() {
		return paymentFunctions;
	}

	public void setPaymentFunctions(List<PaymentFunctionVO> paymentFunctions) {
		this.paymentFunctions = paymentFunctions;
	}

	public PaymentFunctionVO getPaymentFunction() {
		return paymentFunction;
	}

	public void setPaymentFunction(PaymentFunctionVO paymentFunction) {
		this.paymentFunction = paymentFunction;
	}
	
}
