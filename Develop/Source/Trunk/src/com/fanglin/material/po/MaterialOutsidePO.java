package com.fanglin.material.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialoutside", catalog = "platform")
public class MaterialOutsidePO implements java.io.Serializable {

	private static final long serialVersionUID = -229331967740042428L;
	
	public static final short STATUS_INIT_INT = 0;
	
	public static final short STATUS_COLLECT_INT = 1;
	
	public static final short STATUS_REFUND_INT = 2;
	
	public static final String COLUMN_CREATEUSERID_STR = "createUserId";
	
	public static final String COLUMN_STATUS_STR = "status";

	private long moId;
	
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
	
	private float sales;
	
	private float profit;
	
	private short status;
	
	private String des;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "moId")
	public long getMoId() {
		return this.moId;
	}

	public void setMoId(long moId) {
		this.moId = moId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "orderAddr")
	public String getOrderAddr() {
		return this.orderAddr;
	}

	public void setOrderAddr(String orderAddr) {
		this.orderAddr = orderAddr;
	}

	@Column(name = "customerName")
	public String getCustomerName() {
		return this.customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	@Column(name = "salesmanId")
	public String getSalesmanId() {
		return this.salesmanId;
	}

	public void setSalesmanId(String salesmanId) {
		this.salesmanId = salesmanId;
	}

	@Column(name = "salesmanName")
	public String getSalesmanName() {
		return this.salesmanName;
	}

	public void setSalesmanName(String salesmanName) {
		this.salesmanName = salesmanName;
	}

	@Column(name = "deptId")
	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	@Column(name = "deptName")
	public String getDeptName() {
		return this.deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	@Column(name = "regionId")
	public String getRegionId() {
		return this.regionId;
	}

	public void setRegionId(String regionId) {
		this.regionId = regionId;
	}

	@Column(name = "regionName")
	public String getRegionName() {
		return this.regionName;
	}

	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}

	@Column(name = "createUserId")
	public String getCreateUserId() {
		return this.createUserId;
	}

	public void setCreateUserId(String createUserId) {
		this.createUserId = createUserId;
	}

	@Column(name = "createUserName")
	public String getCreateUserName() {
		return this.createUserName;
	}

	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}

	@Column(name = "materialType")
	public String getMaterialType() {
		return this.materialType;
	}

	public void setMaterialType(String materialType) {
		this.materialType = materialType;
	}

	@Column(name = "materialBrand")
	public String getMaterialBrand() {
		return this.materialBrand;
	}

	public void setMaterialBrand(String materialBrand) {
		this.materialBrand = materialBrand;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "sales")
	public float getSales() {
		return this.sales;
	}

	public void setSales(float sales) {
		this.sales = sales;
	}

	@Column(name = "profit")
	public float getProfit() {
		return this.profit;
	}

	public void setProfit(float profit) {
		this.profit = profit;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "des")
	public String getDes() {
		return this.des;
	}

	public void setDes(String des) {
		this.des = des;
	}

}