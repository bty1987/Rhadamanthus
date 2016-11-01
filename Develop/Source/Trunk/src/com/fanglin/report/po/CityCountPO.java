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

import com.fanglin.system.po.CityPO;

@Entity
@Table(name = "citycount", catalog = "report")
public class CityCountPO implements java.io.Serializable {

	private static final long serialVersionUID = -3166249825076475144L;

	private long ccId;
	
	private CityPO city;
	
	private int newOrderNum;
	
	private int signOrderNum;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ccId")
	public long getCcId() {
		return this.ccId;
	}

	public void setCcId(long ccId) {
		this.ccId = ccId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cId", referencedColumnName="cId")
	public CityPO getCity() {
		return city;
	}

	public void setCity(CityPO city) {
		this.city = city;
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