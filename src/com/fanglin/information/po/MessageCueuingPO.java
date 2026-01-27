package com.fanglin.information.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Title: MessageCueuingPO Description: 消息提示持久化对象 Copyright: Copyright (c) 2013 All rights reserved. Company: BTY
 *
 * @author bty1987
 *
 */
@Entity
@Table(name = "messagecueuing", catalog = "information")
public class MessageCueuingPO implements Serializable {

	private static final long serialVersionUID = 5265676191043540187L;

	public static final short STATUS_PENDING_INT = 0; // 未处理

	public static final short STATUS_PROCESSED_INT = 1; // 已处理

	private long mcid;

	private String operation;

	private String args;

	private Timestamp createTime;

	private Timestamp finishTime;

	private short status;

	private String orderId;

	public MessageCueuingPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "mcid")
	public long getMcid() {
		return mcid;
	}

	public void setMcid(long mcid) {
		this.mcid = mcid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "operation")
	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	@Column(name = "args")
	public String getArgs() {
		return args;
	}

	public void setArgs(String args) {
		this.args = args;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public MessageCueuingPO init(String orderId, String operation, String args) {

		setOrderId(orderId);
		setOperation(operation);
		setArgs(args);
		setCreateTime(new java.sql.Timestamp(System.currentTimeMillis()));
		setStatus(com.fanglin.information.po.MessageCueuingPO.STATUS_PENDING_INT);

		return this;
	}

}
