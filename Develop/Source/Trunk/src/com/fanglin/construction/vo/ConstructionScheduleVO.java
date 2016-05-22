/**
 * @File Name		: ConstructionScheduleVO.java
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

public class ConstructionScheduleVO implements Serializable{

	private static final long serialVersionUID = -6183413787236101280L;
	
	private Integer csId;
	
	private String orderId;
	
	private String supervisorQualityId;
	
	private String supervisorQualityName;
	
	private String chanQualityId;
	
	private String chanQualityName;
	
	private String putlineQualityId;
	
	private String putlineQualityName;
	
	private String waterwayCircuitPowerQualityId;
	
	private String waterwayCircuitPowerQualityName;
	
	private String powerQualityId;
	
	private String powerQualityName;
	
	private String bricklayQualityId;
	
	private String bricklayQualityName;
	
	private String carpentQualityId;
	
	private String carpentQualityName;
	
	private String oilQualityId;
	
	private String oilQualityName;
	
	private String cleaningQualityId;
	
	private String cleaningQualityName;
	
	private Integer schedule;

	public Integer getCsId(){
		return csId;
	}

	public void setCsId(Integer csId){
		this.csId = csId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getSupervisorQualityId(){
		return supervisorQualityId;
	}

	public void setSupervisorQualityId(String supervisorQualityId){
		this.supervisorQualityId = supervisorQualityId;
	}

	public String getPowerQualityId(){
		return powerQualityId;
	}

	public void setPowerQualityId(String powerQualityId){
		this.powerQualityId = powerQualityId;
	}

	public String getBricklayQualityId(){
		return bricklayQualityId;
	}

	public void setBricklayQualityId(String bricklayQualityId){
		this.bricklayQualityId = bricklayQualityId;
	}

	public String getCarpentQualityId(){
		return carpentQualityId;
	}

	public void setCarpentQualityId(String carpentQualityId){
		this.carpentQualityId = carpentQualityId;
	}

	public Integer getSchedule(){
		return schedule;
	}

	public void setSchedule(Integer schedule){
		this.schedule = schedule;
	}

	public String getOilQualityId(){
		return oilQualityId;
	}

	public void setOilQualityId(String oilQualityId){
		this.oilQualityId = oilQualityId;
	}

	public String getSupervisorQualityName(){
		return supervisorQualityName;
	}

	public void setSupervisorQualityName(String supervisorQualityName){
		this.supervisorQualityName = supervisorQualityName;
	}

	public String getBricklayQualityName(){
		return bricklayQualityName;
	}

	public void setBricklayQualityName(String bricklayQualityName){
		this.bricklayQualityName = bricklayQualityName;
	}

	public String getCarpentQualityName(){
		return carpentQualityName;
	}

	public void setCarpentQualityName(String carpentQualityName){
		this.carpentQualityName = carpentQualityName;
	}

	public String getOilQualityName(){
		return oilQualityName;
	}

	public void setOilQualityName(String oilQualityName){
		this.oilQualityName = oilQualityName;
	}

	public String getChanQualityId(){
		return chanQualityId;
	}

	public void setChanQualityId(String chanQualityId){
		this.chanQualityId = chanQualityId;
	}

	public String getChanQualityName(){
		return chanQualityName;
	}

	public void setChanQualityName(String chanQualityName){
		this.chanQualityName = chanQualityName;
	}

	public String getPutlineQualityId(){
		return putlineQualityId;
	}

	public void setPutlineQualityId(String putlineQualityId){
		this.putlineQualityId = putlineQualityId;
	}

	public String getPutlineQualityName(){
		return putlineQualityName;
	}

	public void setPutlineQualityName(String putlineQualityName){
		this.putlineQualityName = putlineQualityName;
	}

	public String getPowerQualityName(){
		return powerQualityName;
	}

	public void setPowerQualityName(String powerQualityName){
		this.powerQualityName = powerQualityName;
	}

	public String getCleaningQualityId(){
		return cleaningQualityId;
	}

	public void setCleaningQualityId(String cleaningQualityId){
		this.cleaningQualityId = cleaningQualityId;
	}

	public String getCleaningQualityName(){
		return cleaningQualityName;
	}

	public void setCleaningQualityName(String cleaningQualityName){
		this.cleaningQualityName = cleaningQualityName;
	}

	public String getWaterwayCircuitPowerQualityId(){
		return waterwayCircuitPowerQualityId;
	}

	public void setWaterwayCircuitPowerQualityId(
			String waterwayCircuitPowerQualityId){
		this.waterwayCircuitPowerQualityId = waterwayCircuitPowerQualityId;
	}

	public String getWaterwayCircuitPowerQualityName(){
		return waterwayCircuitPowerQualityName;
	}

	public void setWaterwayCircuitPowerQualityName(
			String waterwayCircuitPowerQualityName){
		this.waterwayCircuitPowerQualityName = waterwayCircuitPowerQualityName;
	}
	
}
