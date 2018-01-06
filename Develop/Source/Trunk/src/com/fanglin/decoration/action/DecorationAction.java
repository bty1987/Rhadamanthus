package com.fanglin.decoration.action;

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
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;
	
	@Autowired
	private DecorationService decorationService;
	
	private List<DecorationVO> decorations;

	private DecorationVO decoration;
	
	private DecorationInfoVO decorationInfo;

	private String decorationOrderId;
	
	private int conditions = 0;
	
	private double contractTotal = 0;
	
	private float refundValue = 0;
	
	private float paymentValue = 0;
	
	private short timeType;
	
	private Timestamp dateTime;

	@Action(value = "pageDecorationForGeneral", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForGeneral() throws FLException{

		decorationService.pageDecorationForGeneral(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationForCommon", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForCommon() throws FLException{

		decorationService.pageDecorationForCommon(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationForDesigner", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForDesigner() throws FLException{
		
		decorationService.pageDecorationForDesigner(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationForSalesman", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForSalesman() throws FLException{

		decorationService.pageDecorationForSalesman(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationForMaterial", results = { @Result(name = "success", type = "json", params = {	"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForMaterial() throws FLException{
		
		decorationService.pageDecorationForMaterial(getPaging(), getFilters(), authentication());
		
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationForBelong", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForBelong() throws FLException{

		decorationService.pageDecorationForBelong(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationForAdvance", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForAdvance() throws FLException{

		decorationService.pageDecorationForAdvance(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationForQuoter", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForQuoter() throws FLException{

		decorationService.pageDecorationForQuoter(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationForEscorter", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForEscorter() throws FLException{

		decorationService.pageDecorationForEscorter(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationForDesignerManager", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForDesignerManager() throws FLException{

		decorationService.pageDecorationForDesignerManager(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}
	
	@Action(value = "pageDecorationForSalesmanManager", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationForSalesmanManager() throws FLException{

		decorationService.pageDecorationForSalesmanManager(getPaging(), getFilters(), authentication());

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationByVillageIdAHouseNumber", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationByVillageIdAHouseNumber() throws FLException{

		decoration = decorationService.queryDecorationByVillageIdAHouseNumber(decoration, authentication());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDecorationByCustomerId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationByCustomerId() throws FLException{

		decorations = decorationService.queryDecorationByCustomerId(decoration, authentication());

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationForDesignerByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationForDesignerByOrderId() throws FLException{

		decoration = decorationService.queryDecorationForDesignerByOrderId(decoration, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationForCommonByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationForCommonByOrderId() throws FLException{
		
		decoration = decorationService.queryDecorationForCommonByOrderId(decoration, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "checkdecoration", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkdecoration() throws FLException{
		
		decoration = decorationService.checkdecoration(getPaging(), getFilters(), authentication());
		
		return SUCCESS;
	}
	
	@Action(value = "createDecoration", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createDecoration() throws FLException{
		
		decorationService.createDecoration(decoration, decorationInfo, authentication());
		
		return SUCCESS;
	}
	
	@Action(value = "changeDecorationForOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForOrderId() throws FLException{
		
		decorationService.changeDecorationForOrderId(decoration.getOrderId(), decorationOrderId, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "changeDecorationForTime", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForCreateTime() throws FLException{
		
		decorationService.changeDecorationForTime(decoration, timeType, dateTime, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "changeDecorationForVersionId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForVersionId() throws FLException{
		
		decorationService.changeDecorationForVersionId(decoration, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "changeDecorationForStatus", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForStatus() throws FLException{
		
		decorationService.changeDecorationForStatus(decoration, queryUserId());
		
		return SUCCESS;
	}

	@Action(value = "obsoleteDecoration", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String obsoleteDecoration() throws FLException{

		decorationService.obsoleteDecoration(decoration, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "terminalDecoration", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String terminalDecoration() throws FLException{

		decorationService.terminalDecoration(decoration, refundValue, paymentValue, authentication());
		
		return SUCCESS;
	}
	
	
	@Action(value = "changeDecorationForAdvance", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeDecorationForAdvance() throws FLException{

		decorationService.changeDecorationForAdvance(decoration, decorationInfo);
		
		return SUCCESS;
	}
	
	@Action(value = "subDecorationForQuotationTime", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String subDecorationForQuotationTime() throws FLException{

		decorationService.subDecorationForQuotationTime(decoration, queryUserId());
		
		return SUCCESS;
	}
	
	public List<DecorationVO> getDecorations() {
		return decorations;
	}

	public void setDecorations(List<DecorationVO> decorations) {
		this.decorations = decorations;
	}

	public DecorationVO getDecoration(){
		return decoration;
	}

	public void setDecoration(DecorationVO decoration){
		this.decoration = decoration;
	}

	public void setDecorationOrderId(String decorationOrderId){
		this.decorationOrderId = decorationOrderId;
	}
	
	public int getConditions(){
		return conditions;
	}

	public void setConditions(int conditions){
		this.conditions = conditions;
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

	public DecorationInfoVO getDecorationInfo() {
		return decorationInfo;
	}

	public void setDecorationInfo(DecorationInfoVO decorationInfo) {
		this.decorationInfo = decorationInfo;
	}

}
