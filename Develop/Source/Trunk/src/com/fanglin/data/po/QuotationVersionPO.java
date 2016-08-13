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
@Table(name="quotationVersion", catalog = "platform")
public class QuotationVersionPO implements Serializable{

	private static final long serialVersionUID = -852822561077114137L;
	
	private int qvId;
	
	private String versionId;
	
	private String versionName;
	
	private String versionDes;
	
	private int defaultFlag;
	
	private float trafficRate;
	
	private float manageRate;
	
	public QuotationVersionPO(){}
	
	public QuotationVersionPO(String versionId){
		this.versionId = versionId;
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
	@Column(name="versionId", nullable=false)
	public String getVersionId(){
		return versionId;
	}

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	@Column(name="versionName", nullable=false)
	public String getVersionName(){
		return versionName;
	}

	public void setVersionName(String versionName){
		this.versionName = versionName;
	}

	@Column(name="versionDes")
	public String getVersionDes(){
		return versionDes;
	}

	public void setVersionDes(String versionDes){
		this.versionDes = versionDes;
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

	@Column(name="manageRate")
	public float getManageRate() {
		return manageRate;
	}

	public void setManageRate(float manageRate) {
		this.manageRate = manageRate;
	}
	
}
