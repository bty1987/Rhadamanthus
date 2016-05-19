package com.fanglin.data.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class CustomerVO implements Serializable {

	private static final long serialVersionUID = -7469004001329405496L;

	@SerializedName("自增ID")
	private Integer id;
	
	@SerializedName("客户ID")
	private String customerId;
	
	@SerializedName("客户姓名")
	private String customerName;
	
	@SerializedName("客户姓名拼音")
	private String customerNamePYAll;
	
	@SerializedName("客户姓名拼音首字母")
	private String customerNamePYAB;
	
	@SerializedName("性别")
	private String gender;
	
	@SerializedName("联系方式")
	private String phone;
	
	@SerializedName("QQ")
	private String qq;
	
	@SerializedName("微信")
	private String wechat;
	
	@SerializedName("邮箱")
	private String email;
	
	@SerializedName("地址")
	private String address;
	
	@SerializedName("客户关系类型")
	private String relationshipType;
	
	@SerializedName("合同预付款金额")
	private Float balance;
	
	@SerializedName("主材预付款金额")
	private float materialBalance;
	
	@SerializedName("正林预付款金额")
	private float zhenglinBalance;
	
	@SerializedName("工程预付款金额")
	private float projectBalance;
	
	@SerializedName("审批状态")
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
	
	public float getMaterialBalance(){
		return materialBalance;
	}

	public void setMaterialBalance(float materialBalance){
		this.materialBalance = materialBalance;
	}

	public float getZhenglinBalance(){
		return zhenglinBalance;
	}

	public void setZhenglinBalance(float zhenglinBalance){
		this.zhenglinBalance = zhenglinBalance;
	}

	public float getProjectBalance(){
		return projectBalance;
	}

	public void setProjectBalance(float projectBalance){
		this.projectBalance = projectBalance;
	}

	public Integer getApproveStatus(){
		return approveStatus;
	}

	public void setApproveStatus(Integer approveStatus){
		this.approveStatus = approveStatus;
	}

}
