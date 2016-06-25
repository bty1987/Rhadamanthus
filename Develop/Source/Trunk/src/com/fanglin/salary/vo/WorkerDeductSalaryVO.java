package com.fanglin.salary.vo;



public class WorkerDeductSalaryVO implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7005634387087934683L;

	private Integer wdsId;
	
	private Integer wsId;
	
	private String orderId;
	
	private String userId;
	
	private String userName;
	
	private Integer workTypeId;
	
	private String workType;
	
	private String createTime;
	
	private Float deduct;
	
	private Integer deductType;
	
	private Integer status;
	
	private String des;

	public Integer getWdsId(){
		return this.wdsId;
	}

	public void setWdsId(Integer wdsId){
		this.wdsId = wdsId;
	}

	public Integer getWsId(){
		return this.wsId;
	}

	public void setWsId(Integer wsId){
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

	public Integer getWorkTypeId(){
		return workTypeId;
	}

	public void setWorkTypeId(Integer workTypeId){
		this.workTypeId = workTypeId;
	}

	public Integer getDeductType(){
		return deductType;
	}

	public void setDeductType(Integer deductType){
		this.deductType = deductType;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

}