/**
 * @File Name		: BricklayConstructionScheduleVO.java
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

public class BricklayConstructionScheduleVO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -2149301658564942676L;
	
	private Integer bcsId;
	
	private Integer csId;
	
	private String orderId;
	
	private String workerId;
	
	private Float workerSalary;
	
	private String startTime;
	
	private Integer startTimeFlag;
	
	private String endTime;
	
	private Integer endTimeFlag;
	
	private Integer workerRaty;
	
	private String workerRatyDes;
	
	private Integer supervisorRaty;
	
	private String supervisorRatyDes;
	
	private Integer qualityRaty;
	
	private String qualityRatyDes;

	public Integer getBcsId(){
		return bcsId;
	}

	public void setBcsId(Integer bcsId){
		this.bcsId = bcsId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getWorkerId(){
		return workerId;
	}

	public void setWorkerId(String workerId){
		this.workerId = workerId;
	}

	public Float getWorkerSalary(){
		return workerSalary;
	}

	public void setWorkerSalary(Float workerSalary){
		this.workerSalary = workerSalary;
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

	public Integer getWorkerRaty(){
		return workerRaty;
	}

	public void setWorkerRaty(Integer workerRaty){
		this.workerRaty = workerRaty;
	}

	public String getWorkerRatyDes(){
		return workerRatyDes;
	}

	public void setWorkerRatyDes(String workerRatyDes){
		this.workerRatyDes = workerRatyDes;
	}

	public Integer getSupervisorRaty(){
		return supervisorRaty;
	}

	public void setSupervisorRaty(Integer supervisorRaty){
		this.supervisorRaty = supervisorRaty;
	}

	public String getSupervisorRatyDes(){
		return supervisorRatyDes;
	}

	public void setSupervisorRatyDes(String supervisorRatyDes){
		this.supervisorRatyDes = supervisorRatyDes;
	}

	public Integer getQualityRaty(){
		return qualityRaty;
	}

	public void setQualityRaty(Integer qualityRaty){
		this.qualityRaty = qualityRaty;
	}

	public String getQualityRatyDes(){
		return qualityRatyDes;
	}

	public void setQualityRatyDes(String qualityRatyDes){
		this.qualityRatyDes = qualityRatyDes;
	}

	public Integer getCsId(){
		return csId;
	}

	public void setCsId(Integer csId){
		this.csId = csId;
	}
	
}
