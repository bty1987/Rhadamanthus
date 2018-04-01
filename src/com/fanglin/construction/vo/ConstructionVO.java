/**
 * @File Name	: ConstructionVO.java
 * @Package   	: com.fanglin.vo.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserBaseVO;

public class ConstructionVO implements Serializable{

	private static final long serialVersionUID = -6183413787236101280L;
	
	private Long cid;
	
	private String orderId;
	
	private UserBaseVO supervisor;
	
	private String supervisorQualityName;
	
	private Integer schedule;
	
	public ConstructionVO() {
		super();
	}

	public ConstructionVO(UserBaseVO supervisor) {
		super();
		this.supervisor = supervisor;
	}
	
	public UserBaseVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserBaseVO supervisor) {
		this.supervisor = supervisor;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public Integer getSchedule(){
		return schedule;
	}

	public void setSchedule(Integer schedule){
		this.schedule = schedule;
	}

	public String getSupervisorQualityName(){
		return supervisorQualityName;
	}

	public void setSupervisorQualityName(String supervisorQualityName){
		this.supervisorQualityName = supervisorQualityName;
	}
	
}
