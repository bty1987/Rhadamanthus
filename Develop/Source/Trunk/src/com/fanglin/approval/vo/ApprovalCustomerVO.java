package com.fanglin.approval.vo;

public class ApprovalCustomerVO implements java.io.Serializable {

	private static final long serialVersionUID = 1863121293113776602L;

	private Integer acId;
	
	private Integer aid;
	
	private Integer customerId;
	
	private String oldCustomerName;
	
	private String oldCustomerPhone;
	
	private String newCustomerName;
	
	private String newCustomerPhone;

	public Integer getAcId() {
		return this.acId;
	}

	public void setAcId(Integer acId) {
		this.acId = acId;
	}

	public Integer getAid() {
		return this.aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	public Integer getCustomerId() {
		return this.customerId;
	}

	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
	}

	public String getOldCustomerName() {
		return this.oldCustomerName;
	}

	public void setOldCustomerName(String oldCustomerName) {
		this.oldCustomerName = oldCustomerName;
	}

	public String getOldCustomerPhone() {
		return this.oldCustomerPhone;
	}

	public void setOldCustomerPhone(String oldCustomerPhone) {
		this.oldCustomerPhone = oldCustomerPhone;
	}

	public String getNewCustomerName() {
		return this.newCustomerName;
	}

	public void setNewCustomerName(String newCustomerName) {
		this.newCustomerName = newCustomerName;
	}

	public String getNewCustomerPhone() {
		return this.newCustomerPhone;
	}

	public void setNewCustomerPhone(String newCustomerPhone) {
		this.newCustomerPhone = newCustomerPhone;
	}

}