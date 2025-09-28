package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserBaseVO;

public class SalesDeliveryVO implements Serializable {

	private static final long serialVersionUID = 3967010631258889833L;

	private Long sdid;

	private SalesVO sales;

	private Short status;

	private Timestamp createTime;

	private Timestamp peliveryTime;

	private UserBaseVO creater;

	private String comment;

	private Integer company;

	public SalesDeliveryVO() {
		super();
	}

	public Long getSdid() {
		return sdid;
	}

	public void setSdid(Long sdid) {
		this.sdid = sdid;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPeliveryTime() {
		return peliveryTime;
	}

	public void setPeliveryTime(Timestamp peliveryTime) {
		this.peliveryTime = peliveryTime;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public SalesDeliveryVO filter(List<Filter> filters) {

		if (getStatus() != null) {
			filters.add(new Filter("status", String.valueOf(getStatus()), "eq"));
		}

		return this;
	}

}
