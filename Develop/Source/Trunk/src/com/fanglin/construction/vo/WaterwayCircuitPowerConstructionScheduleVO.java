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
	
	private Integer waterwayWorkerRaty;
	
	private String waterwayWorkerRatyDes;
	
	private Integer circuitWorkerRaty;
	
	private String circuitWorkerRatyDes;
	
	private Integer powerWorkerRaty;
	
	private String powerWorkerRatyDes;
	
	private Integer supervisorRaty;
	
	private String supervisorRatyDes;
	
	private Integer qualityRaty;
	
	private String qualityRatyDes;

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

	public Integer getWaterwayWorkerRaty(){
		return waterwayWorkerRaty;
	}

	public void setWaterwayWorkerRaty(Integer waterwayWorkerRaty){
		this.waterwayWorkerRaty = waterwayWorkerRaty;
	}

	public String getWaterwayWorkerRatyDes(){
		return waterwayWorkerRatyDes;
	}

	public void setWaterwayWorkerRatyDes(String waterwayWorkerRatyDes){
		this.waterwayWorkerRatyDes = waterwayWorkerRatyDes;
	}

	public Integer getCircuitWorkerRaty(){
		return circuitWorkerRaty;
	}

	public void setCircuitWorkerRaty(Integer circuitWorkerRaty){
		this.circuitWorkerRaty = circuitWorkerRaty;
	}

	public String getCircuitWorkerRatyDes(){
		return circuitWorkerRatyDes;
	}

	public void setCircuitWorkerRatyDes(String circuitWorkerRatyDes){
		this.circuitWorkerRatyDes = circuitWorkerRatyDes;
	}

	public Integer getPowerWorkerRaty(){
		return powerWorkerRaty;
	}

	public void setPowerWorkerRaty(Integer powerWorkerRaty){
		this.powerWorkerRaty = powerWorkerRaty;
	}

	public String getPowerWorkerRatyDes(){
		return powerWorkerRatyDes;
	}

	public void setPowerWorkerRatyDes(String powerWorkerRatyDes){
		this.powerWorkerRatyDes = powerWorkerRatyDes;
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
