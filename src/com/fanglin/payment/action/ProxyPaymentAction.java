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
import com.fanglin.payment.service.ProxyPaymentService;
import com.fanglin.payment.service.ProxyReceiptService;
import com.fanglin.payment.vo.ProxyPaymentVO;
import com.fanglin.payment.vo.ProxyReceiptVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProxyPaymentAction extends BaseListAction {

	private static final long serialVersionUID = 89774400336703129L;

	@Autowired
	private ProxyPaymentService proxyPaymentService;

	@Autowired
	private ProxyReceiptService proxyReceiptService;

	private ProxyPaymentVO proxyPayment;

	private ProxyReceiptVO proxyReceipt;

	private List<Long> ppids;

	private List<Long> ptids;

	@Action(value = "pageProxyPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageProxyPayment() throws FLException {

		proxyPaymentService.pageProxyPayment(getPaging(), getFilters(), proxyPayment, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryProxyPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProxyPayment() throws FLException {

		proxyPayment = proxyPaymentService.queryProxyPayment(proxyPayment);

		return SUCCESS;
	}

	@Action(value = "queryProxyReceiptByPrId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProxyReceiptByPrId() throws FLException {

		proxyReceipt = proxyReceiptService.queryProxyReceiptByPrId(proxyReceipt);

		return SUCCESS;
	}

	@Action(value = "addProxyPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addProxyPayment() throws FLException {

		proxyPaymentService.addProxyPayment(proxyPayment, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "collectProxyPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectProxyPayment() throws FLException {

		proxyPaymentService.collectProxyPayment(proxyPayment, proxyReceipt, ptids, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refundProxyPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundProxyPayment() throws FLException {

		proxyPaymentService.refundProxyPayment(proxyPayment, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "confirmProxyPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmProxyPayment() throws FLException, Exception {

		proxyPaymentService.confirmProxyPayment(ppids, queryUserId());

		return SUCCESS;
	}

	@Action(value = "cancelProxyPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelProxyPayment() throws FLException, Exception {

		proxyPaymentService.cancelProxyPayment(proxyPayment);

		return SUCCESS;
	}

	public ProxyPaymentVO getProxyPayment() {
		return proxyPayment;
	}

	public void setProxyPayment(ProxyPaymentVO proxyPayment) {
		this.proxyPayment = proxyPayment;
	}

	public ProxyReceiptVO getProxyReceipt() {
		return proxyReceipt;
	}

	public void setProxyReceipt(ProxyReceiptVO proxyReceipt) {
		this.proxyReceipt = proxyReceipt;
	}

	public List<Long> getPpids() {
		return ppids;
	}

	public void setPpids(List<Long> ppids) {
		this.ppids = ppids;
	}

	public List<Long> getPtids() {
		return ptids;
	}

	public void setPtids(List<Long> ptids) {
		this.ptids = ptids;
	}
}
