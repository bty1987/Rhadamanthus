/**
 * @File Name		: DecorationPaymentAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.action;

import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.service.DecorationReceiptService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.payment.vo.DecorationReceiptVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationPaymentAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	@Autowired
	private DecorationPaymentService decorationPaymentService;

	@Autowired
	private DecorationReceiptService decorationReceiptService;

	private DecorationPaymentVO decorationPayment;

	private DecorationReceiptVO decorationReceipt;

	private List<DecorationPaymentVO> decorationPayments;

	private List<DecorationReceiptVO> decorationReceipts;

	private List<Long> paymentIds;

	private List<Long> drIds;

	private Timestamp dateTime;

	private List<Long> ptids;

	@Action(value = "pageDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationPayment() throws FLException {

		decorationPaymentService.pageDecorationPayment(getPaging(), getFilters(), decorationPayment, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationPaymentByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationPaymentByOrderId() throws FLException {

		decorationPayments = decorationPaymentService.queryDecorationPaymentByOrderId(decorationPayment, getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationPaymentForContractByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationPaymentForContractByOrderId() {

		decorationPayments = decorationPaymentService.queryDecorationPaymentForContractByOrderId(decorationPayment);

		return SUCCESS;
	}

	@Action(value = "queryDecorationPaymentForNotInitByDrId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationPaymentForNotInitByDrId() {

		decorationPayments = decorationPaymentService.queryDecorationPaymentForNotInitByDrId(decorationReceipt);

		return SUCCESS;
	}

	@Action(value = "queryDecoraionReceiptByDrId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecoraionReceiptByDrId() throws FLException {

		decorationReceipt = decorationReceiptService.queryDecorationReceiptByDrId(decorationReceipt);

		return SUCCESS;
	}

	@Action(value = "checkDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkDecorationPayment() throws FLException {

		decorationPaymentService.checkDecorationPayment(decorationPayment);

		return SUCCESS;
	}

	@Action(value = "addDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationPayment() throws FLException {

		decorationPaymentService.addDecorationPayment(decorationPayment, queryUserId());

		return SUCCESS;
	}

	@Action(value = "changeDecorationPaymentForTime", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationPaymentForTime() throws FLException {

		decorationPaymentService.changeDecorationPaymentForTime(decorationPayment, dateTime, queryUserId());

		return SUCCESS;
	}

	@Action(value = "collectDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectDecorationPayment() throws FLException, Exception {

		decorationPaymentService.collectDecorationPayment(decorationPayment, ptids, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refundDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundDecorationPayment() throws FLException, Exception {

		decorationPaymentService.refundDecorationPayment(decorationPayment, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refundDecorationPaymentForDesign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundDecorationPaymentForDesign() throws FLException, Exception {

		decorationPaymentService.refundDecorationPaymentForDesign(decorationPayment, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "confirmDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmDecorationPayment() throws FLException, Exception {

		decorationPaymentService.confirmDecorationPayment(paymentIds, queryUserId());

		return SUCCESS;
	}

	@Action(value = "affirmDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affirmDecorationPayment() throws FLException, Exception {

		decorationPaymentService.affirmDecorationPayment(decorationPayment);

		return SUCCESS;
	}

	@Action(value = "updateDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationPayment() throws FLException {

		decorationPaymentService.updateDecorationPayment(decorationPayment);

		return SUCCESS;
	}

	@Action(value = "deleteDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDecorationPayment() throws FLException {

		decorationPaymentService.deleteDecorationPayment(decorationPayment);

		return SUCCESS;
	}

	@Action(value = "sendDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendDecorationPayment() throws FLException {

		decorationPaymentService.sendDecorationPayment(decorationPayment);

		return SUCCESS;
	}

	@Action(value = "pushDecorationPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pushDecorationPayment() throws FLException {

		decorationPaymentService.pushDecorationPayment(decorationPayment);

		return SUCCESS;
	}

	public DecorationPaymentVO getDecorationPayment() {
		return decorationPayment;
	}

	public void setDecorationPayment(DecorationPaymentVO decorationPayment) {
		this.decorationPayment = decorationPayment;
	}

	public List<DecorationPaymentVO> getDecorationPayments() {
		return decorationPayments;
	}

	public void setDecorationPayments(List<DecorationPaymentVO> decorationPayments) {
		this.decorationPayments = decorationPayments;
	}

	public List<Long> getPaymentIds() {
		return paymentIds;
	}

	public void setPaymentIds(List<Long> paymentIds) {
		this.paymentIds = paymentIds;
	}

	public Timestamp getDateTime() {
		return dateTime;
	}

	public void setDateTime(Timestamp dateTime) {
		this.dateTime = dateTime;
	}

	public List<DecorationReceiptVO> getDecorationReceipts() {
		return decorationReceipts;
	}

	public void setDecorationReceipts(List<DecorationReceiptVO> decorationReceipts) {
		this.decorationReceipts = decorationReceipts;
	}

	public List<Long> getDrIds() {
		return drIds;
	}

	public void setDrIds(List<Long> drIds) {
		this.drIds = drIds;
	}

	public DecorationReceiptVO getDecorationReceipt() {
		return decorationReceipt;
	}

	public void setDecorationReceipt(DecorationReceiptVO decorationReceipt) {
		this.decorationReceipt = decorationReceipt;
	}

	public List<Long> getPtids() {
		return ptids;
	}

	public void setPtids(List<Long> ptids) {
		this.ptids = ptids;
	}

}
