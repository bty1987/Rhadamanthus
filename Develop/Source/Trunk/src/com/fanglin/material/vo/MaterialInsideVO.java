package com.fanglin.material.vo;

public class MaterialInsideVO implements java.io.Serializable {

	private static final long serialVersionUID = 1176191444462629693L;

	private Integer miId;
	
	private String orderId;
	
	private String orderAddr;
	
	private String customerId;
	
	private String customerName;
	
	private String designerId;
	
	private String designerName;
	
	private String materialGuideId;
	
	private String materialGuideName;
	
	private Integer materialTypeId;
	
	private String materialType;
	
	private Integer materialBrandId;
	
	private String materialBrand;
	
	private String createTime;
	
	private Float sales;
	
	private Float profit;
	
	private Integer status;
	
	private String des;

	public Integer getMiId(){
		return this.miId;
	}

	public void setMiId(Integer miId){
		this.miId = miId;
	}

	public String getOrderAddr(){
		return this.orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	public String getCustomerName(){
		return this.customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	public String getDesignerId(){
		return this.designerId;
	}

	public void setDesignerId(String designerId){
		this.designerId = designerId;
	}

	public String getDesignerName(){
		return this.designerName;
	}

	public void setDesignerName(String designerName){
		this.designerName = designerName;
	}

	public String getMaterialGuideId(){
		return this.materialGuideId;
	}

	public void setMaterialGuideId(String materialGuideId){
		this.materialGuideId = materialGuideId;
	}

	public String getMaterialGuideName(){
		return this.materialGuideName;
	}

	public void setMaterialGuideName(String materialGuideName){
		this.materialGuideName = materialGuideName;
	}

	public Integer getMaterialTypeId(){
		return this.materialTypeId;
	}

	public void setMaterialTypeId(Integer materialTypeId){
		this.materialTypeId = materialTypeId;
	}

	public String getMaterialType(){
		return this.materialType;
	}

	public void setMaterialType(String materialType){
		this.materialType = materialType;
	}

	public Integer getMaterialBrandId(){
		return this.materialBrandId;
	}

	public void setMaterialBrandId(Integer materialBrandId){
		this.materialBrandId = materialBrandId;
	}

	public String getMaterialBrand(){
		return this.materialBrand;
	}

	public void setMaterialBrand(String materialBrand){
		this.materialBrand = materialBrand;
	}

	public String getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	public Float getSales(){
		return this.sales;
	}

	public void setSales(Float sales){
		this.sales = sales;
	}

	public Float getProfit(){
		return this.profit;
	}

	public void setProfit(Float profit){
		this.profit = profit;
	}

	public Integer getStatus(){
		return this.status;
	}

	public void setStatus(Integer status){
		this.status = status;
	}

	public String getDes(){
		return this.des;
	}

	public void setDes(String des){
		this.des = des;
	}

	public String getCustomerId(){
		return customerId;
	}

	public void setCustomerId(String customerId){
		this.customerId = customerId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

}