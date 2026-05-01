package com.fanglin.customer.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 客户机会与装修单关系表
 * 维护 customerchance.ccid 和 customerchance.orderId 之间的映射关系
 */
@Entity
@Table(name = "customerchanceorder", catalog = "customer")
public class CustomerChanceOrderPO implements Serializable {

	private static final long serialVersionUID = 1L;

	private long ccoid;
	private long ccid;
	private String orderId;
	private Timestamp createTime;

	public CustomerChanceOrderPO() {
		super();
	}

	public CustomerChanceOrderPO(long ccid, String orderId) {
		super();
		this.ccid = ccid;
		this.orderId = orderId;
		this.createTime = new Timestamp(System.currentTimeMillis());
	}

	@Id
	@GeneratedValue
	@Column(name = "ccoid")
	public long getCcoid() {
		return ccoid;
	}

	public void setCcoid(long ccoid) {
		this.ccoid = ccoid;
	}

	@Column(name = "ccid")
	public long getCcid() {
		return ccid;
	}

	public void setCcid(long ccid) {
		this.ccid = ccid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
}
