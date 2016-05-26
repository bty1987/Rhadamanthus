/**
 * @File Name		: CustomerServiceBackVisitPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="customerservicebackvisit", catalog = "platform")
public class CustomerServiceBackVisitPO implements Serializable{

	private static final long serialVersionUID = -2601423017170518859L;
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	private int csbvId;
	
	private String orderId;
	
	private String orderAddr;
	
	private String customerName;
	
	private String backVisitTime;
	
	private int backVisitType;
	
	private String backVisitDes;

	@Id
	@Column(name="csbvId")
	public int getCsbvId(){
		return csbvId;
	}

	public void setCsbvId(int csbvId){
		this.csbvId = csbvId;
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

	@Column(name="customerName")
	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	@Column(name="backVisitTime")
	public String getBackVisitTime(){
		return backVisitTime;
	}

	public void setBackVisitTime(String backVisitTime){
		this.backVisitTime = backVisitTime;
	}

	@Column(name="backVisitDes")
	public String getBackVisitDes(){
		return backVisitDes;
	}

	public void setBackVisitDes(String backVisitDes){
		this.backVisitDes = backVisitDes;
	}

	@Column(name = "backVisitType")
	public int getBackVisitType(){
		return backVisitType;
	}

	public void setBackVisitType(int backVisitType){
		this.backVisitType = backVisitType;
	}
	
}
