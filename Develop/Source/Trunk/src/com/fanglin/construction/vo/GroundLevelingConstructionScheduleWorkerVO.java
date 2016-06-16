package com.fanglin.construction.vo;

public class GroundLevelingConstructionScheduleWorkerVO implements java.io.Serializable {

	private static final long serialVersionUID = 973812717221715019L;

	private Integer glcswId;
	
	private Integer glcsId;
	
	private Integer csId;
	
	private String orderId;
	
	private String workerId;
	
	private String workerName;
	
	private Float workerSalary;
	
	private Short workerRaty;
	
	private String workerRatyDes;
	
	private String workerPhone;
	
	private String workerPhoto;
	
	private String workerOldId;
	
	private String workerDuty;

	public Integer getGlcswId(){
		return glcswId;
	}

	public void setGlcswId(Integer glcswId){
		this.glcswId = glcswId;
	}

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

	public String getWorkerName(){
		return workerName;
	}

	public void setWorkerName(String workerName){
		this.workerName = workerName;
	}

	public Float getWorkerSalary(){
		return workerSalary;
	}

	public void setWorkerSalary(Float workerSalary){
		this.workerSalary = workerSalary;
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

	public String getWorkerPhone() {
		return workerPhone;
	}

	public void setWorkerPhone(String workerPhone) {
		this.workerPhone = workerPhone;
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