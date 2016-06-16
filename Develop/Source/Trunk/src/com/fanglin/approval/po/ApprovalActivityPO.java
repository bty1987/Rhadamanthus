package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalactivity", catalog = "platform")
public class ApprovalActivityPO implements java.io.Serializable {

	private static final long serialVersionUID = 6454074076656136282L;
	
	public static final String COLUMN_AID_STR = "aid";

	private long aaId;
	
	private int aid;
	
	private long activityId;
	
	private String orderId;
	
	private String activityName;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aaId")
	public long getAaId() {
		return this.aaId;
	}

	public void setAaId(long aaId) {
		this.aaId = aaId;
	}

	@Column(name = "aId")
	public int getAid() {
		return this.aid;
	}

	public void setAid(int aid) {
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