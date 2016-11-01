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

import com.fanglin.system.po.CityProperPO;

@Entity
@Table(name = "citypropercount", catalog = "report")
public class CityProperCountPO implements java.io.Serializable {

	private static final long serialVersionUID = -7975925159885259938L;

	private long cpcId;
	
	private CityProperPO cityProper;
	
	private int newOrderNum;
	
	private int signOrderNum;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpcId")
	public long getCpcId() {
		return this.cpcId;
	}

	public void setCpcId(long cpcId) {
		this.cpcId = cpcId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cpId", referencedColumnName="cpId")
	public CityProperPO getCityProper() {
		return cityProper;
	}

	public void setCityProper(CityProperPO cityProper) {
		this.cityProper = cityProper;
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