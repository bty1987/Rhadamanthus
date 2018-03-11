/**
 * Title: PaymentPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.payment.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "payment", catalog = "payment")
public class PaymentPO implements Serializable {

	private static final long serialVersionUID = 2529822120958975802L;
	
	public static final String PAYMENT_PAYMENTTYPE_BALANCE_STR = "合同预付款";

	public static final String PAYMENT_PAYMENTTYPE_PROJECT_STR = "工程预付款";
	
	public static final String PAYMENT_PAYMENTTYPE_MATERIAL_STR = "主材预付款";
	
	public static final String PAYMENT_PAYMENTTYPE_ZATERIAL_STR = "正林预付款";
	
	public static final String PAYMENT_TYPE_EXTRACT_STR = "提现"; 
	
	public static final String PAYMENT_TYPE_COLLECTION_STR = "收款";
	
	public static final String PAYMENT_TYPE_REFUND_STR = "退款";
	
	public static final String PAYMENT_TYPE_PAYMENT_STR = "付款"; //减
	
	public static final String PAYMENT_TYPE_CONVERT_STR = "转换款项";
	
	public static final String PAYMENT_STATUS_PAID_STR = "已付款";
	
	public static final String PAYMENT_STATUS_CONFIRMED_STR = "已确认";
	
	public static final String PAYMENT_STATUS_CANCELED_STR = "已撤销";
	
	public static final String PAYMENT_DECORETION_PAYMENTNAME_STR = "装修款";
	
	public static final String PAYMENT_MATERIAL_PAYMENTNAME_STR = "主材款";
	
	private long pid;
	
	private AdvanceReceiptPO advanceReceipt;
	
	private CustomerPO customer;
	
	private String orderId;
	
	private float balance;
	
	private float recharge;
	
	private String type;
	
	private String paymentType;
	
	private String status;
	
	private int company;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	public PaymentPO(){
		super();
	}
	
	public PaymentPO(CustomerPO customer,AdvanceReceiptPO advanceReceipt){
		super();
		this.customer = customer;
		this.advanceReceipt = advanceReceipt;
	}

	@Id
	@GeneratedValue
	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "customerId", referencedColumnName = "cid")
	public CustomerPO getCustomer(){
		return customer;
	}

	public void setCustomer(CustomerPO customer){
		this.customer = customer;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "arId", referencedColumnName = "arId")
	public AdvanceReceiptPO getAdvanceReceipt() {
		return advanceReceipt;
	}

	public void setAdvanceReceipt(AdvanceReceiptPO advanceReceipt) {
		this.advanceReceipt = advanceReceipt;
	}

	@Column(nullable = false, name="balance")
	public float getBalance(){
		return balance;
	}

	public void setBalance(float balance){
		this.balance = balance;
	}

	@Column(nullable = false, name="recharge")
	public float getRecharge(){
		return recharge;
	}

	public void setRecharge(float recharge){
		this.recharge = recharge;
	}

	@Column(nullable = false, name="type")
	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	@Column(name="paymentType")
	public String getPaymentType(){
		return paymentType;
	}

	public void setPaymentType(String paymentType){
		this.paymentType = paymentType;
	}

	@Column(name="status")
	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater(){
		return creater;
	}

	public void setCreater(UserPO creater){
		this.creater = creater;
	}
	
	@Column(name="createTime")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}
	
}
