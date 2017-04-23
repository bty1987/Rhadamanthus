/**
 * @File Name		: MaterialPaymentAction.java
 * @Package   	: com.fanglin.action.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.action;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.material.vo.MaterialSubOrderVO;
import com.fanglin.payment.service.MaterialPaymentService;
import com.fanglin.payment.service.MaterialReceiptService;
import com.fanglin.payment.vo.MaterialPaymentVO;
import com.fanglin.payment.vo.MaterialReceiptVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialPaymentAction extends BaseListAction{

	private static final long serialVersionUID = -9085314991331097751L;
	
	@Autowired
	private MaterialPaymentService materialPaymentService;
	
	@Autowired
	private MaterialReceiptService materialReceiptService;
	
	private MaterialSubOrderVO materialSubOrder;
	
	private MaterialPaymentVO materialPayment;
	
	private MaterialReceiptVO materialReceipt;
	
	private List<MaterialPaymentVO> materialPayments;
	
	private List<MaterialReceiptVO> materialReceipts;
	
	private List<DecorationActivityItemVO> decorationActivityItems;
	
	private List<Long> mpIds;
	
	private List<Long> mrIds;
	
	private Timestamp dateTime;
	
	@Action(value="pageMaterialPayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialPayment(){
		
		materialPaymentService.pageMaterialPayment(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialPaymentForInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialPaymentForInit(){
		
		materialPaymentService.pageMaterialPaymentForInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialPaymentForCollect", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialPaymentForCollect(){
		
		materialPaymentService.pageMaterialPaymentForCollect(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialPaymentForConfirm", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialPaymentForConfirm(){
		
		materialPaymentService.pageMaterialPaymentForConfirm(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialPaymentForNotInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialPaymentForNotInit(){
		
		materialPaymentService.pageMaterialPaymentForNotInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialPaymentByOrderId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialPaymentByOrderId(){
		
		materialPaymentService.pageMaterialPaymentByOrderId(getPaging(), getFilters(), materialPayment);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialPaymentByOrderId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialPaymentByOrderId(){
		
		materialPayments = materialPaymentService.queryMaterialPaymentByOrderId(materialPayment);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialPaymentByMsoId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialPaymentByMsoId(){
		
		materialPayments = materialPaymentService.queryMaterialPaymentByMsoId(materialPayment);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialPaymentForCouponByMsoId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialPaymentCouponByMsoId(){
		
		materialPaymentService.queryMaterialPaymentForCouponByMsoId(materialPayment);
		
		return SUCCESS;
	}
	
	@SuppressWarnings("unchecked")
	@Action(value="queryMaterialPaymentForNotInitByMrId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialPaymentForNotInitByMrId() throws FLException{
		
		Map<String, Object> result = materialPaymentService.queryMaterialPaymentForNotInitByMrId(materialReceipt, queryUserId());
		
		materialSubOrder = (MaterialSubOrderVO) result.get("materialSubOrder");
		materialPayments = (List<MaterialPaymentVO>) result.get("materialPayments");
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialReceiptByMrId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialReceiptByMrId() throws FLException{
		
		materialReceipt = materialReceiptService.queryMaterialReceiptByMrId(materialReceipt);
		
		return SUCCESS;
	}
	
	@Action(value="addMaterialPayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMaterialPayment() throws FLException{
		
		materialPaymentService.addMaterialPayment(materialPayment, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="changeMaterialPaymentForTime", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String changeMaterialPaymentForTime() throws FLException{
		
		materialPaymentService.changeMaterialPaymentForTime(materialPayment, dateTime, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="collectMaterialPayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String collectMaterialPayment() throws FLException{
		
		materialPaymentService.collectMaterialPayment(materialPayment, decorationActivityItems, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="collectMaterialPayments", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String collectMaterialPayments() throws FLException{
		
		materialPaymentService.collectMaterialPayments(materialSubOrder, materialPayments, materialReceipt, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="collectMaterialPaymentForRefund", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String collectMaterialPaymentForRefund() throws FLException{
		
		materialPaymentService.collectMaterialPaymentForRefund(materialPayment, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="confirmMaterialPayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String confirmMaterialPayment() throws FLException{
		
		materialPaymentService.confirmMaterialPayment(mpIds, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="cancelMaterialPayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String cancelMaterialPayment() throws FLException{
		
		materialPaymentService.cancelMaterialPayment(materialPayment);
		
		return SUCCESS;
	}
	
	@Action(value="refundMaterialPayment", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String refundMaterialPayment() throws FLException{
		
		materialPaymentService.refundMaterialPayment(materialPayment, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="refundMaterialPaymentForCoupon", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String refundMaterialPaymentForCoupon() throws FLException{
		
		materialPaymentService.refundMaterialPaymentForCoupon(materialSubOrder, queryUserId(), queryUserName());
		
		return SUCCESS;
	}
	
	public MaterialPaymentVO getMaterialPayment(){
		return materialPayment;
	}

	public void setMaterialPayment(MaterialPaymentVO materialPayment){
		this.materialPayment = materialPayment;
	}

	public List<MaterialPaymentVO> getMaterialPayments(){
		return materialPayments;
	}

	public void setMaterialPayments(List<MaterialPaymentVO> materialPayments){
		this.materialPayments = materialPayments;
	}

	public MaterialSubOrderVO getMaterialSubOrder(){
		return materialSubOrder;
	}

	public void setMaterialSubOrder(MaterialSubOrderVO materialSubOrder){
		this.materialSubOrder = materialSubOrder;
	}

	public List<Long> getMpIds(){
		return mpIds;
	}

	public void setMpIds(List<Long> mpIds){
		this.mpIds = mpIds;
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

	public MaterialReceiptVO getMaterialReceipt() {
		return materialReceipt;
	}

	public void setMaterialReceipt(MaterialReceiptVO materialReceipt) {
		this.materialReceipt = materialReceipt;
	}

	public List<MaterialReceiptVO> getMaterialReceipts() {
		return materialReceipts;
	}

	public void setMaterialReceipts(List<MaterialReceiptVO> materialReceipts) {
		this.materialReceipts = materialReceipts;
	}

	public List<Long> getMrIds() {
		return mrIds;
	}

	public void setMrIds(List<Long> mrIds) {
		this.mrIds = mrIds;
	}

}
