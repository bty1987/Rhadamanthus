/**
 * @File Name		: CustomerServiceComplaint.java
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
@Table(name="customerservicecomplaint", catalog = "platform")
public class CustomerServiceComplaintPO implements Serializable{

	private static final long serialVersionUID = 1570889773414503470L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final int COMPLAINT_STATUS_TYPE_INIT_INT = 0;
	
	public static final int COMPLAINT_STATUS_TYPE_HANDLE_INT = 1;
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	private int cscId;
	
	private String orderId;
	
	private String customerName;
	
	private String createrId;
	
	private String createrName;
	
	private String operaterId;
	
	private String operaterName;

	private int complaintType;
	
	private int complaintLevel;
	
	private String complaintTime;
	
	private int complaintStatus;
	
	private String complaintHandle;
	
	private String complaintHandleTime;
	
	private String complaintDes;

	@Id
	@Column(name="cscId")
	public int getCscId(){
		return cscId;
	}

	public void setCscId(int cscId){
		this.cscId = cscId;
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
	
	@Column(name="complaintLevel")
	public int getComplaintLevel(){
		return complaintLevel;
	}

	public void setComplaintLevel(int complaintLevel){
		this.complaintLevel = complaintLevel;
	}

	@Column(name="complaintTime")
	public String getComplaintTime(){
		return complaintTime;
	}

	public void setComplaintTime(String complaintTime){
		this.complaintTime = complaintTime;
	}

	@Column(name="complaintDes")
	public String getComplaintDes(){
		return complaintDes;
	}

	public void setComplaintDes(String complaintDes){
		this.complaintDes = complaintDes;
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

	@Column(name = "complaintType")
	public int getComplaintType(){
		return complaintType;
	}

	public void setComplaintType(int complaintType){
		this.complaintType = complaintType;
	}

	@Column(name = "complaintStatus")
	public int getComplaintStatus(){
		return complaintStatus;
	}

	public void setComplaintStatus(int complaintStatus){
		this.complaintStatus = complaintStatus;
	}

	@Column(name = "complaintHandle")
	public String getComplaintHandle(){
		return complaintHandle;
	}

	public void setComplaintHandle(String complaintHandle){
		this.complaintHandle = complaintHandle;
	}

	@Column(name = "complaintHandleTime")
	public String getComplaintHandleTime(){
		return complaintHandleTime;
	}

	public void setComplaintHandleTime(String complaintHandleTime){
		this.complaintHandleTime = complaintHandleTime;
	}

	@Column(name = "createrId")
	public String getCreaterId(){
		return createrId;
	}

	public void setCreaterId(String createrId){
		this.createrId = createrId;
	}

	@Column(name = "createrName")
	public String getCreaterName(){
		return createrName;
	}

	public void setCreaterName(String createrName){
		this.createrName = createrName;
	}
	
}
