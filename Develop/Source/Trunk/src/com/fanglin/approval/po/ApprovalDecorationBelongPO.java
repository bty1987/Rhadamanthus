package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvaldecorationbelong", catalog = "approval")
public class ApprovalDecorationBelongPO implements java.io.Serializable {
	
	private static final long serialVersionUID = 6406336972630667566L;
	
	public static final String COLUMN_AID_STR = "aid";

	private int adbId;
	
	private int aid;
	
	private String orderId;
	
	private String belongType;

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
	public int getAid() {
		return this.aid;
	}

	public void setAid(int aid) {
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
	public String getBelongType() {
		return this.belongType;
	}

	public void setBelongType(String belongType) {
		this.belongType = belongType;
	}

}