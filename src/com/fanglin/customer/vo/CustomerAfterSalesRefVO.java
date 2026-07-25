package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class CustomerAfterSalesRefVO implements Serializable {

	private static final long serialVersionUID = 7317486579594120954L;

	private Long asfid;

	private CustomerAfterSalesVO customerAfterSales;

	private Short type;

	private Long refId;

	private Timestamp createTime;

	public CustomerAfterSalesRefVO() {
		super();
	}

	public CustomerAfterSalesRefVO(CustomerAfterSalesVO customerAfterSales) {
		super();
		this.customerAfterSales = customerAfterSales;
	}

	public Long getAsfid() {
		return asfid;
	}

	public void setAsfid(Long asfid) {
		this.asfid = asfid;
	}

	public CustomerAfterSalesVO getCustomerAfterSales() {
		return customerAfterSales;
	}

	public void setCustomerAfterSales(CustomerAfterSalesVO customerAfterSales) {
		this.customerAfterSales = customerAfterSales;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getRefId() {
		return refId;
	}

	public void setRefId(Long refId) {
		this.refId = refId;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
