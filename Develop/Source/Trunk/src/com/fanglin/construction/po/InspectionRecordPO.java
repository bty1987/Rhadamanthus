/**
 * @File Name	: InspectionRecordPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="inspectionrecord", catalog = "construction")
public class InspectionRecordPO implements Serializable{

	private static final long serialVersionUID = 736199537491227456L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	private int irId;
	
	private String orderId;
	
	private String orderAddr;
	
	private String operaterId;
	
	private String operaterName;
	
	private Timestamp startTime;
	
	private Timestamp endTime;
	
	private String recordDes;

	@Id
	@Column(name="irId")
	public int getIrId(){
		return irId;
	}

	public void setIrId(int irId){
		this.irId = irId;
	}

	@Column(name="orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name="orderAddr")
	public String getOrderAddr(){
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	@Column(name="startTime")
	public Timestamp getStartTime(){
		return startTime;
	}

	public void setStartTime(Timestamp startTime){
		this.startTime = startTime;
	}

	@Column(name="endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	@Column(name="recordDes")
	public String getRecordDes(){
		return recordDes;
	}

	public void setRecordDes(String recordDes){
		this.recordDes = recordDes;
	}

	@Column(name = "operaterId")
	public String getOperaterId(){
		return operaterId;
	}

	public void setOperaterId(String operaterId){
		this.operaterId = operaterId;
	}

	@Column(name = "operaterName")
	public String getOperaterName(){
		return operaterName;
	}

	public void setOperaterName(String operaterName){
		this.operaterName = operaterName;
	}
	
}
