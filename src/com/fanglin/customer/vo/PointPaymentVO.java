package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.customer.po.PointRecordPO;
import com.fanglin.payment.po.PaymentPO;

public class PointPaymentVO implements Serializable {

	private static final long serialVersionUID = -2914210283910878985L;

	private Long paymentId;

	private Long accountId;

	private PointRecordPO pointRecord;

	private PaymentPO payment;

	private String no;

	private String orderId;

	private Short type;

	private Short status;

	private Long point;

	private Timestamp createTime;

	public PointPaymentVO() {
		super();
	}

	public PointPaymentVO(PointRecordPO pointRecord, PaymentPO payment) {
		super();
		this.pointRecord = pointRecord;
		this.payment = payment;
	}

	public Long getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

	public PointRecordPO getPointRecord() {
		return pointRecord;
	}

	public void setPointRecord(PointRecordPO pointRecord) {
		this.pointRecord = pointRecord;
	}

	public PaymentPO getPayment() {
		return payment;
	}

	public void setPayment(PaymentPO payment) {
		this.payment = payment;
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

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Long getPoint() {
		return point;
	}

	public void setPoint(Long point) {
		this.point = point;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
}
