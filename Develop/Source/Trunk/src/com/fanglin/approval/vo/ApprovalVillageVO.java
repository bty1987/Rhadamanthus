package com.fanglin.approval.vo;

public class ApprovalVillageVO implements java.io.Serializable {

	private static final long serialVersionUID = 6315526075675914533L;

	private Integer avId;
	
	private Integer aid;
	
	private String orderId;
	
	private String oldVillageId;
	
	private String oldHouseNumber;
	
	private String newVillageId;
	
	private String newHouseNumber;

	public Integer getAvId() {
		return this.avId;
	}

	public void setAvId(Integer avId) {
		this.avId = avId;
	}

	public Integer getAid() {
		return this.aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getOldVillageId() {
		return this.oldVillageId;
	}

	public void setOldVillageId(String oldVillageId) {
		this.oldVillageId = oldVillageId;
	}

	public String getOldHouseNumber() {
		return this.oldHouseNumber;
	}

	public void setOldHouseNumber(String oldHouseNumber) {
		this.oldHouseNumber = oldHouseNumber;
	}

	public String getNewVillageId() {
		return this.newVillageId;
	}

	public void setNewVillageId(String newVillageId) {
		this.newVillageId = newVillageId;
	}

	public String getNewHouseNumber() {
		return this.newHouseNumber;
	}

	public void setNewHouseNumber(String newHouseNumber) {
		this.newHouseNumber = newHouseNumber;
	}

}