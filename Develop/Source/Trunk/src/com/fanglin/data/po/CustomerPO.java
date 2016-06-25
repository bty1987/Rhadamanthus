package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fanglin.payment.po.AdvancePaymentPO;

@Entity
@Table(name="customer", catalog = "communion")
public class CustomerPO implements Serializable{

	private static final long serialVersionUID = 263298158826936889L;
	
	public static final String BALANCE_TYPE_BALANCE_STR = "合同预付款";
	
	public static final String BALANCE_TYPE_MATERIAL_STR = "主材预付款";
	
	public static final String BALANCE_TYPE_ZHENGLIN_STR = "正林预付款";
	
	public static final String BALANCE_TYPE_PROJECT_STR = "工程预付款";
	
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
	
	private Integer approveStatus;
	
	private AdvancePaymentPO advancePaymentPO;
	
	public CustomerPO(){
		super();
	}
	
	public CustomerPO(Integer id){
		this.id = id;
	}

	@Id
	@GeneratedValue
	@Column(name="id")
	public Integer getId(){
		return id;
	}

	public void setId(Integer id){
		this.id = id;
	}

	@Column(name="customerId")
	public String getCustomerId(){
		return customerId;
	}

	public void setCustomerId(String customerId){
		this.customerId = customerId;
	}

	@Column(name="customerName")
	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	@Column(name="customerNamePYAll")
	public String getCustomerNamePYAll(){
		return customerNamePYAll;
	}

	public void setCustomerNamePYAll(String customerNamePYAll){
		this.customerNamePYAll = customerNamePYAll;
	}

	@Column(name="customerNamePYAB")
	public String getCustomerNamePYAB(){
		return customerNamePYAB;
	}

	public void setCustomerNamePYAB(String customerNamePYAB){
		this.customerNamePYAB = customerNamePYAB;
	}

	@Column(name="gender")
	public String getGender(){
		return gender;
	}

	public void setGender(String gender){
		this.gender = gender;
	}

	@Column(name="phone")
	public String getPhone(){
		return phone;
	}

	public void setPhone(String phone){
		this.phone = phone;
	}

	@Column(name="qq")
	public String getQq(){
		return qq;
	}

	public void setQq(String qq){
		this.qq = qq;
	}

	@Column(name="wechat")
	public String getWechat(){
		return wechat;
	}

	public void setWechat(String wechat){
		this.wechat = wechat;
	}

	@Column(name="email")
	public String getEmail(){
		return email;
	}

	public void setEmail(String email){
		this.email = email;
	}

	@Column(name="address")
	public String getAddress(){
		return address;
	}

	public void setAddress(String address){
		this.address = address;
	}

	@Column(name="relationshipType")
	public String getRelationshipType(){
		return relationshipType;
	}

	public void setRelationshipType(String relationshipType){
		this.relationshipType = relationshipType;
	}

	@Column(name="approveStatus")
	public Integer getApproveStatus(){
		return approveStatus;
	}

	public void setApproveStatus(Integer approveStatus){
		this.approveStatus = approveStatus;
	}

	@OneToOne(mappedBy="customer")
	public AdvancePaymentPO getAdvancePaymentPO() {
		return advancePaymentPO;
	}

	public void setAdvancePaymentPO(AdvancePaymentPO advancePaymentPO) {
		this.advancePaymentPO = advancePaymentPO;
	}
	
}