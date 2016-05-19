package com.fanglin.material.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class MaterialSubOrderPreBalanceVO implements java.io.Serializable {

	private static final long serialVersionUID = -1473569273789126606L;

	private Integer msoprbId;
	
	private Long msoId;
	
	private String msoNo;
	
	private String userId;
	
	private String userName;
	
	private Timestamp createTime;
	
	private Float preBalance;
	
	private Short status;

	public Integer getMsoprbId(){
		return msoprbId;
	}

	public void setMsoprbId(Integer msoprbId){
		this.msoprbId = msoprbId;
	}

	public Long getMsoId(){
		return msoId;
	}

	public void setMsoId(Long msoId){
		this.msoId = msoId;
	}

	public String getMsoNo(){
		return msoNo;
	}

	public void setMsoNo(String msoNo){
		this.msoNo = msoNo;
	}

	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	public String getUserName(){
		return userName;
	}

	public void setUserName(String userName){
		this.userName = userName;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public Float getPreBalance(){
		return preBalance;
	}

	public void setPreBalance(Float preBalance){
		this.preBalance = preBalance;
	}

	public Short getStatus(){
		return status;
	}

	public void setStatus(Short status){
		this.status = status;
	}

}