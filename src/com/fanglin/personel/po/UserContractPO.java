/**
 * Title: UserContractPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "userContract", catalog = "communion")
public class UserContractPO implements Serializable {

	private static final long serialVersionUID = 8111974803190366547L;
	
	private int ucId;

	private String contractId;
	
	private String userId;
	
	private String startTime;
	
	private String endTime;
	
	private String createTime;
	
	private String des;
	
	public UserContractPO(){
		super();
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ucId") 
	public int getUcId() {
		return ucId;
	}

	public void setUcId(int ucId) {
		this.ucId = ucId;
	}

	@Column(nullable = false)
	public String getContractId(){
		return contractId;
	}

	public void setContractId(String contractId){
		this.contractId = contractId;
	}

	@Column(nullable = false)
	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	@Column(nullable = false)
	public String getStartTime(){
		return startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	@Column(nullable = false)
	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	@Column(nullable = false)
	public String getCreateTime(){
		return createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}
	
}
