package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class NormChangeRecordVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long ncrId;

	private Short type;

	private Short changeType;

	private String orderId;

	private Long qid;

	private Long refId;

	private String refNo;

	private String beforeValue;

	private String afterValue;

	private String comment;

	private String operater;

	private Timestamp operateTime;

	public NormChangeRecordVO() {
		super();
	}

	public Long getNcrId() {
		return ncrId;
	}

	public void setNcrId(Long ncrId) {
		this.ncrId = ncrId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getChangeType() {
		return changeType;
	}

	public void setChangeType(Short changeType) {
		this.changeType = changeType;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public Long getRefId() {
		return refId;
	}

	public void setRefId(Long refId) {
		this.refId = refId;
	}

	public String getRefNo() {
		return refNo;
	}

	public void setRefNo(String refNo) {
		this.refNo = refNo;
	}

	public String getBeforeValue() {
		return beforeValue;
	}

	public void setBeforeValue(String beforeValue) {
		this.beforeValue = beforeValue;
	}

	public String getAfterValue() {
		return afterValue;
	}

	public void setAfterValue(String afterValue) {
		this.afterValue = afterValue;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getOperater() {
		return operater;
	}

	public void setOperater(String operater) {
		this.operater = operater;
	}

	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

}
