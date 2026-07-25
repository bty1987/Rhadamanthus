package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class CustomerAfterSalesRecordVO implements Serializable {

	private static final long serialVersionUID = 4091389831690504259L;

	private Long asrid;

	private CustomerAfterSalesVO customerAfterSales;

	private Short type;

	private UserBaseVO operator;

	private Timestamp operateTime;

	private Short oldStatus;

	private Short newStatus;

	private String comment;

	public CustomerAfterSalesRecordVO() {
		super();
	}

	public CustomerAfterSalesRecordVO(CustomerAfterSalesVO customerAfterSales, UserBaseVO operator) {
		super();
		this.customerAfterSales = customerAfterSales;
		this.operator = operator;
	}

	public Long getAsrid() {
		return asrid;
	}

	public void setAsrid(Long asrid) {
		this.asrid = asrid;
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

	public UserBaseVO getOperator() {
		return operator;
	}

	public void setOperator(UserBaseVO operator) {
		this.operator = operator;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public Short getOldStatus() {
		return oldStatus;
	}

	public void setOldStatus(Short oldStatus) {
		this.oldStatus = oldStatus;
	}

	public Short getNewStatus() {
		return newStatus;
	}

	public void setNewStatus(Short newStatus) {
		this.newStatus = newStatus;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
