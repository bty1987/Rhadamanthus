package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.vo.CustomerVO;
import com.fanglin.data.vo.VillageVO;

public class QuotationDetailVO implements Serializable{
	                                                                
	private static final long serialVersionUID = 7935433076046420L;

	private Long autoId;
	
	private String orderId;
	
	private String orderStatus;
	
	private Integer orderActivityId;
	
	private String orderActivity;
	
	private Float orderActivityDiscount;
	
	private String houseType;
	
	private Float notSalesmanRate;
	
	private CustomerVO customer;
	
	private VillageVO village;
	
	private String houseNumber;
	
	private Float houseArea;
	
	private Float freeArea;
	
	private Float orderTotalPrice;
	
	private Timestamp contractTime;
	
	private String versionId;

	private String quotationName;
	
	private String decorationStyle;
	
	private Timestamp createTime;
	
	protected String quotationContent;
	
	private String designerId;
	
	private String designer;
	
	private String designerPhone;
	
	private Float discount;
	
	private Float totalPrice;
	
	private Integer status;
	
	private Integer saveStatus;
	
	private Float limitCarManagePrice;
	
	private Float carManageRate;
	
	private Float carManagePrice;
	
	private Float manageRate;
	
	private Float ManagePrice;
	
	private Map<String, Integer> latexCutScale;
	
	private Float latexCut;
	
	private List<Integer> trafficPriceScale;
	
	private Float trafficPrice;
	
	private Float firstRate;
	
	private Float firstSecondRate;
	
	private Float secondRate;
	
	private Float lastRate;
	
	private List<QuotationFunctionAreaVO> functionAreas;

	private List<QuotationFunctionAreaItemVO> otherItems;
	
	private String applayContent;
	
	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getOrderStatus(){
		return orderStatus;
	}

	public void setOrderStatus(String orderStatus){
		this.orderStatus = orderStatus;
	}

	public Integer getOrderActivityId(){
		return orderActivityId;
	}

	public void setOrderActivityId(Integer orderActivityId){
		this.orderActivityId = orderActivityId;
	}

	public String getOrderActivity(){
		return orderActivity;
	}

	public void setOrderActivity(String orderActivity){
		this.orderActivity = orderActivity;
	}

	public Float getOrderActivityDiscount(){
		return orderActivityDiscount;
	}

	public void setOrderActivityDiscount(Float orderActivityDiscount){
		this.orderActivityDiscount = orderActivityDiscount;
	}

	public Float getOrderTotalPrice(){
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(Float orderTotalPrice){
		this.orderTotalPrice = orderTotalPrice;
	}

	public Timestamp getContractTime(){
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime){
		this.contractTime = contractTime;
	}

	public String getVersionId(){
		return versionId;
	}

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getQuotationName(){
		return quotationName;
	}

	public void setQuotationName(String quotationName){
		this.quotationName = quotationName;
	}

	public String getDecorationStyle(){
		return decorationStyle;
	}

	public void setDecorationStyle(String decorationStyle){
		this.decorationStyle = decorationStyle;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public String getQuotationContent(){
		return quotationContent;
	}

	public void setQuotationContent(String quotationContent){
		this.quotationContent = quotationContent;
	}

	public String getDesignerId(){
		return designerId;
	}

	public void setDesignerId(String designerId){
		this.designerId = designerId;
	}

	public String getDesigner(){
		return designer;
	}

	public void setDesigner(String designer){
		this.designer = designer;
	}

	public Float getDiscount(){
		return discount;
	}

	public void setDiscount(Float discount){
		this.discount = discount;
	}

	public Float getTotalPrice(){
		return totalPrice;
	}

	public void setTotalPrice(Float totalPrice){
		this.totalPrice = totalPrice;
	}

	public Integer getStatus(){
		return status;
	}

	public void setStatus(Integer status){
		this.status = status;
	}

	public Integer getSaveStatus(){
		return saveStatus;
	}

	public void setSaveStatus(Integer saveStatus){
		this.saveStatus = saveStatus;
	}

	public List<QuotationFunctionAreaVO> getFunctionAreas(){
		return functionAreas;
	}

	public void setFunctionAreas(List<QuotationFunctionAreaVO> functionAreas){
		this.functionAreas = functionAreas;
	}

	public void setLimitCarManagePrice(Float limitCarManagePrice){
		this.limitCarManagePrice = limitCarManagePrice;
	}

	public Float getLimitCarManagePrice(){
		return limitCarManagePrice;
	}

	public void setManageRate(Float manageRate){
		this.manageRate = manageRate;
	}

	public Float getManageRate(){
		return manageRate;
	}

	public void setHouseType(String houseType){
		this.houseType = houseType;
	}

	public String getHouseType(){
		return houseType;
	}

	public void setFirstRate(Float firstRate){
		this.firstRate = firstRate;
	}

	public Float getFirstRate(){
		return firstRate;
	}

	public void setSecondRate(Float secondRate){
		this.secondRate = secondRate;
	}

	public Float getSecondRate(){
		return secondRate;
	}

	public void setLastRate(Float lastRate){
		this.lastRate = lastRate;
	}

	public Float getLastRate(){
		return lastRate;
	}

	public void setFirstSecondRate(Float firstSecondRate){
		this.firstSecondRate = firstSecondRate;
	}

	public Float getFirstSecondRate(){
		return firstSecondRate;
	}

	public void setHouseNumber(String houseNumber){
		this.houseNumber = houseNumber;
	}

	public String getHouseNumber(){
		return houseNumber;
	}

	public void setCustomer(CustomerVO customer){
		this.customer = customer;
	}

	public CustomerVO getCustomer(){
		return customer;
	}

	public void setDesignerPhone(String designerPhone){
		this.designerPhone = designerPhone;
	}

	public String getDesignerPhone(){
		return designerPhone;
	}

	public void setHouseArea(Float houseArea){
		this.houseArea = houseArea;
	}

	public Float getHouseArea(){
		return houseArea;
	}

	public void setVillage(VillageVO village){
		this.village = village;
	}

	public VillageVO getVillage(){
		return village;
	}

	public void setFreeArea(Float freeArea){
		this.freeArea = freeArea;
	}

	public Float getFreeArea(){
		return freeArea;
	}

	public void setOtherItems(List<QuotationFunctionAreaItemVO> otherItems){
		this.otherItems = otherItems;
	}

	public List<QuotationFunctionAreaItemVO> getOtherItems(){
		return otherItems;
	}

	public void setCarManageRate(Float carManageRate){
		this.carManageRate = carManageRate;
	}

	public Float getCarManageRate(){
		return carManageRate;
	}

	public void setNotSalesmanRate(Float notSalesmanRate){
		this.notSalesmanRate = notSalesmanRate;
	}

	public Float getNotSalesmanRate(){
		return notSalesmanRate;
	}

	public Float getCarManagePrice(){
		return carManagePrice;
	}

	public void setCarManagePrice(Float carManagePrice){
		this.carManagePrice = carManagePrice;
	}

	public Float getManagePrice(){
		return ManagePrice;
	}

	public void setManagePrice(Float managePrice){
		ManagePrice = managePrice;
	}

	public Map<String, Integer> getLatexCutScale() {
		return latexCutScale;
	}

	public void setLatexCutScale(Map<String, Integer> latexCutScale) {
		this.latexCutScale = latexCutScale;
	}

	public Float getLatexCut() {
		return latexCut;
	}

	public void setLatexCut(Float latexCut) {
		this.latexCut = latexCut;
	}

	public Float getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(Float trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	public List<Integer> getTrafficPriceScale() {
		return trafficPriceScale;
	}

	public void setTrafficPriceScale(List<Integer> trafficPriceScale) {
		this.trafficPriceScale = trafficPriceScale;
	}

	public String getApplayContent() {
		return applayContent;
	}

	public void setApplayContent(String applayContent) {
		this.applayContent = applayContent;
	}
	
}
