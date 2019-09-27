package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalsalesrefund", catalog = "approval")
public class ApprovalSalesRefundPO implements java.io.Serializable {

	private static final long serialVersionUID = 2272182475271119881L;

	public static final String COLUMN_AID_STR = "aid";

	public static final short TYPE_REFUND_INT = 1;

	private long asrid;

	private long aid;

	private long sid;

	private long refund;

	private short type;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "asrid")
	public long getAsrid() {
		return this.asrid;
	}

	public void setAsrid(long asrid) {
		this.asrid = asrid;
	}

	@Column(name = "aid")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "sid")
	public long getSid() {
		return this.sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "refund")
	public long getRefund() {
		return this.refund;
	}

	public void setRefund(long refund) {
		this.refund = refund;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

}
