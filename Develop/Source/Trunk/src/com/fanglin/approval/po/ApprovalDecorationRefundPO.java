package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvaldecorationrefund", catalog = "platform")
public class ApprovalDecorationRefundPO implements java.io.Serializable {

	private static final long serialVersionUID = 6360075646482677701L;
	
	public static final String COLUMN_AID_STR = "aid";
	
	private int adrId;
	
	private int aid;
	
	private long paymentId;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "adrId")
	public int getAdrId() {
		return this.adrId;
	}

	public void setAdrId(int adrId) {
		this.adrId = adrId;
	}

	@Column(name = "aId")
	public int getAid() {
		return this.aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
	}

	@Column(name = "paymentId")
	public long getPaymentId() {
		return this.paymentId;
	}

	public void setPaymentId(long paymentId) {
		this.paymentId = paymentId;
	}

}