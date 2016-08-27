/**
 * @File Name		: WaterwayCircuitPowerConstructionScheduleVO.java
 * @Package   	: com.fanglin.vo.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;

public class WaterwayCircuitPowerConstructionScheduleVO implements Serializable {

	private static final long serialVersionUID = -3939084573843257176L;
	
	private Integer wcpcsId;
	
	private Integer csId;
	
	private String orderId;
	
	private String startTime;
	
	private Integer startTimeFlag;
	
	private String endTime;
	
	private Integer endTimeFlag;
	
	public Integer getWcpcsId(){
		return wcpcsId;
	}

	public void setWcpcsId(Integer wcpcsId){
		this.wcpcsId = wcpcsId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getStartTime(){
		return startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	public Integer getStartTimeFlag(){
		return startTimeFlag;
	}

	public void setStartTimeFlag(Integer startTimeFlag){
		this.startTimeFlag = startTimeFlag;
	}

	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	public Integer getEndTimeFlag(){
		return endTimeFlag;
	}

	public void setEndTimeFlag(Integer endTimeFlag){
		this.endTimeFlag = endTimeFlag;
	}

	public Integer getCsId(){
		return csId;
	}

	public void setCsId(Integer csId){
		this.csId = csId;
	}

}
