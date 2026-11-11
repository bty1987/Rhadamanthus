/**
 * @File Name		: ApprovalBelongTranPO.java
 * @Package   	: com.fanglin.approval.po
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 离职移交审批主行(单据头, 一人一组一张审批)
 */

package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalbelongtran", catalog = "approval")
public class ApprovalBelongTranPO implements java.io.Serializable {

	private static final long serialVersionUID = 2735610448162371904L;

	public static final String COLUMN_AID_STR = "aid";

	public static final short TRANTYPE_DESIGN_INT = 0;

	public static final short TRANTYPE_SALESMAN_INT = 1;

	public static final short TRANTYPE_ALL_INT = 2;

	private int abtId;

	private long aid;

	private int ouid; // 原移交人uid

	private short tranType; // 0设计 1业务 2两者

	private String reason;

	private long ccid;

	private int company;

	private Timestamp createTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "abtId")
	public int getAbtId() {
		return this.abtId;
	}

	public void setAbtId(int abtId) {
		this.abtId = abtId;
	}

	@Column(name = "aId")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "ouid")
	public int getOuid() {
		return this.ouid;
	}

	public void setOuid(int ouid) {
		this.ouid = ouid;
	}

	@Column(name = "tranType")
	public short getTranType() {
		return this.tranType;
	}

	public void setTranType(short tranType) {
		this.tranType = tranType;
	}

	@Column(name = "reason")
	public String getReason() {
		return this.reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	@Column(name = "ccid")
	public long getCcid() {
		return this.ccid;
	}

	public void setCcid(long ccid) {
		this.ccid = ccid;
	}

	@Column(name = "company")
	public int getCompany() {
		return this.company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
