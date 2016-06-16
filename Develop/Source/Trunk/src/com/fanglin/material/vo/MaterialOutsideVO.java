package com.fanglin.material.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class MaterialOutsideVO implements java.io.Serializable {

	private static final long serialVersionUID = -532778098039191658L;

	private Long moId;
	
	private String orderId;
	
	private String orderAddr;
	
	private String customerName;
	
	private String salesmanId;
	
	private String salesmanName;
	
	private String deptId;
	
	private String deptName;
	
	private String regionId;
	
	private String regionName;
	
	private String createUserId;
	
	private String createUserName;
	
	private String materialType;
	
	private String materialBrand;
	
	private Timestamp createTime;
	
	private Float sales;
	
	private Float profit;
	
	private Short status;
	
	private String des;

	public Long getMoId() {
		return moId;
	}

	public void setMoId(Long moId) {
		this.moId = moId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getOrderAddr() {
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr) {
		this.orderAddr = orderAddr;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getSalesmanId() {
		return salesmanId;
	}

	public void setSalesmanId(String salesmanId) {
		this.salesmanId = salesmanId;
	}

	public String getSalesmanName() {
		return salesmanName;
	}

	public void setSalesmanName(String salesmanName) {
		this.salesmanName = salesmanName;
	}

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public String getRegionId() {
		return regionId;
	}

	public void setRegionId(String regionId) {
		this.regionId = regionId;
	}

	public String getRegionName() {
		return regionName;
	}

	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}

	public String getCreateUserId() {
		return createUserId;
	}

	public void setCreateUserId(String createUserId) {
		this.createUserId = createUserId;
	}

	public String getCreateUserName() {
		return createUserName;
	}

	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}

	public String getMaterialType() {
		return materialType;
	}

	public void setMaterialType(String materialType) {
		this.materialType = materialType;
	}

	public String getMaterialBrand() {
		return materialBrand;
	}

	public void setMaterialBrand(String materialBrand) {
		this.materialBrand = materialBrand;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Float getSales() {
		return sales;
	}

	public void setSales(Float sales) {
		this.sales = sales;
	}

	public Float getProfit() {
		return profit;
	}

	public void setProfit(Float profit) {
		this.profit = profit;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

}