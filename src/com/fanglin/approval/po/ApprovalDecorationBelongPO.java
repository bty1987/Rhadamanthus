package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvaldecorationbelong", catalog = "approval")
public class ApprovalDecorationBelongPO implements java.io.Serializable {

	private static final long serialVersionUID = 6406336972630667566L;

	public static final String COLUMN_AID_STR = "aid";

	private int adbId;

	private long aid;

	private String orderId;

	private short belongType;

	private short mergeFlag;

	private long ccid;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "adbId")
	public int getAdbId() {
		return this.adbId;
	}

	public void setAdbId(int adbId) {
		this.adbId = adbId;
	}

	@Column(name = "aId")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "belongType")
	public short getBelongType() {
		return this.belongType;
	}

	public void setBelongType(short belongType) {
		this.belongType = belongType;
	}

	@Column(name = "mergeFlag")
	public short getMergeFlag() {
		return this.mergeFlag;
	}

	public void setMergeFlag(short mergeFlag) {
		this.mergeFlag = mergeFlag;
	}

	@Column(name = "ccid")
	public long getCcid() {
		return ccid;
	}

	public void setCcid(long ccid) {
		this.ccid = ccid;
	}

}