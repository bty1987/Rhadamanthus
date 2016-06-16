package com.fanglin.material.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class MaterialSubOrderPostBalanceVO implements java.io.Serializable {

	private static final long serialVersionUID = -3184833313105595050L;

	private Integer msopobId;
	
	private Long msoId;
	
	private String msoNo;
	
	private String userId;
	
	private String userName;
	
	private Timestamp createTime;
	
	private Float postBalance;
	
	private Short status;

	public Integer getMsopobId(){
		return msopobId;
	}

	public void setMsopobId(Integer msopobId){
		this.msopobId = msopobId;
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

	public Float getPostBalance(){
		return postBalance;
	}

	public void setPostBalance(Float postBalance){
		this.postBalance = postBalance;
	}

	public Short getStatus(){
		return status;
	}

	public void setStatus(Short status){
		this.status = status;
	}

}