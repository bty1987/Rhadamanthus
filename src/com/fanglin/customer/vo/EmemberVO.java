package com.fanglin.customer.vo;

import java.io.Serializable;

public class EmemberVO implements Serializable {

	private static final long serialVersionUID = 8729287447985186934L;

	private Long emid;

	private String no;

	private String name;

	private String phone;

	private String address;

	private String unionId;

	private String ticket;

	private Short status;

	public Long getEmid() {
		return emid;
	}

	public void setEmid(Long emid) {
		this.emid = emid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
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

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getTicket() {
		return ticket;
	}

	public void setTicket(String ticket) {
		this.ticket = ticket;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
