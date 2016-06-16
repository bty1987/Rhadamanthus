package com.fanglin.salary.vo;

public class WorkerBaseSalaryVO implements java.io.Serializable {

	private static final long serialVersionUID = -1125901718558854521L;

	private int wbsId;
	
	private int wsId;
	
	private int cswId;
	
	private String orderId;
	
	private String userId;
	
	private String userName;

	private Integer workTypeId;
	
	private String workType;
	
	private String createTime;
	
	private float base;
	
	private int status;

	public int getWbsId(){
		return this.wbsId;
	}

	public void setWbsId(int wbsId){
		this.wbsId = wbsId;
	}

	public int getWsId(){
		return this.wsId;
	}

	public void setWsId(int wsId){
		this.wsId = wsId;
	}

	public String getOrderId(){
		return this.orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
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

	public float getBase(){
		return this.base;
	}

	public void setBase(float base){
		this.base = base;
	}

	public int getStatus(){
		return this.status;
	}

	public void setStatus(int status){
		this.status = status;
	}

	public String getWorkType(){
		return workType;
	}

	public void setWorkType(String workType){
		this.workType = workType;
	}

	public Integer getWorkTypeId(){
		return workTypeId;
	}

	public void setWorkTypeId(Integer workTypeId){
		this.workTypeId = workTypeId;
	}
	
	public int getCswId(){
		return cswId;
	}

	public void setCswId(int cswId){
		this.cswId = cswId;
	}
}