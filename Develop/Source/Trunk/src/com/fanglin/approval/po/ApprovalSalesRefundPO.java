package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "approvalsalesrefund", catalog = "approval")
public class ApprovalSalesRefundPO implements java.io.Serializable {

	private static final long serialVersionUID = 2272182475271119881L;

	public static final String COLUMN_AID_STR = "aid";

	private Long asrid;

	private Integer aid;

	private Long sid;

	private Float refund;

	private short type;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "asrid")
	public Long getAsrid() {
		return this.asrid;
	}

	public void setAsrid(Long asrid) {
		this.asrid = asrid;
	}

	@Column(name = "aid")
	public Integer getAid() {
		return this.aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	@Column(name = "sid")
	public Long getSid() {
		return this.sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	@Column(name = "refund")
	public Float getRefund() {
		return this.refund;
	}

	public void setRefund(Float refund) {
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
