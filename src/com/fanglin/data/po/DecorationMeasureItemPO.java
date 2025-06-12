package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationMeasureItem", catalog = "data")
public class DecorationMeasureItemPO implements Serializable {

	private static final long serialVersionUID = 5303493399968307535L;

	private long dmiid;

	private long dmid;

	private int company;

	public DecorationMeasureItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dmiid")
	public long getDmiid() {
		return dmiid;
	}

	public void setDmiid(long dmiid) {
		this.dmiid = dmiid;
	}

	@Column(name = "dmid")
	public long getDmid() {
		return dmid;
	}

	public void setDmid(long dmid) {
		this.dmid = dmid;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
