package com.fanglin.member.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class MemberCardVO  implements java.io.Serializable {

	private static final long serialVersionUID = -5234317413264651568L;

	private Long mcId;
	
	private String no;
	
	private String orderId;
	
	private Float credits;
	
	private Timestamp createTime;

	public Long getMcId() {
		return mcId;
	}

	public void setMcId(Long mcId) {
		this.mcId = mcId;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	
	public Float getCredits() {
		return credits;
	}

	public void setCredits(Float credits) {
		this.credits = credits;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
}
