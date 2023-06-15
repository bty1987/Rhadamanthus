package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvaldecorationterminal", catalog = "approval")
public class ApprovalDecorationTerminalPO implements java.io.Serializable {

	private static final long serialVersionUID = 57471513041236908L;

	public static final String COLUMN_AID_STR = "aid";

	private long adtid;

	private long aid;

	private String orderId;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "adtid")
	public long getAdtid() {
		return this.adtid;
	}

	public void setAdtid(long adtid) {
		this.adtid = adtid;
	}

	@Column(name = "aid")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

}
