package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalmaterialrefund", catalog = "approval")
public class ApprovalMaterialRefundPO implements java.io.Serializable {

	private static final long serialVersionUID = -7756649919263545860L;
	
	public static final String COLUMN_AID_STR = "aid";

	private int amrId;
	
	private int aid;
	
	private long mid;
	
	private float refund;
	
	private short type;

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

	@Column(name = "mid")
	public long getMid() {
		return mid;
	}

	public void setMid(long mid) {
		this.mid = mid;
	}

	@Column(name = "refund")
	public float getRefund() {
		return this.refund;
	}

	public void setRefund(float refund) {
		this.refund = refund;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

}