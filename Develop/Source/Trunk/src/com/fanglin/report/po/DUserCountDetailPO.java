package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "dusercountdetail", catalog = "report")
public class DUserCountDetailPO implements java.io.Serializable {

	private static final long serialVersionUID = 2273639497474419489L;

	private long ducdId;
	
	private int duId;
	
	private int suId;
	
	private float createNum;
	
	private float signNum;
	
	private float contractPrice;
	
	private Date createDate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ducdId")
	public long getDucdId() {
		return this.ducdId;
	}

	public void setDucdId(long ducdId) {
		this.ducdId = ducdId;
	}

	@Column(name = "duId")
	public int getDuId() {
		return this.duId;
	}

	public void setDuId(int duId) {
		this.duId = duId;
	}

	@Column(name = "suId")
	public int getSuId() {
		return this.suId;
	}

	public void setSuId(int suId) {
		this.suId = suId;
	}

	@Column(name = "createNum")
	public float getCreateNum() {
		return this.createNum;
	}

	public void setCreateNum(float createNum) {
		this.createNum = createNum;
	}

	@Column(name = "signNum")
	public float getSignNum() {
		return this.signNum;
	}

	public void setSignNum(float signNum) {
		this.signNum = signNum;
	}

	@Column(name = "contractPrice")
	public float getContractPrice() {
		return this.contractPrice;
	}

	public void setContractPrice(float contractPrice) {
		this.contractPrice = contractPrice;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "createDate")
	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

}