package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "constructerrecord", catalog = "construction")
public class ConstructerRecordPO implements Serializable {

	private static final long serialVersionUID = -6199496709627150862L;

	private long crid;

	private long cid;

	private String orderId;

	private long uid;

	private long cnid;

	private long schedule;

	private Timestamp createTime;

	public ConstructerRecordPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "crid")
	public long getCrid() {
		return crid;
	}

	public void setCrid(long crid) {
		this.crid = crid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "uid")
	public long getUid() {
		return uid;
	}

	public void setUid(long uid) {
		this.uid = uid;
	}

	//
	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@Column(name = "schedule")
	public long getSchedule() {
		return this.schedule;
	}

	public void setSchedule(long schedule) {
		this.schedule = schedule;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}