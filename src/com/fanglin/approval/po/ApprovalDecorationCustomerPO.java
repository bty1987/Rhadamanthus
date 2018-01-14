package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalCustomer", catalog = "approval")
public class ApprovalDecorationCustomerPO implements java.io.Serializable {

	private static final long serialVersionUID = 6309127717456693779L;
	
	public static final String COLUMN_AID_STR = "aid";

	private int acId;
	
	private int aid;
	
	private int customerId;
	
	private String newCustomerName;
	
	private String newCustomerPhone;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "acId")
	public int getAcId() {
		return this.acId;
	}

	public void setAcId(int acId) {
		this.acId = acId;
	}

	@Column(name = "aId")
	public int getAid() {
		return this.aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
	}

	@Column(name = "customerId")
	public int getCustomerId() {
		return this.customerId;
	}

	public void setCustomerId(int customerId) {
		this.customerId = customerId;
	}

	@Column(name = "newCustomerName")
	public String getNewCustomerName() {
		return this.newCustomerName;
	}

	public void setNewCustomerName(String newCustomerName) {
		this.newCustomerName = newCustomerName;
	}

	@Column(name = "newCustomerPhone")
	public String getNewCustomerPhone() {
		return this.newCustomerPhone;
	}

	public void setNewCustomerPhone(String newCustomerPhone) {
		this.newCustomerPhone = newCustomerPhone;
	}

}