package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class DecorationVO implements Serializable{

	private static final long serialVersionUID = -8166272101127100147L;

	private String orderId;
	
	private String unionId;
	
	private Float houseArea;
	
	private String address;
	
	private UserBaseVO designer;
	
	private UserBaseVO salesman;
	
	private UserBaseVO supervisor;
	
	private Long customerId;
	
	private String customerPhone;
	
	private Float orderTotalPrice;
	
	private Timestamp contractTime;
	
	private Timestamp createTime;
	
	private Timestamp depositTime;
	
	private Timestamp measureTime;
	
	private Short defaultFlag;

	public DecorationVO() {
		super();
	}

	public DecorationVO(UserBaseVO designer, UserBaseVO salesman,
			UserBaseVO supervisor) {
		super();
		this.designer = designer;
		this.salesman = salesman;
		this.supervisor = supervisor;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public Float getHouseArea() {
		return houseArea;
	}

	public void setHouseArea(Float houseArea) {
		this.houseArea = houseArea;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public UserBaseVO getDesigner() {
		return designer;
	}

	public void setDesigner(UserBaseVO designer) {
		this.designer = designer;
	}

	public UserBaseVO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserBaseVO salesman) {
		this.salesman = salesman;
	}

	public UserBaseVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserBaseVO supervisor) {
		this.supervisor = supervisor;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public Float getOrderTotalPrice() {
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(Float orderTotalPrice) {
		this.orderTotalPrice = orderTotalPrice;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getContractTime() {
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime) {
		this.contractTime = contractTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getDepositTime() {
		return depositTime;
	}

	public void setDepositTime(Timestamp depositTime) {
		this.depositTime = depositTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getMeasureTime() {
		return measureTime;
	}

	public void setMeasureTime(Timestamp measureTime) {
		this.measureTime = measureTime;
	}

	public Short getDefaultFlag() {
		return defaultFlag;
	}

	public void setDefaultFlag(Short defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

	public String getCustomerPhone() {
		return customerPhone;
	}

	public void setCustomerPhone(String customerPhone) {
		this.customerPhone = customerPhone;
	}
	
}
