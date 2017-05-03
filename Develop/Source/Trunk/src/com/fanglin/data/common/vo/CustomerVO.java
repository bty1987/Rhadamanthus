package com.fanglin.data.common.vo;

import java.io.Serializable;

public class CustomerVO implements Serializable {

	private static final long serialVersionUID = -7469004001329405496L;

	private Integer id;
	
	private String customerId;
	
	private String customerName;
	
	private String customerNamePYAll;
	
	private String customerNamePYAB;
	
	private String gender;
	
	private String phone;
	
	private String qq;
	
	private String wechat;
	
	private String email;
	
	private String address;
	
	private String relationshipType;
	
	private Float balance;
	
	private Float materialBalance;
	
	private Float zhenglinBalance;
	
	private Float projectBalance;
	
	private Integer approveStatus;

	public CustomerVO(){
		super();
	}

	public CustomerVO(Integer id){
		super();
		setId(id);
	}

	public Integer getId(){
		return id;
	}

	public void setId(Integer id){
		this.id = id;
	}

	public String getCustomerId(){
		return customerId;
	}

	public void setCustomerId(String customerId){
		this.customerId = customerId;
	}

	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	public String getCustomerNamePYAll(){
		return customerNamePYAll;
	}

	public void setCustomerNamePYAll(String customerNamePYAll){
		this.customerNamePYAll = customerNamePYAll;
	}

	public String getCustomerNamePYAB(){
		return customerNamePYAB;
	}

	public void setCustomerNamePYAB(String customerNamePYAB){
		this.customerNamePYAB = customerNamePYAB;
	}

	public String getGender(){
		return gender;
	}

	public void setGender(String gender){
		this.gender = gender;
	}

	public String getPhone(){
		return phone;
	}

	public void setPhone(String phone){
		this.phone = phone;
	}

	public String getQq(){
		return qq;
	}

	public void setQq(String qq){
		this.qq = qq;
	}

	public String getWechat(){
		return wechat;
	}

	public void setWechat(String wechat){
		this.wechat = wechat;
	}

	public String getEmail(){
		return email;
	}

	public void setEmail(String email){
		this.email = email;
	}

	public String getAddress(){
		return address;
	}

	public void setAddress(String address){
		this.address = address;
	}

	public String getRelationshipType(){
		return relationshipType;
	}

	public void setRelationshipType(String relationshipType){
		this.relationshipType = relationshipType;
	}

	public void setConfidentialInfo(){
		this.email = "-";
		this.qq = "-";
		this.phone = "-";
		this.wechat = "-";
	}

	public Float getBalance(){
		return balance;
	}

	public void setBalance(Float balance){
		this.balance = balance;
	}
	
	public Float getMaterialBalance(){
		return materialBalance;
	}

	public void setMaterialBalance(Float materialBalance){
		this.materialBalance = materialBalance;
	}

	public Float getZhenglinBalance(){
		return zhenglinBalance;
	}

	public void setZhenglinBalance(Float zhenglinBalance){
		this.zhenglinBalance = zhenglinBalance;
	}

	public Float getProjectBalance(){
		return projectBalance;
	}

	public void setProjectBalance(Float projectBalance){
		this.projectBalance = projectBalance;
	}

	public Integer getApproveStatus(){
		return approveStatus;
	}

	public void setApproveStatus(Integer approveStatus){
		this.approveStatus = approveStatus;
	}

}
