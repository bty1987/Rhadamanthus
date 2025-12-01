package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.payment.po.PaymentPO;

public class CppointPaymentVO implements Serializable {

	private static final long serialVersionUID = -2914210283910878985L;

	private Long cppid;
	
	private Long cpid;
	
	private CppointRecordPO cppointRecord;
	
	private PaymentPO payment;

	private String no;

	private String orderId;

	private Short type;

	private Short status;

	private Long point;

	private Timestamp createTime;
	
	public CppointPaymentVO() {
		super();
	}

	public CppointPaymentVO(CppointRecordPO cppointRecord, PaymentPO payment) {
		super();
		this.cppointRecord = cppointRecord;
		this.payment = payment;
	}

	public Long getCppid() {
		return cppid;
	}

	public void setCppid(Long cppid) {
		this.cppid = cppid;
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public CppointRecordPO getCppointRecord() {
		return cppointRecord;
	}

	public void setCppointRecord(CppointRecordPO cppointRecord) {
		this.cppointRecord = cppointRecord;
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
