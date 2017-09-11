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

import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationPayment", catalog = "payment")
public class DecorationPaymentPO implements Serializable {

	private static final long serialVersionUID = 1341114461146L;
	
	public static final int ADVANCETYPE_TYPE_BALANCE_INT = 1; // 合同预付款
	
	public static final int ADVANCETYPE_TYPE_PROJECT_INT = 2; // 工程预付款
	
	public static final String PAYMENTTYPE_ADVANCE_STR = "预付款";
	
	public static final String PAYMENTTYPE_DEPOSIT_STR = "定金";
	
	public static final String PAYMENTTYPE_DESIGN_STR = "设计费";
	
	public static final String PAYMENTTYPE_FIRST_STR = "首付款";
	
	public static final String PAYMENTTYPE_FIRST_SECOND_STR = "首付二期款";
	
	public static final String PAYMENTTYPE_SECOND_STR = "二期款";
	
	public static final String PAYMENTTYPE_FINAL_STR = "尾款";
	
	public static final String PAYMENTTYPE_ADD_STR = "增项款";
	
	public static final String PAYMENTTYPE_REDUCE_STR = "减项款";
	
	public static final String PAYMENTTYPE_CONTRACT_REFUND_STR = "合同退款";
	
	public static final String PAYMENTTYPE_PENALTY_STR = "违约金";
	
	public static final String PAYMENTTYPE_REFUND_STR = "退款";
	
	public static final String PAYMENTTYPE_HISTORY_STR = "历史";
	
	public static final String PAYMENTTYPE_OTHER_STR = "其他退款";
	
	public static final String PAYMENTSTATUS_UNSUBMIT_STR = "未提交";
	
	public static final String PAYMENTSTATUS_UNPAY_STR = "未付款";
	
	public static final String PAYMENTSTATUS_PAY_STR = "已付款";
	
	public static final String PAYMENTSTATUS_CONFIRM_STR = "已确认";
	
	public static final String PAYMENTSTATUS_APPLY_STR = "申请审批";
	
	public static final String PAYMENTSTATUS_UNPASS_STR = "审批未通过";
	
	public static final String PAYMENTSTATUS_PASS_STR = "审批通过";
	
	public static final String PAYMENTSTATUS_REFUND_STR = "申请退款";
	
	public static final int CHARSCALE_COUNT_INT = 4;

	private long autoId;
	
	private DecorationOrderPO decorationOrderPO;
	
	private String paymentType;
	
	private String paymentStatus;
	
	private UserPO createUserPO;
	
	private Timestamp createTime;
	
	private String createDes;
	
	private DecorationReceiptPO decorationReceipt;
	
	private float referMoney =  0f;
	
	private float realMoney = 0f;
	
	private float paymentBlance =  0f;
	
	private float other =  0f;
	
	public DecorationPaymentPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "autoId")
	public long getAutoId(){
		return autoId;
	}
	
	public void setAutoId(long autoId){
		this.autoId = autoId;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationOrderPO getDecorationOrderPO(){
		return decorationOrderPO;
	}

	public void setDecorationOrderPO(DecorationOrderPO decorationOrderPO){
		this.decorationOrderPO = decorationOrderPO;
	}

	public String getPaymentType(){
		return paymentType;
	}

	public void setPaymentType(String paymentType){
		this.paymentType = paymentType;
	}

	public String getPaymentStatus(){
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus){
		this.paymentStatus = paymentStatus;
	}

	public float getReferMoney(){
		return referMoney;
	}

	public void setReferMoney(float referMoney){
		this.referMoney = referMoney;
	}

	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "createUserId", referencedColumnName = "userId")
	public UserPO getCreateUserPO(){
		return createUserPO;
	}

	public void setCreateUserPO(UserPO createUserPO){
		this.createUserPO = createUserPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "drId", referencedColumnName = "drId")
	public DecorationReceiptPO getDecorationReceipt() {
		return decorationReceipt;
	}

	public void setDecorationReceipt(DecorationReceiptPO decorationReceipt) {
		this.decorationReceipt = decorationReceipt;
	}

	public void setPaymentBlance(float paymentBlance){
		this.paymentBlance = paymentBlance;
	}
	
	public float getPaymentBlance(){
		return paymentBlance;
	}
	
	public void setOther(float other){
		this.other = other;
	}
	
	public float getOther(){
		return other;
	}
	
	public void setCreateDes(String createDes){
		this.createDes = createDes;
	}
	
	public String getCreateDes(){
		return createDes;
	}
	
	public float getRealMoney(){
		return realMoney;
	}

	public void setRealMoney(float realMoney){
		this.realMoney = realMoney;
	}

}
