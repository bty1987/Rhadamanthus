package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalSalesDayment", catalog = "approval")
public class ApprovalSalesDaymentPO implements Serializable {

	private static final long serialVersionUID = 7419065988354139812L;

	private long sadid;

	private long sid;

	private long aid;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sadid")
	public long getSadid() {
		return sadid;
	}

	public void setSadid(long sadid) {
		this.sadid = sadid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

}
