package com.fanglin.material.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialinside", catalog = "platform")
public class MaterialInsidePO implements java.io.Serializable {

	private static final long serialVersionUID = 3376405548558094341L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_MATERIALGUIDEID_STR = "materialGuideId";

	private long miId;
	
	private String orderId;
	
	private String orderAddr;
	
	private String customerId;
	
	private String customerName;
	
	private String designerId;
	
	private String designerName;
	
	private String materialGuideId;
	
	private String materialGuideName;
	
	private int materialTypeId;
	
	private String materialType;
	
	private int materialBrandId;
	
	private String materialBrand;
	
	private String createTime;
	
	private float sales;
	
	private float profit;
	
	private int status;
	
	private String des;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "miId")
	public long getMiId(){
		return this.miId;
	}

	public void setMiId(long miId){
		this.miId = miId;
	}

	@Column(name = "orderAddr")
	public String getOrderAddr(){
		return this.orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	@Column(name = "customerName")
	public String getCustomerName(){
		return this.customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	@Column(name = "designerId")
	public String getDesignerId(){
		return this.designerId;
	}

	public void setDesignerId(String designerId){
		this.designerId = designerId;
	}

	@Column(name = "designerName")
	public String getDesignerName(){
		return this.designerName;
	}

	public void setDesignerName(String designerName){
		this.designerName = designerName;
	}

	@Column(name = "materialGuideId")
	public String getMaterialGuideId(){
		return this.materialGuideId;
	}

	public void setMaterialGuideId(String materialGuideId){
		this.materialGuideId = materialGuideId;
	}

	@Column(name = "materialGuideName")
	public String getMaterialGuideName(){
		return this.materialGuideName;
	}

	public void setMaterialGuideName(String materialGuideName){
		this.materialGuideName = materialGuideName;
	}

	@Column(name = "materialTypeId", nullable = false)
	public int getMaterialTypeId(){
		return this.materialTypeId;
	}

	public void setMaterialTypeId(int materialTypeId){
		this.materialTypeId = materialTypeId;
	}

	@Column(name = "materialType")
	public String getMaterialType(){
		return this.materialType;
	}

	public void setMaterialType(String materialType){
		this.materialType = materialType;
	}

	@Column(name = "materialBrandId")
	public int getMaterialBrandId(){
		return this.materialBrandId;
	}

	public void setMaterialBrandId(int materialBrandId){
		this.materialBrandId = materialBrandId;
	}

	@Column(name = "materialBrand")
	public String getMaterialBrand(){
		return this.materialBrand;
	}

	public void setMaterialBrand(String materialBrand){
		this.materialBrand = materialBrand;
	}

	@Column(name = "createTime")
	public String getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	@Column(name = "sales")
	public float getSales(){
		return this.sales;
	}

	public void setSales(float sales){
		this.sales = sales;
	}

	@Column(name = "profit")
	public float getProfit(){
		return this.profit;
	}

	public void setProfit(float profit){
		this.profit = profit;
	}

	@Column(name = "status")
	public int getStatus(){
		return this.status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	@Column(name = "des")
	public String getDes(){
		return this.des;
	}

	public void setDes(String des){
		this.des = des;
	}

	@Column(name = "customerId")
	public String getCustomerId(){
		return customerId;
	}

	public void setCustomerId(String customerId){
		this.customerId = customerId;
	}

	@Column(name = "orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

}