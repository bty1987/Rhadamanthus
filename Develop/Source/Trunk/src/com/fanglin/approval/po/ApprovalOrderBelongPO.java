package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalorderbelong", catalog = "approval")
public class ApprovalOrderBelongPO implements java.io.Serializable {
	
	private static final long serialVersionUID = 6406336972630667566L;
	
	public static final String COLUMN_AID_STR = "aid";

	private int aobId;
	
	private int aid;
	
	private String orderId;
	
	private String belongType;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aobId")
	public int getAobId() {
		return this.aobId;
	}

	public void setAobId(int aobId) {
		this.aobId = aobId;
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