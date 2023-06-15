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
import com.fanglin.payment.service.ServicePaymentService;
import com.fanglin.payment.service.ServiceReceiptService;
import com.fanglin.payment.vo.ServicePaymentVO;
import com.fanglin.payment.vo.ServiceReceiptVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ServicePaymentAction extends BaseListAction {

	private static final long serialVersionUID = -5585524435881500186L;

	@Autowired
	private ServicePaymentService servicePaymentService;

	@Autowired
	private ServiceReceiptService serviceReceiptService;

	private ServicePaymentVO servicePayment;

	private List<ServicePaymentVO> servicePayments;

	private ServiceReceiptVO serviceReceipt;

	private List<Long> spIds;

	private List<Long> ptids;

	@Action(value = "pageServicePayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageServicePayment() throws FLException {

		servicePaymentService.pageServicePayment(getPaging(), getFilters(), servicePayment, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryServicePaymentByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryServicePaymentByOrderId() throws FLException {

		servicePayments = servicePaymentService.queryServicePaymentByOrderId(servicePayment);

		return SUCCESS;
	}

	@Action(value = "queryServicePaymentForNotInitBySrId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryServicePaymentForNotInitBySrId() throws FLException {

		servicePayments = servicePaymentService.queryServicePaymentForNotInitBySrId(serviceReceipt);

		return SUCCESS;
	}

	@Action(value = "queryServicePaymentBySpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryServicePaymentBySpid() throws FLException {

		servicePayment = servicePaymentService.queryServicePaymentBySpid(servicePayment);

		return SUCCESS;
	}

	@Action(value = "queryServiceReceiptBySrId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryServiceReceiptBySrId() throws FLException {

		serviceReceipt = serviceReceiptService.queryServiceReceiptBySrId(serviceReceipt);

		return SUCCESS;
	}

	@Action(value = "makeServicePayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeServicePayment() throws FLException {

		servicePaymentService.makeServicePayment(servicePayment, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "collectServicePayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectServicePayment() throws FLException {

		servicePaymentService.collectServicePayment(servicePayment, serviceReceipt, ptids, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "collectServicePaymentForService", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectServicePaymentForService() throws FLException {

		servicePaymentService.collectServicePaymentForService(servicePayment, serviceReceipt, ptids, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refundServicePaymentForService", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundServicePaymentForService() throws FLException {

		servicePaymentService.refundServicePaymentForService(servicePayment, serviceReceipt, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "confirmServicePayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmServicePayment() throws FLException {

		servicePaymentService.confirmServicePayment(spIds, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateServicePayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateServicePayment() throws FLException {

		servicePaymentService.updateServicePayment(servicePayment, serviceReceipt);

		return SUCCESS;
	}

	@Action(value = "sendServicePayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendServicePayment() throws FLException {

		servicePaymentService.sendServicePayment(servicePayment);

		return SUCCESS;
	}

	public ServicePaymentVO getServicePayment() {
		return servicePayment;
	}

	public void setServicePayment(ServicePaymentVO servicePayment) {
		this.servicePayment = servicePayment;
	}

	public ServiceReceiptVO getServiceReceipt() {
		return serviceReceipt;
	}

	public void setServiceReceipt(ServiceReceiptVO serviceReceipt) {
		this.serviceReceipt = serviceReceipt;
	}

	public List<Long> getSpIds() {
		return spIds;
	}

	public void setSpIds(List<Long> spIds) {
		this.spIds = spIds;
	}

	public List<ServicePaymentVO> getServicePayments() {
		return servicePayments;
	}

	public void setServicePayments(List<ServicePaymentVO> servicePayments) {
		this.servicePayments = servicePayments;
	}

	public List<Long> getPtids() {
		return ptids;
	}

	public void setPtids(List<Long> ptids) {
		this.ptids = ptids;
	}

}
