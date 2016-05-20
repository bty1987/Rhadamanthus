/**
 * @File Name		: CustomerServiceGuaranteePO.java
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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="customerserviceguarantee", catalog = "platform")
public class CustomerServiceGuaranteePO implements Serializable{

	private static final long serialVersionUID = -6147848721739253445L;
	
	public static String COLUMN_ORDERID_STR = "orderId";
	
	private int csgId;
	
	private String orderId;
	
	private String customerName;
	
	private String guaranteeTime;
	
	private String guaranteeDes;

	@Id
	@Column(name="csgId")
	public int getCsgId(){
		return csgId;
	}

	public void setCsgId(int csgId){
		this.csgId = csgId;
	}

	@Column(name="orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name="customerName")
	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	@Column(name="guaranteeTime")
	public String getGuaranteeTime(){
		return guaranteeTime;
	}

	public void setGuaranteeTime(String guaranteeTime){
		this.guaranteeTime = guaranteeTime;
	}

	@Column(name="guaranteeDes")
	public String getGuaranteeDes(){
		return guaranteeDes;
	}

	public void setGuaranteeDes(String guaranteeDes){
		this.guaranteeDes = guaranteeDes;
	}
	
}
