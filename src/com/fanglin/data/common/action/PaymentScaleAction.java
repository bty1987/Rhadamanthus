package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.PaymentScaleService;
import com.fanglin.data.common.vo.PaymentScaleVO;

@Controller
@ParentPackage("base")
@Namespace("/")
public class PaymentScaleAction extends BaseListAction {

	private static final long serialVersionUID = 664666491070669653L;

	@Autowired
	private PaymentScaleService paymentScaleService;

	private PaymentScaleVO paymentScale;

	private List<PaymentScaleVO> paymentScales;

	@Action(value = "queryPaymentScale", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentScale() throws FLException {

		paymentScales = paymentScaleService.queryPaymentScale(paymentScale, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addPaymentScale", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPaymentScale() throws FLException {

		paymentScaleService.addPaymentScale(paymentScale, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updatePaymentScaleForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePaymentScaleForStatus() throws FLException {

		paymentScaleService.updatePaymentScaleForStatus(paymentScale);

		return SUCCESS;
	}

	@Action(value = "deletePaymentScale", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePaymentScale() throws FLException {

		paymentScaleService.deletePaymentScale(paymentScale);

		return SUCCESS;
	}

	public PaymentScaleVO getPaymentScale() {
		return paymentScale;
	}

	public void setPaymentScale(PaymentScaleVO paymentScale) {
		this.paymentScale = paymentScale;
	}

	public List<PaymentScaleVO> getPaymentScales() {
		return paymentScales;
	}

	public void setPaymentScales(List<PaymentScaleVO> paymentScales) {
		this.paymentScales = paymentScales;
	}

}
