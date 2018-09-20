/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
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

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationPayment", catalog = "payment")
public class DecorationPaymentPO implements Serializable {

	private static final long serialVersionUID = 1341114461146L;
	
	public static final short ADVANCETYPE_TYPE_BALANCE_INT = 1; 
	
	public static final short ADVANCETYPE_TYPE_PROJECT_INT = 2; 
	
	public static final String PAYMENTTYPE_ADVANCE_STR = "预付款";
	
	public static final String PAYMENTTYPE_DESIGN_STR = "设计费";
	
	public static final String PAYMENTTYPE_ADD_STR = "增项款";
	
	public static final String PAYMENTTYPE_REDUCE_STR = "减项款";
	
	public static final String PAYMENTTYPE_CONTRACT_REFUND_STR = "合同退款";
	
	public static final String PAYMENTTYPE_PENALTY_STR = "违约金";
	
	public static final String PAYMENTTYPE_REFUND_STR = "退款";
	
	public static final String PAYMENTTYPE_HISTORY_STR = "历史";
	
	public static final String PAYMENTTYPE_OTHER_STR = "其他退款";
	
	public static final String PAYMENTSTATUS_UNPAY_STR = "未付款";
	
	public static final String PAYMENTSTATUS_PAY_STR = "已付款";
	
	public static final String PAYMENTSTATUS_CONFIRM_STR = "已确认";
	
	public static final String PAYMENTSTATUS_APPLY_STR = "申请审批";
	
	public static final String PAYMENTSTATUS_UNPASS_STR = "审批未通过";
	
	public static final String PAYMENTSTATUS_PASS_STR = "审批通过";
	
	public static final String PAYMENTSTATUS_REFUND_STR = "申请退款";
	
	public static final short CHARSCALE_COUNT_INT = 0;
	
	public static final short ONETYPE_ADD_INT = 0;         
	
	public static final short ONETYPE_REFUND_INT = 1;      
	
	public static final short ONETYPE_HISTORY_INT = 2;     
	
	public static final short TWOTYPE_BASE_INT = 0;        
	
	public static final short TWOTYPE_DEAL_INT = 1;        
	
	public static final short TWOTYPE_ADD_REDUCE_INT = 2;  
	
	public static final short TWOTYPE_OTHER_INT = 3;

	private long dpid;
	
	private DecorationPO decoration;
	
	private DecorationReceiptPO decorationReceipt;
	
	private short oneType;
	
	private short twoType;
	
	private String paymentType;
	
	private String paymentStatus;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private float referMoney =  0f;
	
	private float realMoney = 0f;
	
	private int company;
	
	public DecorationPaymentPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "dpid")
	public long getDpid() {
		return dpid;
	}

	public void setDpid(long dpid) {
		this.dpid = dpid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration(){
		return decoration;
	}

	public void setDecoration(DecorationPO decoration){
		this.decoration = decoration;
	}

	@Column(name = "paymentType")
	public String getPaymentType(){
		return paymentType;
	}

	public void setPaymentType(String paymentType){
		this.paymentType = paymentType;
	}

	@Column(name = "paymentStatus")
	public String getPaymentStatus(){
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus){
		this.paymentStatus = paymentStatus;
	}

	@Column(name = "referMoney")
	public float getReferMoney(){
		return referMoney;
	}

	public void setReferMoney(float referMoney){
		this.referMoney = referMoney;
	}

	@Column(name="createTime")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater(){
		return creater;
	}

	public void setCreater(UserPO creater){
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "drId", referencedColumnName = "drId")
	public DecorationReceiptPO getDecorationReceipt() {
		return decorationReceipt;
	}

	public void setDecorationReceipt(DecorationReceiptPO decorationReceipt) {
		this.decorationReceipt = decorationReceipt;
	}

	@Column(name="realMoney")
	public float getRealMoney(){
		return realMoney;
	}

	public void setRealMoney(float realMoney){
		this.realMoney = realMoney;
	}

	@Column(name = "onetype")
	public short getOneType() {
		return oneType;
	}

	public void setOneType(short oneType) {
		this.oneType = oneType;
	}

	@Column(name = "twotype")
	public short getTwoType() {
		return twoType;
	}

	public void setTwoType(short twoType) {
		this.twoType = twoType;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
}
