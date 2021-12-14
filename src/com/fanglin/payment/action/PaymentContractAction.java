package com.fanglin.payment.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.payment.service.PaymentContractService;
import com.fanglin.payment.vo.PaymentContractVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PaymentContractAction extends BaseListAction {

	private static final long serialVersionUID = -1427445444240822603L;

	private PaymentContractVO paymentContract;

	private List<PaymentContractVO> paymentContracts;

	private CustomerVO customer;

	private SignetVO signet;

	private String redirect;

	@Autowired
	private PaymentContractService paymentContractService;

	@Action(value = "pagePaymentContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePaymentContract() throws FLException {

		paymentContractService.pagePaymentContract(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryPaymentContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentContract() throws FLException {

		paymentContract = paymentContractService.queryPaymentContract(paymentContract);

		return SUCCESS;
	}

	@Action(value = "sendPaymentContractForAuth", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendPaymentContractForAuth() throws FLException {

		paymentContractService.sendPaymentContractForAuth(paymentContract);

		return SUCCESS;
	}

	@Action(value = "sendPaymentContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendPaymentContract() throws FLException {

		paymentContractService.sendPaymentContract(paymentContract);

		return SUCCESS;
	}

	@Action(value = "viewPaymentContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String viewPaymentContract() throws FLException {

		redirect = paymentContractService.viewPaymentContract(paymentContract);

		return SUCCESS;
	}

	@Action(value = "signPaymentContractForCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signPaymentContractForCompany() throws FLException {

		redirect = paymentContractService.signPaymentContractForCompany(signet, paymentContract);

		return SUCCESS;
	}

	@Action(value = "signPaymentContractForCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signPaymentContractForCustomer() throws FLException {

		redirect = paymentContractService.signPaymentContractForCustomer(paymentContract, customer);

		return SUCCESS;
	}

	@Action(value = "addPaymentContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPaymentContract() throws FLException {

		paymentContract = paymentContractService.addPaymentContract(paymentContract, queryUserId());

		return SUCCESS;
	}

	@Action(value = "affixPaymentContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affixPaymentContract() throws FLException {

		paymentContractService.affixPaymentContract(paymentContract, queryUserId());

		return SUCCESS;
	}

	@Action(value = "expirePaymentContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String expirePaymentContract() throws FLException {

		paymentContractService.expirePaymentContract(paymentContract);

		return SUCCESS;
	}

	@Action(value = "filingPaymentContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String filingPaymentContract() throws FLException {

		paymentContractService.filingPaymentContract(paymentContract, queryUserId());

		return SUCCESS;
	}

	public PaymentContractVO getPaymentContract() {
		return paymentContract;
	}

	public void setPaymentContract(PaymentContractVO paymentContract) {
		this.paymentContract = paymentContract;
	}

	public List<PaymentContractVO> getPaymentContracts() {
		return paymentContracts;
	}

	public void setPaymentContracts(List<PaymentContractVO> paymentContracts) {
		this.paymentContracts = paymentContracts;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public SignetVO getSignet() {
		return signet;
	}

	public void setSignet(SignetVO signet) {
		this.signet = signet;
	}

	public String getRedirect() {
		return redirect;
	}

	public void setRedirect(String redirect) {
		this.redirect = redirect;
	}

}
