package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalDecorationActivity", catalog = "approval")
public class ApprovalDecorationActivityPO implements java.io.Serializable {

	private static final long serialVersionUID = 6454074076656136282L;
	
	public static final String COLUMN_AID_STR = "aid";

	private long adaId;
	
	private long aid;
	
	private long activityId;
	
	private String orderId;
	
	private String activityName;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "adaId")
	public long getAdaId() {
		return adaId;
	}

	public void setAdaId(long adaId) {
		this.adaId = adaId;
	}

	@Column(name = "aId")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "activityId")
	public long getActivityId() {
		return activityId;
	}

	public void setActivityId(long activityId) {
		this.activityId = activityId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "activityName")
	public String getActivityName() {
		return this.activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}

}