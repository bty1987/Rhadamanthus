package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationmeasureruleitem", catalog = "data")
public class DecorationMeasureRuleItemPO implements Serializable {

	private static final long serialVersionUID = 5303493399968307535L;

	private long dmriid;

	private long dmrid;

	private int company;

	public DecorationMeasureRuleItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dmriid")
	public long getDmriid() {
		return dmriid;
	}

	public void setDmriid(long dmriid) {
		this.dmriid = dmriid;
	}

	@Column(name = "dmrid")
	public long getDmrid() {
		return dmrid;
	}

	public void setDmrid(long dmrid) {
		this.dmrid = dmrid;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
