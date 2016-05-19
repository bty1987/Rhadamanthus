package com.fanglin.construction.vo;

public class CarpentConstructionScheduleWorkerVO implements java.io.Serializable {

	private static final long serialVersionUID = 5914776143023458603L;

	private Integer ccswId;
	
	private Integer ccsId;
	
	private Integer csId;
	
	private String orderId;
	
	private String workerId;
	
	private String workerName;
	
	private Float workerSalary;
	
	private Integer workerRaty;
	
	private String workerRatyDes;
	
	private String workerPhoto;
	
	private String workerOldId;
	
	private String workerDuty;

	public Integer getCcswId(){
		return this.ccswId;
	}

	public void setCcswId(Integer ccswId){
		this.ccswId = ccswId;
	}

	public Integer getCcsId(){
		return this.ccsId;
	}

	public void setCcsId(Integer ccsId){
		this.ccsId = ccsId;
	}

	public String getWorkerId(){
		return this.workerId;
	}

	public void setWorkerId(String workerId){
		this.workerId = workerId;
	}

	public Float getWorkerSalary(){
		return this.workerSalary;
	}

	public void setWorkerSalary(Float workerSalary){
		this.workerSalary = workerSalary;
	}

	public Integer getWorkerRaty(){
		return this.workerRaty;
	}

	public void setWorkerRaty(Integer workerRaty){
		this.workerRaty = workerRaty;
	}

	public String getWorkerRatyDes(){
		return this.workerRatyDes;
	}

	public void setWorkerRatyDes(String workerRatyDes){
		this.workerRatyDes = workerRatyDes;
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

	public String getWorkerName(){
		return workerName;
	}

	public void setWorkerName(String workerName){
		this.workerName = workerName;
	}

	public String getWorkerPhoto(){
		return workerPhoto;
	}

	public void setWorkerPhoto(String workerPhoto){
		this.workerPhoto = workerPhoto;
	}

	public String getWorkerOldId() {
		return workerOldId;
	}

	public void setWorkerOldId(String workerOldId) {
		this.workerOldId = workerOldId;
	}

	public String getWorkerDuty() {
		return workerDuty;
	}

	public void setWorkerDuty(String workerDuty) {
		this.workerDuty = workerDuty;
	}

}