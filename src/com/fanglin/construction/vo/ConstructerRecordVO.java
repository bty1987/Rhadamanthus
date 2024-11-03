package com.fanglin.construction.vo;

import java.sql.Timestamp;

public class ConstructerRecordVO implements java.io.Serializable {

	private static final long serialVersionUID = 5071168089649592674L;

	private Long crid;

	private Long cid;

	private String orderId;

	private Long uid;

	private Long cnid;

	private Long schedule;

	private Timestamp createTime;

	public ConstructerRecordVO() {
		super();
	}

	public Long getCrid() {
		return crid;
	}

	public void setCrid(Long crid) {
		this.crid = crid;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public Long getSchedule() {
		return this.schedule;
	}

	public void setSchedule(Long schedule) {
		this.schedule = schedule;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
