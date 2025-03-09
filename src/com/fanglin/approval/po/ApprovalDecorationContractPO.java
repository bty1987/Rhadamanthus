package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvaldecorationcontract", catalog = "approval")
public class ApprovalDecorationContractPO implements java.io.Serializable {

	private static final long serialVersionUID = -1775004453736353616L;

	public static final String COLUMN_AID_STR = "aid";

	private long adcid;

	private long aid;

	private String orderId;

	private long cid;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "adcid")
	public long getAdcid() {
		return adcid;
	}

	public void setAdcid(long adcid) {
		this.adcid = adcid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
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

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

}
