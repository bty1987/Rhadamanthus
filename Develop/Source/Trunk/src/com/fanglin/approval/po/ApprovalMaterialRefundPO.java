package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalmaterialrefund", catalog = "platform")
public class ApprovalMaterialRefundPO implements java.io.Serializable {

	private static final long serialVersionUID = -7756649919263545860L;
	
	public static final String COLUMN_AID_STR = "aid";

	private int amrId;
	
	private int aid;
	
	private long msoId;
	
	private float refund;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "amrId")
	public int getAmrId() {
		return this.amrId;
	}

	public void setAmrId(int amrId) {
		this.amrId = amrId;
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

	@Column(name = "refund")
	public float getRefund() {
		return this.refund;
	}

	public void setRefund(float refund) {
		this.refund = refund;
	}

}