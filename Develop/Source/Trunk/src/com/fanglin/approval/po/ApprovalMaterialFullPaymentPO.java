package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalmaterialfullpayment", catalog = "platform")
public class ApprovalMaterialFullPaymentPO implements java.io.Serializable {

	private static final long serialVersionUID = -4242713228291230625L;
	
	public static final String COLUMN_AID_STR = "aid";

	private int amfpId;
	
	private int aid;
	
	private long msoId;
	
	private float referMoney;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "amfpId")
	public int getAmfpId() {
		return this.amfpId;
	}

	public void setAmfpId(int amfpId) {
		this.amfpId = amfpId;
	}

	@Column(name = "aId")
	public int getAid() {
		return this.aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
	}

	@Column(name = "msoId")
	public long getMsoId() {
		return this.msoId;
	}

	public void setMsoId(long msoId) {
		this.msoId = msoId;
	}

	@Column(name = "referMoney")
	public float getReferMoney() {
		return this.referMoney;
	}

	public void setReferMoney(float referMoney) {
		this.referMoney = referMoney;
	}

}