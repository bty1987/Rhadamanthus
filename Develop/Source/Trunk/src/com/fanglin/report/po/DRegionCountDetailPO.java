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
@Table(name = "dregioncountdetail", catalog = "report")
public class DRegionCountDetailPO implements java.io.Serializable {

	private static final long serialVersionUID = -7346601311002659577L;

	private long drcdId;
	
	private int ddId;
	
	private int sdId;
	
	private float createNum;
	
	private float signNum;
	
	private float contractPrice;
	
	private Date createDate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "drcdId")
	public long getDrcdId() {
		return this.drcdId;
	}

	public void setDrcdId(long drcdId) {
		this.drcdId = drcdId;
	}

	@Column(name = "ddId")
	public int getDdId() {
		return this.ddId;
	}

	public void setDdId(int ddId) {
		this.ddId = ddId;
	}

	@Column(name = "sdId")
	public int getSdId() {
		return this.sdId;
	}

	public void setSdId(int sdId) {
		this.sdId = sdId;
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