/**
 * @File Name		: ReworkVo.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;

public class ReworkVO implements Serializable{

	private static final long serialVersionUID = -5360738026496521235L;
	
	private Integer rwId;
	
	private String orderId;
	
	private String createrId;
	
	private String createrName;
	
	private String createTime;
	
	private String reworkDes;

	public Integer getRwId(){
		return rwId;
	}

	public void setRwId(Integer rwId){
		this.rwId = rwId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getCreateTime(){
		return createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	public String getReworkDes(){
		return reworkDes;
	}

	public void setReworkDes(String reworkDes){
		this.reworkDes = reworkDes;
	}

	public String getCreaterId(){
		return createrId;
	}

	public void setCreaterId(String createrId){
		this.createrId = createrId;
	}

	public String getCreaterName(){
		return createrName;
	}

	public void setCreaterName(String createrName){
		this.createrName = createrName;
	}
	
}
