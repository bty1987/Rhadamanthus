package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalvillage", catalog = "approval")
public class ApprovalVillagePO implements java.io.Serializable {

	private static final long serialVersionUID = -9212466784774845982L;
	
	public static final String COLUMN_AID_STR = "aid";

	private int avId;
	
	private int aid;
	
	private String orderId;
	
	private String oldVillageId;
	
	private String oldHouseNumber;
	
	private String newVillageId;
	
	private String newHouseNumber;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "avId")
	public int getAvId() {
		return this.avId;
	}

	public void setAvId(int avId) {
		this.avId = avId;
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

	@Column(name = "oldVillageId")
	public String getOldVillageId() {
		return this.oldVillageId;
	}

	public void setOldVillageId(String oldVillageId) {
		this.oldVillageId = oldVillageId;
	}

	@Column(name = "oldHouseNumber")
	public String getOldHouseNumber() {
		return this.oldHouseNumber;
	}

	public void setOldHouseNumber(String oldHouseNumber) {
		this.oldHouseNumber = oldHouseNumber;
	}

	@Column(name = "newVillageId")
	public String getNewVillageId() {
		return this.newVillageId;
	}

	public void setNewVillageId(String newVillageId) {
		this.newVillageId = newVillageId;
	}

	@Column(name = "newHouseNumber")
	public String getNewHouseNumber() {
		return this.newHouseNumber;
	}

	public void setNewHouseNumber(String newHouseNumber) {
		this.newHouseNumber = newHouseNumber;
	}

}