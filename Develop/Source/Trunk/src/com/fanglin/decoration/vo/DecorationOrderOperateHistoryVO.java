package com.fanglin.decoration.vo;

public class DecorationOrderOperateHistoryVO implements java.io.Serializable {

	private static final long serialVersionUID = 3315950278291481859L;
	
	private Long doophId;
	
	private String orderId;
	
	private String operateTime;
	
	private String des;

	public Long getDoophId(){
		return this.doophId;
	}

	public void setDoophId(Long doophId){
		this.doophId = doophId;
	}

	public String getOrderId(){
		return this.orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getOperateTime(){
		return this.operateTime;
	}

	public void setOperateTime(String operateTime){
		this.operateTime = operateTime;
	}

	public String getDes(){
		return this.des;
	}

	public void setDes(String des){
		this.des = des;
	}

}