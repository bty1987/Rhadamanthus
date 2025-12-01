package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class BasePaymentVO implements Serializable {

	private static final long serialVersionUID = 2976006963176984016L;
	
	private Long paymentId; 

	private Long referMoney;

	private Timestamp createTime;

	private Short paymentType;


	public BasePaymentVO() {
		super();
	}

	public BasePaymentVO(Long paymentId, Long referMoney, Timestamp createTime, Short paymentType) {
		super();
		this.paymentId = paymentId;
		this.referMoney = referMoney;
		this.createTime = createTime;
		this.paymentType = paymentType;
	}

	public Long getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
	}

	public Long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Long referMoney) {
		this.referMoney = referMoney;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(Short paymentType) {
		this.paymentType = paymentType;
	}
	

}
