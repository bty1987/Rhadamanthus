package com.fanglin.communion.vo;

import java.io.Serializable;

public class VustomerVO implements Serializable{

	private static final long serialVersionUID = -4666586604257215679L;
	
	private Long vid;
	
	private String ident;
	
	private String name;
	
	private String phone;
	
	private String address;
	
	private String orderId;
	
	private Float contractPrice;
	
	private Short status;
	
	private String comment;
	
	public VustomerVO() {
		super();
	}

	public Long getVid() {
		return vid;
	}

	public void setVid(Long vid) {
		this.vid = vid;
	}

	public String getIdent() {
		return ident;
	}

	public void setIdent(String ident) {
		this.ident = ident;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Float getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(Float contractPrice) {
		this.contractPrice = contractPrice;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
