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
import com.fanglin.decoration.vo.DecorationActivityItemVO;
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
	
	private List<DecorationActivityItemVO> decorationActivityItems;

	private List<Long> paymentIds;
	
	private List<Long> drIds;
	
	private Timestamp dateTime;
	
	@Action(value = "pageDecorationPaymentForBaseByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationPaymentForBaseByOrderId(){
		
		decorationPaymentService.pageDecorationPaymentsForBaseByOrderId(getPaging(), decorationPayment);
	    
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationPaymentForOtherByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationPaymentForOtherByOrderId(){
		
		decorationPaymentService.pageDecorationPaymentForOtherByOrderId(getPaging(), decorationPayment);
	    
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationPaymentForCommit", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationPaymentForCommit(){
		
		decorationPaymentService.pageDecorationPaymentForCommit(getPaging(), getFilters());
		
		return SUCCESS;
	}

	@Action(value = "pageDecorationPaymentForCollect", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationPaymentForCollect(){
		
		decorationPaymentService.pageDecorationPaymentForCollect(getPaging(), getFilters());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationPaymentForConfirm", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationPaymentForConfirm(){
		
		decorationPaymentService.pageDecorationPaymentForConfirm(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationPaymentForHistory", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationPaymentForHistory(){
		
		decorationPaymentService.pageDecorationPaymentForHistory(getPaging(), getFilters());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationPaymentForChange", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationPaymentForChange(){
		
		decorationPaymentService.pageDecorationPaymentForChange(getPaging(), getFilters());

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationPaymentByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationPaymentByOrderId(){
		
		decorationPayments = decorationPaymentService.queryDecorationPaymentByOrderId(decorationPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationPaymentForBaseByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationPaymentForBaseByOrderId(){
		
		decorationPayments = decorationPaymentService.queryDecorationPaymentForBaseByOrderId(decorationPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationPaymentByOrderIdAIds", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationPaymentByOrderIdAIds() throws FLException{
		
		decorationPayments = decorationPaymentService.queryDecorationPaymentByOrderIdAIds(paymentIds, decorationPayment, getUserId());
	    
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationPaymentForBaseAConfirmByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationPaymentForBaseAConfirmByOrderId(){
		
		decorationPayments = decorationPaymentService.queryDecorationPaymentForBaseAConfirmByOrderId(decorationPayment);
	    
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationPaymentForNotInitByDrId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationPaymentForNotInitByDrId(){
		
		decorationPayments = decorationPaymentService.queryDecorationPaymentForNotInitByDrId(decorationReceipt);
		
		return SUCCESS;
	}
	
	@Action(value = "queryDecoraionReceiptByDrId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecoraionReceiptByDrId() throws FLException{
		
		decorationReceipt = decorationReceiptService.queryDecorationReceiptByDrId(decorationReceipt);
		
		return SUCCESS;
	}
	
	@Action(value="changeDecorationPaymentForTime", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String changeDecorationPaymentForTime() throws FLException{
		
		decorationPaymentService.changeDecorationPaymentForTime(decorationPayment, dateTime, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "makeDecorationPayment", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeDecorationPayment() throws FLException{
		
		decorationPaymentService.makeDecorationPayment(decorationPayment, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "submitDecorationPayment", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitDecorationPayment() throws FLException{
		
		decorationPayment.setCreateUserId(getUserId());
		decorationPayment.setPaymentStatus("未付款");
		decorationPaymentService.changeDecorationPaymentForStatus(decorationPayment);
	    
		return SUCCESS;
	}
	
	@Action(value = "addDecorationPaymentForOther", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationPaymentForOther() throws FLException{
		
		decorationPayment.setCreateUserId(getUserId());
		decorationPaymentService.addDecorationPaymentForOther(decorationPayment);
		
		if(getErrorCode()!=0){
			return SUCCESS;
		}
	    
		return SUCCESS;
	}
	
	@Action(value = "addDecorationPaymentForRefund", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationPaymentForRefund() throws FLException{
		
		decorationPayment.setCreateUserId(getUserId());
		
		decorationPaymentService.addDecorationPaymentForOther(decorationPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "convertDecorationPayment", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String convertDecorationPayment() throws FLException{
		
		decorationPayment.setCollectUserId(getUserId());
		decorationPaymentService.convertDecorationPayment(decorationPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "collectDecorationPayment", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectDecorationPayment() throws FLException{
		
		decorationPayment.setCollectUserId(getUserId());
		decorationPaymentService.collectDecorationPayment(decorationPayment, decorationActivityItems);
		
		return SUCCESS;
	}
	
	@Action(value = "updateDecorationPayment", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationPayment() throws FLException{
		
		decorationPayment.setCollectUserId(getUserId());
		decorationPaymentService.updateDecorationPayment(decorationPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "updateDecorationPaymentForReferMoney", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationPaymentForReferMoney() throws FLException{
		
		decorationPaymentService.updateDecorationPaymentForReferMoney(decorationPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "refundDecorationPayment", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundDecorationPayment() throws FLException{
		
		decorationPayment.setCollectUserId(getUserId());
		decorationPaymentService.refundDecorationPayment(decorationPayment);
		
		return SUCCESS;
	}
	
	@Action(value = "refundDecorationPaymentForManage", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundDecorationPaymentForManage() throws FLException{
		
		decorationPaymentService.refundDecorationPaymentForManage(decorationPayment, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "confirmDecorationPayment", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmDecorationPayment() throws FLException{
		
		decorationPaymentService.confirmDecorationPayment(paymentIds, getUserId());
		
		return SUCCESS;
	}
	
	public void setDecorationPayments(List<DecorationPaymentVO> decorationPayments){
		this.decorationPayments = decorationPayments;
	}

	public List<DecorationPaymentVO> getDecorationPayments(){
		return decorationPayments;
	}

	public void setDecorationPayment(DecorationPaymentVO decorationPayment){
		this.decorationPayment = decorationPayment;
	}

	public DecorationPaymentVO getDecorationPayment(){
		return decorationPayment;
	}

	public List<Long> getPaymentIds(){
		return paymentIds;
	}

	public void setPaymentIds(List<Long> paymentIds){
		this.paymentIds = paymentIds;
	}

	public Timestamp getDateTime() {
		return dateTime;
	}

	public void setDateTime(Timestamp dateTime) {
		this.dateTime = dateTime;
	}

	public List<DecorationActivityItemVO> getDecorationActivityItems() {
		return decorationActivityItems;
	}

	public void setDecorationActivityItems(
			List<DecorationActivityItemVO> decorationActivityItems) {
		this.decorationActivityItems = decorationActivityItems;
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

}
