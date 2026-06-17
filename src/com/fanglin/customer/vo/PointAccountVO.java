package com.fanglin.customer.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.CustomerVO;

public class PointAccountVO implements Serializable {

	private static final long serialVersionUID = 3516842388789272716L;

	private Long accountId;

	private CustomerVO customer;

	private String orderId;

	private Long decorationPoint;

	private Long materialPoint;

	private Long operatePoint;

	private Long point;

	private Integer company;

	public PointAccountVO() {
		super();
	}

	public PointAccountVO(CustomerVO customer) {
		super();
		this.customer = customer;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
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

	public Long getDecorationPoint() {
		return decorationPoint;
	}

	public void setDecorationPoint(Long decorationPoint) {
		this.decorationPoint = decorationPoint;
	}

	public Long getMaterialPoint() {
		return materialPoint;
	}

	public void setMaterialPoint(Long materialPoint) {
		this.materialPoint = materialPoint;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Long getOperatePoint() {
		return operatePoint;
	}

	public void setOperatePoint(Long operatePoint) {
		this.operatePoint = operatePoint;
	}

	public Long getPoint() {
		return point;
	}

	public void setPoint(Long point) {
		this.point = point;
	}
}
