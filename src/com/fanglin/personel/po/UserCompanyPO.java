package com.fanglin.personel.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.system.po.CompanyPO;

@Entity
@Table(name = "usercompany", catalog = "communion")
public class UserCompanyPO implements Serializable {

	private static final long serialVersionUID = -9073486016937854510L;

	private long ucid;

	private int uid;

	private CompanyPO company;

	public UserCompanyPO() {
		super();
	}

	public UserCompanyPO(CompanyPO company) {
		super();
		this.company = company;
	}

	public UserCompanyPO(int uid, CompanyPO company) {
		super();
		this.uid = uid;
		this.company = company;
	}

	@Id
	@GeneratedValue
	@Column(name = "ucid")
	public long getUcid() {
		return ucid;
	}

	public void setUcid(long ucid) {
		this.ucid = ucid;
	}

	@Column(name = "uid")
	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid", nullable = false)
	public CompanyPO getCompany() {
		return company;
	}

	public void setCompany(CompanyPO company) {
		this.company = company;
	}

}
