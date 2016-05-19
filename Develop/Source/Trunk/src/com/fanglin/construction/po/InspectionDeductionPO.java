/**
 * @File Name		: InspectionDeductionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
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
@Table(name="inspectiondeduction", catalog = "platform")
public class InspectionDeductionPO implements Serializable{

	private static final long serialVersionUID = 933595476588801026L;
	
	public static String COLUMN_ORDERID_STR = "orderId";
	
	private int idId;
	
	private String orderId;
	
	private String orderAddr;
	
	private float deductionMoney;
	
	private Timestamp deductionTime;
	
	private String deductionDes;
	
	@Id
	@Column(name="idId")
	public int getIdId(){
		return idId;
	}

	public void setIdId(int idId){
		this.idId = idId;
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

	@Column(name="deductionMoney")
	public float getDeductionMoney(){
		return deductionMoney;
	}

	public void setDeductionMoney(float deductionMoney){
		this.deductionMoney = deductionMoney;
	}

	@Column(name="deductionTime")
	public Timestamp getDeductionTime(){
		return deductionTime;
	}

	public void setDeductionTime(Timestamp deductionTime){
		this.deductionTime = deductionTime;
	}

	@Column(name="deductionDes")
	public String getDeductionDes(){
		return deductionDes;
	}

	public void setDeductionDes(String deductionDes){
		this.deductionDes = deductionDes;
	}
	
}
