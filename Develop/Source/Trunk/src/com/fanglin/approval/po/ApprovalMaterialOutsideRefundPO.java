package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalmaterialoutsiderefund", catalog = "approval")
public class ApprovalMaterialOutsideRefundPO implements java.io.Serializable {

	private static final long serialVersionUID = -472033991048747200L;
	
	public static final String COLUMN_AID_STR = "aid";

	private long amorId;
	
	private int aid;
	
	private long moId;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "amorId")
	public long getAmorId() {
		return this.amorId;
	}

	public void setAmorId(long amorId) {
		this.amorId = amorId;
	}

	@Column(name = "aid")
	public int getAid() {
		return aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
	}

	@Column(name = "moId")
	public long getMoId() {
		return this.moId;
	}

	public void setMoId(long moId) {
		this.moId = moId;
	}

}