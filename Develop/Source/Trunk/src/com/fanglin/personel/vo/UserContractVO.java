/**
 * Title: UserContractVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.personel.vo;

import java.io.Serializable;

public class UserContractVO implements Serializable {

	private static final long serialVersionUID = 8111974803190366547L;
	
	private int ucId;

	private String contractId;
	
	private String userId;
	
	private String startTime;
	
	private String endTime;
	
	private String createTime;
	
	private String des;
	
	private String flag;

	public int getUcId() {
		return ucId;
	}

	public void setUcId(int ucId) {
		this.ucId = ucId;
	}

	public String getContractId(){
		return contractId;
	}

	public void setContractId(String contractId){
		this.contractId = contractId;
	}

	public UserContractVO(){
		super();
	}

	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	public String getStartTime(){
		return startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

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

	public String getFlag(){
		return flag;
	}

	public void setFlag(String flag){
		this.flag = flag;
	}

}
