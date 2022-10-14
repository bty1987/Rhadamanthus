package com.fanglin.payment.action;

import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.payment.service.ActivityPaymentService;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.service.PaymentContractService;
import com.fanglin.payment.service.PaymentService;
import com.fanglin.payment.service.PaytranService;
import com.fanglin.payment.service.SalesPaymentService;
import com.fanglin.payment.vo.ActivityPaymentVO;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.payment.vo.PaymentContractVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.payment.vo.PaytranVO;
import com.fanglin.payment.vo.SalesPaymentVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class PaymentCommonAction extends BaseListAction {

	private static final long serialVersionUID = -2007495587213689831L;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private DecorationPaymentService decorationPaymentService;

	@Autowired
	private SalesPaymentService salesPaymentService;

	@Autowired
	private ActivityPaymentService activityPaymentService;

	@Autowired
	private PaymentContractService paymentContractService;

	@Autowired
	private PaytranService paytranService;

	private List<PaymentContractVO> paymentContracts;

	private PaymentContractVO paymentContract;

	private ActivityPaymentVO activityPayment;

	private PaymentVO payment;

	private DecorationPaymentVO decorationPayment;

	private SalesPaymentVO salesPayment;

	private PaytranVO paytran;

	private Wxpay wxpay;

	private String redirect;

	@Action(value = "divisionCallback", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String divisionCallback() throws FLException {

		Map<String, String[]> params = request.getParameterMap();

		System.out.println(JSONObject.toJSON(params));

		System.out.println("---------------------------division callback---------------------------");

		System.out.println(String.format("code: %s", request.getParameter("code")));
		System.out.println(String.format("msg: %s", request.getParameter("msg")));
		System.out.println(String.format("note: %s", request.getParameter("note")));

		System.out.println(String.format("payee_usercode: %s", request.getParameter("payee_usercode")));
		System.out.println(String.format("sref_no: %s", request.getParameter("sref_no")));
		System.out.println(String.format("term_no: %s", request.getParameter("term_no")));
		System.out.println(String.format("total_amount: %s", request.getParameter("total_amount")));

		System.out.println(String.format("division_mode: %s", request.getParameter("division_mode")));
		System.out.println(String.format("division_status: %s", request.getParameter("division_status")));
		System.out.println(String.format("division_status_code: %s", request.getParameter("division_status_code")));

		System.out.println(String.format("account_date: %s", request.getParameter("account_date")));
		System.out.println(String.format("updatetime: %s", request.getParameter("updatetime")));

		System.out.println(String.format("detailResults: %s", request.getParameter("detailResults")));

		System.out.println(String.format("sign: %s", request.getParameter("sign")));

		return SUCCESS;
	}

	@Action(value = "queryPaymentByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentByPid() throws FLException {

		payment = paymentService.queryPaymentByPaymentId(payment);

		return SUCCESS;
	}

	@Action(value = "queryDecorationPaymentByDpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationPaymentByDpid() throws FLException {

		decorationPayment = decorationPaymentService.queryDecorationPaymentByDpid(decorationPayment);

		return SUCCESS;
	}

	@Action(value = "querySalesPaymentBySpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPaymentBySpid() throws FLException {

		salesPayment = salesPaymentService.querySalesPaymentBySpid(salesPayment);

		return SUCCESS;
	}

	@Action(value = "queryPaytranByPtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaytranByPtid() throws FLException {

		paytran = paytranService.queryPaytranByPtid(paytran);

		return SUCCESS;
	}

	@Action(value = "queryActivityPaymentByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryActivityPaymentByNo() throws FLException {

		activityPaymentService.queryActivityPaymentByNo(activityPayment);

		return SUCCESS;
	}

	@Action(value = "pollingPaymentContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pollingPaymentContract() throws FLException {

		paymentContractService.pagePaymentContract(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "redirectPaymentContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String redirectPaymentContract() throws FLException {

		redirect = paymentContractService.redirectPaymentContract(paymentContract);

		return SUCCESS;
	}

	@Action(value = "wxpay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String wxpay() throws FLException {

		paytranService.wxpay(wxpay);

		return SUCCESS;
	}

	public List<PaymentContractVO> getPaymentContracts() {
		return paymentContracts;
	}

	public void setPaymentContracts(List<PaymentContractVO> paymentContracts) {
		this.paymentContracts = paymentContracts;
	}

	public PaymentContractVO getPaymentContract() {
		return paymentContract;
	}

	public void setPaymentContract(PaymentContractVO paymentContract) {
		this.paymentContract = paymentContract;
	}

	public ActivityPaymentVO getActivityPayment() {
		return activityPayment;
	}

	public void setActivityPayment(ActivityPaymentVO activityPayment) {
		this.activityPayment = activityPayment;
	}

	public PaymentVO getPayment() {
		return payment;
	}

	public void setPayment(PaymentVO payment) {
		this.payment = payment;
	}

	public DecorationPaymentVO getDecorationPayment() {
		return decorationPayment;
	}

	public void setDecorationPayment(DecorationPaymentVO decorationPayment) {
		this.decorationPayment = decorationPayment;
	}

	public SalesPaymentVO getSalesPayment() {
		return salesPayment;
	}

	public void setSalesPayment(SalesPaymentVO salesPayment) {
		this.salesPayment = salesPayment;
	}

	public PaytranVO getPaytran() {
		return paytran;
	}

	public void setPaytran(PaytranVO paytran) {
		this.paytran = paytran;
	}

	public Wxpay getWxpay() {
		return wxpay;
	}

	public void setWxpay(Wxpay wxpay) {
		this.wxpay = wxpay;
	}

	public String getRedirect() {
		return redirect;
	}

	public void setRedirect(String redirect) {
		this.redirect = redirect;
	}

}
