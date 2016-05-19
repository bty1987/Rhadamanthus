package com.fanglin.construction.vo;


public class GroundLevelingConstructionScheduleVO implements java.io.Serializable {

	private static final long serialVersionUID = 8626112203327291623L;

	private Integer glcsId;
	
	private Integer csId;
	
	private String orderId;
	
	private String workerId;
	
	private Float workerSalary;
	
	private String startTime;
	
	private Short startTimeFlag;
	
	private String endTime;
	
	private Short endTimeFlag;
	
	private Short workerRaty;
	
	private String workerRatyDes;
	
	private Short supervisorRaty;
	
	private String supervisorRatyDes;
	
	private Short qualityRaty;
	
	private String qualityRatyDes;

	public Integer getGlcsId(){
		return glcsId;
	}

	public void setGlcsId(Integer glcsId){
		this.glcsId = glcsId;
	}

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

	public Short getStartTimeFlag(){
		return startTimeFlag;
	}

	public void setStartTimeFlag(Short startTimeFlag){
		this.startTimeFlag = startTimeFlag;
	}

	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	public Short getEndTimeFlag(){
		return endTimeFlag;
	}

	public void setEndTimeFlag(Short endTimeFlag){
		this.endTimeFlag = endTimeFlag;
	}

	public Short getWorkerRaty(){
		return workerRaty;
	}

	public void setWorkerRaty(Short workerRaty){
		this.workerRaty = workerRaty;
	}

	public String getWorkerRatyDes(){
		return workerRatyDes;
	}

	public void setWorkerRatyDes(String workerRatyDes){
		this.workerRatyDes = workerRatyDes;
	}

	public Short getSupervisorRaty(){
		return supervisorRaty;
	}

	public void setSupervisorRaty(Short supervisorRaty){
		this.supervisorRaty = supervisorRaty;
	}

	public String getSupervisorRatyDes(){
		return supervisorRatyDes;
	}

	public void setSupervisorRatyDes(String supervisorRatyDes){
		this.supervisorRatyDes = supervisorRatyDes;
	}

	public Short getQualityRaty(){
		return qualityRaty;
	}

	public void setQualityRaty(Short qualityRaty){
		this.qualityRaty = qualityRaty;
	}

	public String getQualityRatyDes(){
		return qualityRatyDes;
	}

	public void setQualityRatyDes(String qualityRatyDes){
		this.qualityRatyDes = qualityRatyDes;
	}

}