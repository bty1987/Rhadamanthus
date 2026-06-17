package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "cppointpayment", catalog = "customer")
public class PointPaymentPO implements Serializable {

	private static final long serialVersionUID = 74537976328553757L;

	public static final short TYPE_DECORATION_INT = 1; // 装修

	public static final short TYPE_MATERIAL_INT = 2; // 主材

	public static final short STATUS_ABLE_SHORT = 0; // 有效

	public static final short STATUS_DISABLE_SHORT = 1; // 失效

	private long paymentId;

	private long accountId;

	private PointRecordPO pointRecord;

	private long pid;

	private String no;

	private String orderId;

	private short type;

	private short status;

	private long point;

	private Timestamp createTime;

	public PointPaymentPO() {
		super();
	}

	public PointPaymentPO(PointRecordPO pointRecord) {
		super();
		this.pointRecord = pointRecord;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cppid")
	public long getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(long paymentId) {
		this.paymentId = paymentId;
	}

	@Column(name = "cpid")
	public long getAccountId() {
		return accountId;
	}

	public void setAccountId(long accountId) {
		this.accountId = accountId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cprid", referencedColumnName = "cprid")
	public PointRecordPO getPointRecord() {
		return pointRecord;
	}

	public void setPointRecord(PointRecordPO pointRecord) {
		this.pointRecord = pointRecord;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "point")
	public long getPoint() {
		return point;
	}

	public void setPoint(long point) {
		this.point = point;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
