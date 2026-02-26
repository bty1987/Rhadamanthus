package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class DecorationContractRecordVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long dcrid;

	private String orderId;

	private Timestamp commitTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private String comment;

	public DecorationContractRecordVO() {
		super();
	}

	public Long getDcrid() {
		return dcrid;
	}

	public void setDcrid(Long dcrid) {
		this.dcrid = dcrid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCommitTime() {
		return commitTime;
	}

	public void setCommitTime(Timestamp commitTime) {
		this.commitTime = commitTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
