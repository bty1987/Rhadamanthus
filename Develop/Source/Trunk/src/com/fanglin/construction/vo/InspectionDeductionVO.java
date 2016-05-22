/**
 * @File Name		: InspectionDeductionVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class InspectionDeductionVO implements Serializable {

	private static final long serialVersionUID = 2762456827187851607L;
	
	private int idId;
	
	private String orderId;
	
	private String orderAddr;
	
	private float deductionMoney;
	
	private Timestamp deductionTime;
	
	private String deductionDes;

	public int getIdId(){
		return idId;
	}

	public void setIdId(int idId){
		this.idId = idId;
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

	public float getDeductionMoney(){
		return deductionMoney;
	}

	public void setDeductionMoney(float deductionMoney){
		this.deductionMoney = deductionMoney;
	}

	public Timestamp getDeductionTime(){
		return deductionTime;
	}

	public void setDeductionTime(Timestamp deductionTime){
		this.deductionTime = deductionTime;
	}

	public String getDeductionDes(){
		return deductionDes;
	}

	public void setDeductionDes(String deductionDes){
		this.deductionDes = deductionDes;
	}
	
}
