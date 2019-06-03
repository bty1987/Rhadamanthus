package com.fanglin.construction.vo;

import java.io.Serializable;

public class ConstructionInfoVO implements Serializable {

	private static final long serialVersionUID = -8887915345535064194L;

	private Long ciid;
	
	private String orderId;

	private Long cid;

	private Short ishovel;

	private Short iskey;

	private Short isCeremony;

	private String comment;

	public Long getCiid() {
		return ciid;
	}

	public void setCiid(Long ciid) {
		this.ciid = ciid;
	}
	
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Short getIshovel() {
		return ishovel;
	}

	public void setIshovel(Short ishovel) {
		this.ishovel = ishovel;
	}

	public Short getIskey() {
		return iskey;
	}

	public void setIskey(Short iskey) {
		this.iskey = iskey;
	}

	public Short getIsCeremony() {
		return isCeremony;
	}

	public void setIsCeremony(Short isCeremony) {
		this.isCeremony = isCeremony;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
