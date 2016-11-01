package com.fanglin.report.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.system.po.RegionPO;

@Entity
@Table(name = "regioncount", catalog = "report")
public class RegionCountPO implements java.io.Serializable {

	private static final long serialVersionUID = 740677348752942328L;

	private long rcId;
	
	private RegionPO region;
	
	private int newOrderNum;
	
	private int signOrderNum;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rcId")
	public long getRcId() {
		return this.rcId;
	}

	public void setRcId(long rcId) {
		this.rcId = rcId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "rId", referencedColumnName="rId")
	public RegionPO getRegion() {
		return region;
	}

	public void setRegion(RegionPO region) {
		this.region = region;
	}

	@Column(name = "newOrderNum")
	public int getNewOrderNum() {
		return this.newOrderNum;
	}

	public void setNewOrderNum(int newOrderNum) {
		this.newOrderNum = newOrderNum;
	}

	@Column(name = "signOrderNum")
	public int getSignOrderNum() {
		return this.signOrderNum;
	}

	public void setSignOrderNum(int signOrderNum) {
		this.signOrderNum = signOrderNum;
	}

}