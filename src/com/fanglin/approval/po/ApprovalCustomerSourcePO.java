package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalCustomerSource", catalog = "approval")
public class ApprovalCustomerSourcePO implements Serializable {

	private static final long serialVersionUID = -5371631778519685511L;

	private long acsid;

	private long aid;

	private long csid;

	private long hid;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "acsid")
	public long getAcsid() {
		return acsid;
	}

	public void setAcsid(long acsid) {
		this.acsid = acsid;
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

	@Column(name = "hid")
	public long getHid() {
		return hid;
	}

	public void setHid(long hid) {
		this.hid = hid;
	}

}
