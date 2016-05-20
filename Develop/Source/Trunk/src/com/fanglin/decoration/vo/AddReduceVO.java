/**
 * @File Name		: AddReduceVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.google.gson.annotations.SerializedName;


public class AddReduceVO implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 7416960652933057166L;
	
	@SerializedName("增减项编号")
	private int arId;
	
	@SerializedName("订单编号")
	private String OrderId;
	
	@SerializedName("类别")
	private int addReduceType;
	
	@SerializedName("总额")
	private Float addReduceTotal;
	
	@SerializedName("状态")
	private int addReduceStatus;
	
	@SerializedName("增减项编号")
	private Timestamp createTime;
	
	@SerializedName("增减项描述")
	private String addReduceDes;
	
	@SerializedName("收款编号")
	private Long orderPaymentId;

	public int getArId(){
		return arId;
	}

	public void setArId(int arId){
		this.arId = arId;
	}
	
	public String getOrderId(){
		return OrderId;
	}

	public void setOrderId(String orderId){
		OrderId = orderId;
	}

	public int getAddReduceType(){
		return addReduceType;
	}

	public void setAddReduceType(int addReduceType){
		this.addReduceType = addReduceType;
	}

	public Float getAddReduceTotal(){
		return addReduceTotal;
	}

	public void setAddReduceTotal(Float addReduceTotal){
		this.addReduceTotal = addReduceTotal;
	}

	public int getAddReduceStatus(){
		return addReduceStatus;
	}

	public void setAddReduceStatus(int addReduceStatus){
		this.addReduceStatus = addReduceStatus;
	}
	
	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public String getAddReduceDes(){
		return addReduceDes;
	}

	public void setAddReduceDes(String addReduceDes){
		this.addReduceDes = addReduceDes;
	}

	public void setOrderPaymentId(Long orderPaymentId){
		this.orderPaymentId = orderPaymentId;
	}

	public Long getOrderPaymentId(){
		return orderPaymentId;
	}

}
