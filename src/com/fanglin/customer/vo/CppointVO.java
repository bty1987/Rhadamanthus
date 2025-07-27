package com.fanglin.customer.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.CustomerVO;

public class CppointVO implements Serializable {

	private static final long serialVersionUID = 3516842388789272716L;

	private Long cpid;

	private CustomerVO customer;

	private String orderId;

	private Long dpoint;

	private Long spoint;

	private Long opoint;

	private Long point;

	private Integer company;

	public CppointVO() {
		super();
	}

	public CppointVO(CustomerVO customer) {
		super();
		this.customer = customer;
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getDpoint() {
		return dpoint;
	}

	public void setDpoint(Long dpoint) {
		this.dpoint = dpoint;
	}

	public Long getSpoint() {
		return spoint;
	}

	public void setSpoint(Long spoint) {
		this.spoint = spoint;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Long getOpoint() {
		return opoint;
	}

	public void setOpoint(Long opoint) {
		this.opoint = opoint;
	}

	public Long getPoint() {
		return point;
	}

	public void setPoint(Long point) {
		this.point = point;
	}
}
