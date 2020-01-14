package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalCustomerOrigin", catalog = "approval")
public class ApprovalCustomerOriginPO implements Serializable {

	private static final long serialVersionUID = -4327950869950843118L;

	private long acoid;

	private long aid;

	private long csid;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "acoid")
	public long getAcoid() {
		return acoid;
	}

	public void setAcoid(long acoid) {
		this.acoid = acoid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

}
