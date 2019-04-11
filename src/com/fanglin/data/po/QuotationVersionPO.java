/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="quotationVersion", catalog = "quotation")
public class QuotationVersionPO implements Serializable{

	private static final long serialVersionUID = -852822561077114137L;
	
	private int qvId;
	
	private String no;
	
	private String name;
	
	private String comment;
	
	private int defaultFlag;
	
	private float trafficRate;
	
	private short trafficDiscount;
	
	private float manageRate;
	
	private short manageDiscount;
	
	private int company;
	
	public QuotationVersionPO(){}
	
	public QuotationVersionPO(String no){
		this.no = no;
	}

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "qvId") 
	public int getQvId() {
		return qvId;
	}

	public void setQvId(int qvId) {
		this.qvId = qvId;
	}
	
	@Id
	@Column(name="no", nullable=false)
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}
	
	@Column(name="name", nullable=false)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name="defaultFlag", nullable=false)
	public int getDefaultFlag(){
		return defaultFlag;
	}

	public void setDefaultFlag(int defaultFlag){
		this.defaultFlag = defaultFlag;
	}

	@Column(name="trafficRate")
	public float getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(float trafficRate) {
		this.trafficRate = trafficRate;
	}
	
	@Column(name="trafficDiscount")
	public short getTrafficDiscount() {
		return trafficDiscount;
	}

	public void setTrafficDiscount(short trafficDiscount) {
		this.trafficDiscount = trafficDiscount;
	}

	@Column(name="manageRate")
	public float getManageRate() {
		return manageRate;
	}

	public void setManageRate(float manageRate) {
		this.manageRate = manageRate;
	}

	@Column(name="manageDiscount")
	public short getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(short manageDiscount) {
		this.manageDiscount = manageDiscount;
	}
	
	@Column(name="company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	
	
	
}
