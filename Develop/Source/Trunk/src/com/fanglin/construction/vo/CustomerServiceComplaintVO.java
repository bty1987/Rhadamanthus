/**
 * @File Name		: CusotmerServiceComplaIntegerVO.java
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

public class CustomerServiceComplaintVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -28421212134426045L;
	
	private Integer cscId;
	
	private String orderId;
	
	private String customerName;
	
	private String createrId;
	
	private String createrName;
	
	private String operaterId;
	
	private String operaterName;

	private Integer complaintType;
	
	private Integer complaintLevel;
	
	private String complaintTime;
	
	private Integer complaintStatus;
	
	private String complaintHandle;
	
	private String complaintHandleTime;
	
	private String complaintDes;

	public Integer getCscId(){
		return cscId;
	}

	public void setCscId(Integer cscId){
		this.cscId = cscId;
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

	public String getCreaterId(){
		return createrId;
	}

	public void setCreaterId(String createrId){
		this.createrId = createrId;
	}

	public String getCreaterName(){
		return createrName;
	}

	public void setCreaterName(String createrName){
		this.createrName = createrName;
	}

	public Integer getComplaintType(){
		return complaintType;
	}

	public void setComplaintType(Integer complaintType){
		this.complaintType = complaintType;
	}

	public Integer getComplaintLevel(){
		return complaintLevel;
	}

	public void setComplaintLevel(Integer complaintLevel){
		this.complaintLevel = complaintLevel;
	}

	public String getComplaintTime(){
		return complaintTime;
	}

	public void setComplaintTime(String complaintTime){
		this.complaintTime = complaintTime;
	}

	public Integer getComplaintStatus(){
		return complaintStatus;
	}

	public void setComplaintStatus(Integer complaintStatus){
		this.complaintStatus = complaintStatus;
	}

	public String getComplaintHandle(){
		return complaintHandle;
	}

	public void setComplaintHandle(String complaintHandle){
		this.complaintHandle = complaintHandle;
	}

	public String getComplaintHandleTime(){
		return complaintHandleTime;
	}

	public void setComplaintHandleTime(String complaintHandleTime){
		this.complaintHandleTime = complaintHandleTime;
	}

	public String getComplaintDes(){
		return complaintDes;
	}

	public void setComplaintDes(String complaintDes){
		this.complaintDes = complaintDes;
	}

}
