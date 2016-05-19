package com.fanglin.salary.vo;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "venderbalance")
public class VenderBalanceVO implements java.io.Serializable {

	private static final long serialVersionUID = 5167404708465435769L;

	private Integer vbId;
	
	private Integer materialBrandId;
	
	private String materialBrandName;
	
	private String createTime;
	
	private String endTime;
	
	private Float balance;
	
	private Integer status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vbId")
	public Integer getVbId() {
		return this.vbId;
	}

	public void setVbId(Integer vbId) {
		this.vbId = vbId;
	}

	@Column(name = "materialBrandId")
	public Integer getMaterialBrandId() {
		return this.materialBrandId;
	}

	public void setMaterialBrandId(Integer materialBrandId) {
		this.materialBrandId = materialBrandId;
	}

	@Column(name = "materialBrandName")
	public String getMaterialBrandName() {
		return this.materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName) {
		this.materialBrandName = materialBrandName;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "endTime")
	public String getEndTime() {
		return this.endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	@Column(name = "balance")
	public Float getBalance() {
		return this.balance;
	}

	public void setBalance(Float balance) {
		this.balance = balance;
	}

	@Column(name = "status")
	public Integer getStatus() {
		return this.status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

}