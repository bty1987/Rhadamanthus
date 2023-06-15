package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvaldecorationbelongitem", catalog = "approval")
public class ApprovalDecorationBelongItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -6194667291773962401L;

	public static final String COLUMN_AOBID_STR = "adbId";

	private int adbiId;

	private int adbId;

	private String orderId;

	private int buid;

	private int bdid;

	private int brid;

	private int rate;

	private short defaultFlag;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "adbiId")
	public int getAdbiId() {
		return this.adbiId;
	}

	public void setAdbiId(int adbiId) {
		this.adbiId = adbiId;
	}

	@Column(name = "adbId")
	public int getAdbId() {
		return this.adbId;
	}

	public void setAdbId(int adbId) {
		this.adbId = adbId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "buid")
	public int getbuid() {
		return this.buid;
	}

	public void setBuid(int buid) {
		this.buid = buid;
	}

	@Column(name = "bdid")
	public int getBdid() {
		return bdid;
	}

	public void setBdid(int bdid) {
		this.bdid = bdid;
	}

	@Column(name = "brid")
	public int getBrid() {
		return brid;
	}

	public void setBrid(int brid) {
		this.brid = brid;
	}

	@Column(name = "rate")
	public int getRate() {
		return this.rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
	}

	@Column(name = "defaultFlag")
	public short getDefaultFlag() {
		return this.defaultFlag;
	}

	public void setDefaultFlag(short defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

}