package com.fanglin.right.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.sales.po.SalesFunctionPO;

@Entity
@Table(name = "salesfunctionright", catalog = "platform")
public class SalesFunctionRightPO {
	
	private long sfrid;

	private String name;

	private SalesFunctionPO salesFunction;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "sfrid")
	public long getSfrid() {
		return sfrid;
	}

	public void setSfrid(long sfrid) {
		this.sfrid = sfrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "sfid", referencedColumnName = "sfid")
	public SalesFunctionPO getSalesFunction() {
		return salesFunction;
	}

	public void setSalesFunction(SalesFunctionPO salesFunction) {
		this.salesFunction = salesFunction;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
