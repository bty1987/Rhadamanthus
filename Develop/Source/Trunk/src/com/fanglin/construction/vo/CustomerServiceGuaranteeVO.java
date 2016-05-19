/**
 * @File Name		: CustomerServiceGuaranteeVO.java
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

public class CustomerServiceGuaranteeVO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8026794284060513279L;
	
	private int csgId;
	
	private String orderId;
	
	private String customerName;
	
	private String guaranteeTime;
	
	private String guaranteeDes;

	public int getCsgId(){
		return csgId;
	}

	public void setCsgId(int csgId){
		this.csgId = csgId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	public String getGuaranteeTime(){
		return guaranteeTime;
	}

	public void setGuaranteeTime(String guaranteeTime){
		this.guaranteeTime = guaranteeTime;
	}

	public String getGuaranteeDes(){
		return guaranteeDes;
	}

	public void setGuaranteeDes(String guaranteeDes){
		this.guaranteeDes = guaranteeDes;
	}
	
}
