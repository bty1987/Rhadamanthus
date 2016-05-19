package com.fanglin.salary.vo;


public class WorkerSalaryVO implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 822467532841192640L;

	private Integer wsId;
	
	private Integer pwsId;
	
	private String userId;
	
	private String userName;
	
	private Integer workTypeId;
	
	private String workType;
	
	private String createTime;
	
	private String endTime;
	
	private Float base;
	
	private Float deduct;
	
	private Integer status;

	public Integer getWsId(){
		return this.wsId;
	}

	public void setWsId(Integer wsId){
		this.wsId = wsId;
	}

	public String getUserId(){
		return this.userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	public String getUserName(){
		return this.userName;
	}

	public void setUserName(String userName){
		this.userName = userName;
	}

	public String getCreateTime(){
		return this.createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	public String getEndTime(){
		return this.endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	public Float getBase(){
		return this.base;
	}

	public void setBase(Float base){
		this.base = base;
	}

	public Float getDeduct(){
		return this.deduct;
	}

	public void setDeduct(Float deduct){
		this.deduct = deduct;
	}

	public Integer getStatus(){
		return this.status;
	}

	public void setStatus(Integer status){
		this.status = status;
	}

	public String getWorkType(){
		return workType;
	}

	public void setWorkType(String workType){
		this.workType = workType;
	}

	public Integer getPwsId(){
		return pwsId;
	}

	public void setPwsId(Integer pwsId){
		this.pwsId = pwsId;
	}

	public Integer getWorkTypeId(){
		return workTypeId;
	}

	public void setWorkTypeId(Integer workTypeId){
		this.workTypeId = workTypeId;
	}

}