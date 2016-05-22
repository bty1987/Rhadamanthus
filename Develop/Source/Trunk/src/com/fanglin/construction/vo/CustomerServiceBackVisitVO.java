/**
 * @File Name		: CustomerServiceBackVisitVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;

public class CustomerServiceBackVisitVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5152110275519942956L;
	
	private int csbvId;
	
	private String orderId;
	
	private String orderAddr;
	
	private String customerName;
	
	private String backVisitTime;
	
	private int backVisitType;
	
	private String backVisitDes;

	public int getCsbvId(){
		return csbvId;
	}

	public void setCsbvId(int csbvId){
		this.csbvId = csbvId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getOrderAddr(){
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	public String getBackVisitTime(){
		return backVisitTime;
	}

	public void setBackVisitTime(String backVisitTime){
		this.backVisitTime = backVisitTime;
	}

	public String getBackVisitDes(){
		return backVisitDes;
	}

	public void setBackVisitDes(String backVisitDes){
		this.backVisitDes = backVisitDes;
	}

	public int getBackVisitType(){
		return backVisitType;
	}

	public void setBackVisitType(int backVisitType){
		this.backVisitType = backVisitType;
	}
	
}
