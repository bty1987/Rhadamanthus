/**
 * @File Name	: CusotmerServiceComplaIntegerVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;

public class CustomerServiceComplaintVO implements Serializable {

	private static final long serialVersionUID = -28421212134426045L;
	
	private Integer cscId;
	
	private String orderId;
	
	private String customerName;
	
	private String createrId;
	
	private String createrName;
	
	private String operaterId;
	
	private String operaterName;

	private Integer type;
	
	private Integer level;
	
	private String createTime;
	
	private Integer status;
	
	private String handle;
	
	private String handleTime;
	
	private String des;

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

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getHandle() {
		return handle;
	}

	public void setHandle(String handle) {
		this.handle = handle;
	}

	public String getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(String handleTime) {
		this.handleTime = handleTime;
	}

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}


}
