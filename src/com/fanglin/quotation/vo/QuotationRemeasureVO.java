package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.communion.vo.BrandVO;
import com.fanglin.personel.vo.UserBaseVO;

public class QuotationRemeasureVO implements Serializable {

	private static final long serialVersionUID = -4961470084992235465L;

	private Long qrid;

	private String orderId;

	private BrandVO brand;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short status;

	private Integer company;

	public Long getQrid() {
		return qrid;
	}

	public void setQrid(Long qrid) {
		this.qrid = qrid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
		this.brand = brand;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
