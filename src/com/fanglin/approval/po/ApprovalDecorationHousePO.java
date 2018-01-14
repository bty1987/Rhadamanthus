package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvaldecorationhouse", catalog = "approval")
public class ApprovalDecorationHousePO implements java.io.Serializable {

	private static final long serialVersionUID = -9212466784774845982L;
	
	public static final String COLUMN_AID_STR = "aid";

	private int adhid;
	
	private int aid;
	
	private String orderId;

	private int shid;
	
	private int thid;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "adhid")

	public int getAdhid() {
		return adhid;
	}

	public void setAdhid(int adhid) {
		this.adhid = adhid;
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

	@Column(name = "shid")
	public int getShid() {
		return shid;
	}

	public void setShid(int shid) {
		this.shid = shid;
	}

	@Column(name = "thid")
	public int getThid() {
		return thid;
	}

	public void setThid(int thid) {
		this.thid = thid;
	}

}