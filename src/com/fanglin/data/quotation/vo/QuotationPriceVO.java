package com.fanglin.data.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class QuotationPriceVO implements Serializable {

	private static final long serialVersionUID = 851009450908567054L;

	private Long qpid;

	private QuotationItemVO quotationItem;

	private Integer addPrice;

	private Integer unitPrice;

	private Integer subPrice;

	private Timestamp createTime;

	private Timestamp updateTime;

	private Short status;

	public QuotationPriceVO() {
		super();
	}

	public QuotationPriceVO(QuotationItemVO quotationItem) {
		super();
		this.quotationItem = quotationItem;
	}

	public Long getQpid() {
		return qpid;
	}

	public void setQpid(Long qpid) {
		this.qpid = qpid;
	}

	public QuotationItemVO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemVO quotationItem) {
		this.quotationItem = quotationItem;
	}

	public Integer getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(Integer addPrice) {
		this.addPrice = addPrice;
	}

	public Integer getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Integer unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Integer getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(Integer subPrice) {
		this.subPrice = subPrice;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
