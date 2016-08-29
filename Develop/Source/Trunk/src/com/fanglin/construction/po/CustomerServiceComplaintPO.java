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

	private int type;
	
	private int level;
	
	private String createTime;
	
	private int status;
	
	private String handle;
	
	private String handleTime;
	
	private String des;

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

	@Column(name = "type")
	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	@Column(name = "level")
	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "status")
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Column(name = "handle")
	public String getHandle() {
		return handle;
	}

	public void setHandle(String handle) {
		this.handle = handle;
	}

	@Column(name = "handleTime")
	public String getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(String handleTime) {
		this.handleTime = handleTime;
	}

	@Column(name = "des")
	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}
	
}
