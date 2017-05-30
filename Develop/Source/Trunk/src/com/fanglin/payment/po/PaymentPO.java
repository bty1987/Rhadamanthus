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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.po.CustomerPO;

@Entity
@Table(name = "payment", catalog = "platform")
public class PaymentPO implements Serializable {

	private static final long serialVersionUID = 2529822120958975802L;
	
	public static final String PAYMENT_PAYMENTTYPE_BALANCE_STR = "合同预付款";

	public static final String PAYMENT_PAYMENTTYPE_PROJECT_STR = "工程预付款";
	
	public static final String PAYMENT_PAYMENTTYPE_MATERIAL_STR = "主材预付款";
	
	public static final String PAYMENT_PAYMENTTYPE_ZATERIAL_STR = "正林预付款";
	
	//提现, 收款,  退款, 付款, 转换款项, 预付款转换
	public static final String PAYMENT_TYPE_EXTRACT_STR = "提现"; //减
	
	public static final String PAYMENT_TYPE_COLLECTION_STR = "收款";
	
	public static final String PAYMENT_TYPE_REFUND_STR = "退款";
	
	public static final String PAYMENT_TYPE_PAYMENT_STR = "付款"; //减
	
	public static final String PAYMENT_TYPE_CONVERT_STR = "转换款项";
	
	public static final String PAYMENT_CONVERT_IN_STR = "预付款转入";
	
	public static final String PAYMENT_CONVERT_OUT_STR = "预付款转出";

	public static final String PAYMENT_STATUS_PAID_STR = "已付款";
	
	public static final String PAYMENT_STATUS_CONFIRMED_STR = "已确认";
	
	public static final String PAYMENT_STATUS_CANCELED_STR = "已撤销";
	
	private Integer paymentId;
	
	private CustomerPO customer;
	
	private String orderId;
	
	private AdvanceReceiptPO advanceReceipt;
	
	private float balance;
	
	private float recharge;
	
	private String type;
	
	private String paymentType;
	
	private String status;
	
	private String des;
	
	private Long convertPaymentId; // 对应转换款项关联表的id, 致远表对应
	
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
	public Integer getPaymentId(){
		return paymentId;
	}

	public void setPaymentId(Integer paymentId){
		this.paymentId = paymentId;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "customerId", referencedColumnName = "id")
	public CustomerPO getCustomer(){
		return customer;
	}

	public void setCustomer(CustomerPO customer){
		this.customer = customer;
	}

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

	@Column(nullable = false)
	public float getBalance(){
		return balance;
	}

	public void setBalance(float balance){
		this.balance = balance;
	}

	@Column(nullable = false)
	public float getRecharge(){
		return recharge;
	}

	public void setRecharge(float recharge){
		this.recharge = recharge;
	}

	@Column(nullable = false)
	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	public String getPaymentType(){
		return paymentType;
	}

	public void setPaymentType(String paymentType){
		this.paymentType = paymentType;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public Long getConvertPaymentId(){
		return convertPaymentId;
	}

	public void setConvertPaymentId(Long convertPaymentId){
		this.convertPaymentId = convertPaymentId;
	}

}
