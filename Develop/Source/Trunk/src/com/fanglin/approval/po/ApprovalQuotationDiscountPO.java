package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalquotationdiscount", catalog = "platform")
public class ApprovalQuotationDiscountPO implements java.io.Serializable {

	private static final long serialVersionUID = -7234919961337358956L;
	
	public static final String COLUMN_AID_STR = "aid";

	private int aqdId;
	
	private int aid;
	
	private String orderId;
	
	private long quotationId;
	
	private float oldDiscount;
	
	private float newDiscount;
	
	private short level;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aqdId")
	public int getAqdId() {
		return this.aqdId;
	}

	public void setAqdId(int aqdId) {
		this.aqdId = aqdId;
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

	@Column(name = "quotationId")
	public long getQuotationId() {
		return this.quotationId;
	}

	public void setQuotationId(long quotationId) {
		this.quotationId = quotationId;
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

	@Column(name = "level")
	public short getLevel() {
		return level;
	}

	public void setLevel(short level) {
		this.level = level;
	}

}