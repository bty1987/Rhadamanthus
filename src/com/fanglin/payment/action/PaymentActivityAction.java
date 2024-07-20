package com.fanglin.payment.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.PaymentActivityService;
import com.fanglin.payment.vo.PaymentActivityVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PaymentActivityAction extends BaseListAction {

	private static final long serialVersionUID = 4481159842627240870L;

	@Autowired
	private PaymentActivityService paymentActivityService;

	private PaymentActivityVO paymentActivity;

	private Integer amount;

	@Action(value = "pagePaymentActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePaymentActivity() throws FLException {

		paymentActivityService.pagePaymentActivity(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "amountPaymentActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountPaymentActivity() throws FLException {

		amount = paymentActivityService.amountPaymentActivity(paymentActivity);

		return SUCCESS;
	}

	@Action(value = "updatePaymentActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePaymentActivity() throws FLException {

		paymentActivityService.updatePaymentActivity(paymentActivity);

		return SUCCESS;
	}

	@Action(value = "deletePaymentActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePaymentActivity() throws FLException {

		paymentActivityService.deletePaymentActivity(paymentActivity);

		return SUCCESS;
	}

	public PaymentActivityVO getPaymentActivity() {
		return paymentActivity;
	}

	public void setPaymentActivity(PaymentActivityVO paymentActivity) {
		this.paymentActivity = paymentActivity;
	}

	public Integer getAmount() {
		return amount;
	}

	public void setAmount(Integer amount) {
		this.amount = amount;
	}

}
