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
import com.fanglin.payment.service.OalesPaymentService;
import com.fanglin.payment.vo.OalesPaymentVO;
import com.fanglin.payment.vo.OalesReceiptVO;
import com.fanglin.sales.vo.OalesVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OalesPaymentAction extends BaseListAction {

	private static final long serialVersionUID = 4937818909374829481L;

	@Autowired
	private OalesPaymentService oalesPaymentService;

	private OalesPaymentVO oalesPayment;

	private List<OalesPaymentVO> oalesPayments;

	private OalesReceiptVO oalesReceipt;

	private OalesVO oales;

	private List<Long> opids;

	private List<Long> ptids;

	private String companyType;

	@Action(value = "pageOalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageOalesPayment() throws FLException {

		oalesPaymentService.pageOalesPayment(getPaging(), getFilters(), oalesPayment, queryCompany(), companyType);

		return SUCCESS;
	}

	@Action(value = "queryOalesPaymentByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOalesPaymentByOrderId() throws FLException {

		oalesPayments = oalesPaymentService.queryOalesPaymentByOrderId(oalesPayment, getFilters(), queryCompany(), companyType);

		return SUCCESS;
	}

	@Action(value = "queryOalesPaymentByOid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOalesPaymentByOid() {

		oalesPayments = oalesPaymentService.queryOalesPaymentByOid(oalesPayment);

		return SUCCESS;
	}

	@Action(value = "queryOalesPaymentForNotInitByOrid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOalesPaymentForNotInitByOrid() {

		oalesPayments = oalesPaymentService.queryOalesPaymentForNotInitByOrid(oalesReceipt);

		return SUCCESS;
	}

	@Action(value = "addOalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOalesPayment() throws FLException {

		oalesPaymentService.addOalesPayment(oalesPayment, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "cancelOalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelOalesPayment() throws FLException {

		oalesPaymentService.cancelOalesPayment(oalesPayment);

		return SUCCESS;
	}

	@Action(value = "collectOalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectOalesPayment() throws FLException, Exception {

		int company = oalesPayment.getBompany() != null ? CompanyServiceImpl.decode(oalesPayment.getBompany()) : queryCompany();

		oalesPaymentService.collectOalesPayment(oalesPayment, oalesReceipt, ptids, queryUserId(), company);

		return SUCCESS;
	}

	@Action(value = "refundOalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundOalesPayment() throws FLException, Exception {

		oalesPaymentService.refundOalesPayment(oalesPayment, oalesReceipt, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateOalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOalesPayment() throws FLException {

		oalesPaymentService.updateOalesPayment(oalesPayment, oalesReceipt);

		return SUCCESS;
	}

	@Action(value = "confirmOalesPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmOalesPayment() throws FLException {

		oalesPaymentService.confirmOalesPayment(opids, queryUserId());

		return SUCCESS;
	}

	public OalesPaymentVO getOalesPayment() {
		return oalesPayment;
	}

	public void setOalesPayment(OalesPaymentVO oalesPayment) {
		this.oalesPayment = oalesPayment;
	}

	public List<OalesPaymentVO> getOalesPayments() {
		return oalesPayments;
	}

	public void setOalesPayments(List<OalesPaymentVO> oalesPayments) {
		this.oalesPayments = oalesPayments;
	}

	public OalesReceiptVO getOalesReceipt() {
		return oalesReceipt;
	}

	public void setOalesReceipt(OalesReceiptVO oalesReceipt) {
		this.oalesReceipt = oalesReceipt;
	}

	public OalesVO getOales() {
		return oales;
	}

	public void setOales(OalesVO oales) {
		this.oales = oales;
	}

	public List<Long> getOpids() {
		return opids;
	}

	public void setOpids(List<Long> opids) {
		this.opids = opids;
	}

	public List<Long> getPtids() {
		return ptids;
	}

	public void setPtids(List<Long> ptids) {
		this.ptids = ptids;
	}

	public String getCompanyType() {
		return companyType;
	}

	public void setCompanyType(String companyType) {
		this.companyType = companyType;
	}

}
