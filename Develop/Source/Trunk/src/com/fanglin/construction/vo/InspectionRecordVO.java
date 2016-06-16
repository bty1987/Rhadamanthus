/**
 * @File Name		: InspectionRecordVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class InspectionRecordVO implements Serializable {

	private static final long serialVersionUID = 5205280061692505927L;
	
	private int irId;
	
	private String orderId;
	
	private String orderAddr;
	
	private String operaterId;
	
	private String operaterName;
	
	private Timestamp startTime;
	
	private Timestamp endTime;
	
	private String recordDes;

	public int getIrId(){
		return irId;
	}

	public void setIrId(int irId){
		this.irId = irId;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getStartTime(){
		return startTime;
	}

	public void setStartTime(Timestamp startTime){
		this.startTime = startTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public String getRecordDes(){
		return recordDes;
	}

	public void setRecordDes(String recordDes){
		this.recordDes = recordDes;
	}

	public String getOperaterId(){
		return operaterId;
	}

	public void setOperaterId(String operaterId){
		this.operaterId = operaterId;
	}

	public String getOperaterName(){
		return operaterName;
	}

	public void setOperaterName(String operaterName){
		this.operaterName = operaterName;
	}
	
}
