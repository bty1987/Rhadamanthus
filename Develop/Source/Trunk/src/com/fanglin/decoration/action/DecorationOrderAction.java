package com.fanglin.decoration.action;

import java.sql.Timestamp;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationOrderService;
import com.fanglin.decoration.vo.DecorationOrderVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationOrderAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;
	
	@Autowired
	private DecorationOrderService decorationOrderService;

	private DecorationOrderVO decorationOrder;

	private String decorationOrderId;
	
	private int condition = 0;
	
	private double contractTotal = 0;
	
	private float refundValue = 0;
	
	private float paymentValue = 0;
	
	private short timeType;
	
	private Timestamp dateTime;

	@Action(value = "pageDecorationOrderForGeneral", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForGeneral() throws FLException{

		decorationOrderService.pageDecorationOrderForGeneral(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForCommon", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForCommon() throws FLException{

		decorationOrderService.pageDecorationOrderForCommon(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForDesigner", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForDesigner() throws FLException{
		
		decorationOrderService.pageDecorationOrderForDesigner(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForSalesman", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForSalesman() throws FLException{

		decorationOrderService.pageDecorationOrderForSalesman(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForMaterial", results = { @Result(name = "success", type = "json", params = {	"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationOrderByMaterial() throws FLException{
		
		decorationOrderService.pageDecorationOrderForMaterial(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForBelong", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForBelong() throws FLException{

		decorationOrderService.pageDecorationOrderForBelong(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryDecorationOrderByVillageIdAHouseNumber", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationOrderByVillageIdAHouseNumber(){

		decorationOrder = decorationOrderService.queryDecorationOrderByVillageIdAHouseNumber(decorationOrder);
		
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationOrderForSignedByCustomerId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationOrderForSignedByCustomerId() throws FLException{

		decorationOrder = decorationOrderService.queryDecorationOrderForSignedByCustomerId(decorationOrder);

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationOrderForCondition", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationOrderForCondition() throws FLException{
		
		condition = decorationOrderService.queryDecorationOrderForCondition(queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationOrderForDesignerByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationOrderForDesignerByOrderId() throws FLException{

		decorationOrder = decorationOrderService.queryDecorationOrderForDesignerByOrderId(decorationOrder, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationOrderForCommonByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationOrderForCommonByOrderId() throws FLException{
		
		decorationOrder = decorationOrderService.queryDecorationOrderForCommonByOrderId(decorationOrder, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "createDecorationOrder", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createDecorationOrder() throws FLException{
		
		decorationOrder.setCreateUserId(queryUserId());
		
		if(decorationOrder.getOrderType() == 1){
			decorationOrderService.createDecorationOrder(decorationOrder);
		}else{
			decorationOrderService.createDecorationOrderForMaterial(decorationOrder);
		}
		
		return SUCCESS;
	}
	
	@Action(value = "changeDecorationOrderForOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationOrderForOrderId() throws FLException{
		
		decorationOrderService.changeDecorationOrderForOrderId(decorationOrder.getOrderId(), decorationOrderId, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "changeDecorationOrderForTime", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationOrderForCreateTime() throws FLException{
		
		decorationOrderService.changeDecorationOrderForTime(decorationOrder, timeType, dateTime, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "changeDecorationOrderForVersionId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationOrderForVersionId() throws FLException{
		
		decorationOrderService.changeDecorationOrderForVersionId(decorationOrder, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "changeDecorationOrderForStatus", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationOrderForStatus() throws FLException{
		
		decorationOrderService.changeDecorationOrderForStatus(decorationOrder, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "obsoleteDecorationOrder", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String obsoleteDecorationOrder() throws FLException{

		decorationOrder.setDesignerId(queryUserId());
		decorationOrderService.obsoleteDecorationOrder(decorationOrder, queryUserName());
		
		return SUCCESS;
	}
	
	@Action(value = "terminalDecorationOrder", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String terminalDecorationOrder() throws FLException{

		decorationOrder.setDesignerId(queryUserId());
		decorationOrderService.terminalDecorationOrder(decorationOrder, refundValue, paymentValue, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "checkDecorationOrderForExist", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkDecorationOrderExist(){
		
		decorationOrderService.checkDecorationOrderExist(decorationOrder);
		
		return SUCCESS;
	}
	
	@Action(value = "changeDecorationOrderForAdvance", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationOrderForAdvance() throws FLException{

		decorationOrderService.changeDecorationOrderForAdvance(decorationOrder);
		
		return SUCCESS;
	}
	
	@Action(value = "subDecorationOrderForQuotationTime", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String subDecorationOrderForQuotationTime() throws FLException{

		decorationOrderService.subDecorationOrderForQuotationTime(decorationOrder, queryUserName());
		
		return SUCCESS;
	}
	
	public DecorationOrderVO getDecorationOrder(){
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderVO decorationOrder){
		this.decorationOrder = decorationOrder;
	}

	public void setDecorationOrderId(String decorationOrderId){
		this.decorationOrderId = decorationOrderId;
	}
	
	public int getCondition(){
		return condition;
	}

	public void setCondition(int condition){
		this.condition = condition;
	}

	public double getContractTotal(){
		return contractTotal;
	}

	public void setContractTotal(double contractTotal){
		this.contractTotal = contractTotal;
	}

	public float getRefundValue(){
		return refundValue;
	}

	public void setRefundValue(float refundValue){
		this.refundValue = refundValue;
	}

	public String getDecorationOrderId(){
		return decorationOrderId;
	}

	public float getPaymentValue() {
		return paymentValue;
	}

	public void setPaymentValue(float paymentValue) {
		this.paymentValue = paymentValue;
	}

	public short getTimeType() {
		return timeType;
	}

	public void setTimeType(short timeType) {
		this.timeType = timeType;
	}

	public Timestamp getDateTime() {
		return dateTime;
	}

	public void setDateTime(Timestamp dateTime) {
		this.dateTime = dateTime;
	}

}
