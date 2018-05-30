package com.fanglin.right.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationstatusright", catalog = "platform")
public class DecorationStatusRightPO implements java.io.Serializable {

	private static final long serialVersionUID = 6652444709974531640L;
	
	public static final Short STATUS_ALL_ENABLE_INT = -1;//全部
	
	public static final String COLUMN_UID_STR = "uid";
	
	public static final String COLUMN_COMPANY_STR = "company";

	private int dosrId;
	
	private int uid;
	
	private short status;
	
	private int company;
	
	public DecorationStatusRightPO() {
		super();
	}

	public DecorationStatusRightPO(int uid, short status, int company) {
		super();
		this.uid = uid;
		this.status = status;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dosrId")
	public int getDosrId() {
		return this.dosrId;
	}

	public void setDosrId(int dosrId) {
		this.dosrId = dosrId;
	}

	@Column(name = "uId")
	public int getUid() {
		return this.uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}