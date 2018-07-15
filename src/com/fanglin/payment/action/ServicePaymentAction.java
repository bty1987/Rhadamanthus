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
import com.fanglin.payment.vo.AdvanceReceiptVO;
import com.fanglin.payment.vo.ServiceReceiptVO;
import com.fanglin.payment.service.ServicePaymentService;
import com.fanglin.payment.service.ServiceReceiptService;
import com.fanglin.payment.vo.ServicePaymentVO;

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
	
	private AdvanceReceiptVO advanceReceipt;
	
	private List<Long> spIds;
	
	@Action(value = "pageServicePaymentForCollect", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageServicePaymentForCollect(){
		
		servicePaymentService.pageServicePaymentForCollect(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageServicePaymentForConfirm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageServicePaymentForConfirm(){
		
		servicePaymentService.pageServicePaymentForConfirm(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryServicePaymentByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryServicePaymentByOrderId() throws FLException{
		
		servicePayments = servicePaymentService.queryServicePaymentByOrderId(servicePayment);
		
		return SUCCESS;
	}
	
	@Action(value = "queryServicePaymentForNotInitBySrId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryServicePaymentForNotInitBySrId() throws FLException{
		
		servicePayments = servicePaymentService.queryServicePaymentForNotInitBySrId(serviceReceipt);
		
		return SUCCESS;
	}
	
	@Action(value = "queryServiceReceiptBySrId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryServiceReceiptBySrId() throws FLException{
		
		serviceReceipt = serviceReceiptService.queryServiceReceiptBySrId(serviceReceipt);
		
		return SUCCESS;
	}
	
	@Action(value = "collectServicePayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectServicePayment() throws FLException{
		
		servicePaymentService.collectServicePayment(servicePayment, serviceReceipt, advanceReceipt, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "collectServicePaymentForService", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectServicePaymentForService() throws FLException{
		
		servicePaymentService.collectServicePaymentForService(servicePayment, serviceReceipt, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "refundServicePaymentForService", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundServicePaymentForService() throws FLException{
		
		servicePaymentService.refundServicePaymentForService(servicePayment, serviceReceipt, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "confirmServicePayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmServicePayment() throws FLException{
		
		servicePaymentService.confirmServicePayment(spIds, queryUserId());
		
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
	
	public AdvanceReceiptVO getAdvanceReceipt() {
		return advanceReceipt;
	}

	public void setAdvanceReceipt(AdvanceReceiptVO advanceReceipt) {
		this.advanceReceipt = advanceReceipt;
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
	
}
