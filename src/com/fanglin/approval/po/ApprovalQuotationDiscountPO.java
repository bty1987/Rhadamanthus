package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalquotationdiscount", catalog = "approval")
public class ApprovalQuotationDiscountPO implements java.io.Serializable {

	private static final long serialVersionUID = -7234919961337358956L;
	
	public static final String COLUMN_AID_STR = "aid";

	private int aqdid;
	
	private long aid;
	
	private String orderId;
	
	private long qid;
	
	private float oldDiscount;
	
	private float newDiscount;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aqdid")
	public int getAqdid() {
		return this.aqdid;
	}

	public void setAqdid(int aqdid) {
		this.aqdid = aqdid;
	}

	@Column(name = "aId")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "oldDiscount")
	public float getOldDiscount() {
		return this.oldDiscount;
	}

	public void setOldDiscount(float oldDiscount) {
		this.oldDiscount = oldDiscount;
	}

	@Column(name = "newDiscount")
	public float getNewDiscount() {
		return this.newDiscount;
	}

	public void setNewDiscount(float newDiscount) {
		this.newDiscount = newDiscount;
	}
}