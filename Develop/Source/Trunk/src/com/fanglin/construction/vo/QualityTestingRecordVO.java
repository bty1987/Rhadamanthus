package com.fanglin.construction.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class QualityTestingRecordVO implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3208648459548110416L;

	private Integer qtrId;
	
	private String orderId;
	
	private String orderAddr;
	
	private String operaterId;
	
	private String operaterName;
	
	private Timestamp recordTime;
	
	private String recordDes;
	
	public Integer getQtrId(){
		return this.qtrId;
	}

	public void setQtrId(Integer qtrId){
		this.qtrId = qtrId;
	}

	public String getOrderId(){
		return this.orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getOrderAddr(){
		return this.orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	public String getOperaterId(){
		return this.operaterId;
	}

	public void setOperaterId(String operaterId){
		this.operaterId = operaterId;
	}

	public String getOperaterName(){
		return this.operaterName;
	}

	public void setOperaterName(String operaterName){
		this.operaterName = operaterName;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getRecordTime(){
		return this.recordTime;
	}

	public void setRecordTime(Timestamp recordTime){
		this.recordTime = recordTime;
	}

	public String getRecordDes(){
		return this.recordDes;
	}

	public void setRecordDes(String recordDes){
		this.recordDes = recordDes;
	}

}