package com.fanglin.information.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Title: MessageQueuingPO
 * Description: 消息队列持久化对象
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */
@Entity
@Table(name = "messagequeuing", catalog = "information")
public class MessageQueuingPO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final short STATUS_PENDING_INT = 0; // 未处理

	public static final short STATUS_PROCESSED_INT = 1; // 已处理

	private long mqid;

	private String operation;

	private String args;

	private Timestamp createTime;

	private Timestamp finishTime;

	private short status;

	private String orderId;

	public MessageQueuingPO() {
		super();
	}

	@Id
	@GeneratedValue
	public long getMqid() {
		return mqid;
	}

	public void setMqid(long mqid) {
		this.mqid = mqid;
	}

	@Column(nullable = false, length = 100)
	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	@Column(length = 65535)
	public String getArgs() {
		return args;
	}

	public void setArgs(String args) {
		this.args = args;
	}

	@Column(nullable = false)
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(nullable = false)
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(length = 50)
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

}
