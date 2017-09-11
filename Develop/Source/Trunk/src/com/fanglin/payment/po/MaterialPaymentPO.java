package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.material.po.MaterialSubOrderPO;

@Entity
@Table(name = "materialpayment", catalog = "payment")
public class MaterialPaymentPO implements java.io.Serializable {

	private static final long serialVersionUID = -4500536292742086545L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_MSOID_STR = "msoId";
	
	public static final String COLUMN_MSONO_STR = "msoNo";
	
	public static final String COLUMN_MPID_STR = "mpId";
	
	public static final String COLUMN_PAYMENTSTATUS_STR = "paymentStatus";
	
	public static final String COLUMN_PAYMENTTYPE_STR = "paymentType";
	
	public static final String COLUMN_COLLECTTIME_STR = "collectTime";
	
	public static final String COLUMN_MRID_STR = "materialReceiptPO.mrId";
	
	public static final int PAYMENTTYPE_TYPE_INIT_INT = 0;
	
	public static final int PAYMENTTYPE_TYPE_ADVANCE_INT = 1;
	
	public static final int PAYMENTTYPE_TYPE_DEPOSIT_INT = 2;
	
	public static final int PAYMENTTYPE_TYPE_FULL_INT = 3;
	
	public static final int PAYMENTTYPE_TYPE_REJECT_INT = 4;
	
	public static final int PAYMENTTYPE_TYPE_FULL_REFUND_INT = 5;
	
	public static final int PAYMENTTYPE_TYPE_COUPON_REFUND_INT = 6;
	
	public static final int PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT = 7;
	
	public static final String PAYMENTTYPE_TYPE_ADVANCE_STR = "预付款";
	
	public static final String PAYMENTTYPE_TYPE_DEPOSIT_STR = "定金";
	
	public static final String PAYMENTTYPE_TYPE_FULL_STR = "补款";
	
	public static final String PAYMENTTYPE_TYPE_REJECT_STR = "退款";
	
	public static final String PAYMENTTYPE_TYPE_FULL_REFUND_STR = "补款退款";
	
	public static final String PAYMENTTYPE_TYPE_COUPON_REFUND_STR = "券退款";
	
	public static final String PAYMENTTYPE_TYPE_DEPOSIT_REFUND_STR = "定金退款";
	
	public static final int PAYMENTSTATUS_TYPE_INIT_INT = 0;
	
	public static final int PAYMENTSTATUS_TYPE_COLLECT_INT = 1;
	
	public static final int PAYMENTSTATUS_TYPE_CONFIRM_INT = 2;
	
	public static final int ADVANCETYPE_TYPE_MATERIAL_INT = 1;
	
	public static final int ADVANCETYPE_TYPE_ZATERIAL_INT = 2;

	private long mpId;
	
	private MaterialSubOrderPO materialSubOrder;
	
	private String msoNo;
	
	private int paymentType; // 初始, 预付款 , 定金 , 补款, 退款
	
	private int paymentStatus;
	
	private String materialType;
	
	private String materialBrand;
	
	private String customerId;
	
	private String customerName;
	
	private String createUserId;
	
	private String createUserName;
	
	private MaterialReceiptPO materialReceipt;
	
	private float referMoney;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mpId")
	public long getMpId(){
		return this.mpId;
	}

	public void setMpId(long mpId){
		this.mpId = mpId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "msoId", referencedColumnName = "msoId")
	public MaterialSubOrderPO getMaterialSubOrder() {
		return materialSubOrder;
	}

	public void setMaterialSubOrder(MaterialSubOrderPO materialSubOrder) {
		this.materialSubOrder = materialSubOrder;
	}

	@Column(name = "paymentType")
	public int getPaymentType(){
		return this.paymentType;
	}

	public void setPaymentType(int paymentType){
		this.paymentType = paymentType;
	}

	@Column(name = "paymentStatus")
	public int getPaymentStatus(){
		return this.paymentStatus;
	}

	public void setPaymentStatus(int paymentStatus){
		this.paymentStatus = paymentStatus;
	}

	@Column(name = "createUserId")
	public String getCreateUserId(){
		return this.createUserId;
	}

	public void setCreateUserId(String createUserId){
		this.createUserId = createUserId;
	}

	@Column(name = "referMoney")
	public float getReferMoney(){
		return this.referMoney;
	}

	public void setReferMoney(float referMoney){
		this.referMoney = referMoney;
	}

	@Column(name = "createUserName")
	public String getCreateUserName(){
		return createUserName;
	}

	public void setCreateUserName(String createUserName){
		this.createUserName = createUserName;
	}

	@Column(name = "customerName")
	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	@Column(name = "customerId")
	public String getCustomerId(){
		return customerId;
	}

	public void setCustomerId(String customerId){
		this.customerId = customerId;
	}

	@Column(name = "msoNo")
	public String getMsoNo(){
		return msoNo;
	}

	public void setMsoNo(String msoNo){
		this.msoNo = msoNo;
	}

	@Column(name = "materialType")
	public String getMaterialType(){
		return materialType;
	}

	public void setMaterialType(String materialType){
		this.materialType = materialType;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mrId", referencedColumnName = "mrId")
	public MaterialReceiptPO getMaterialReceipt() {
		return materialReceipt;
	}

	public void setMaterialReceipt(MaterialReceiptPO materialReceipt) {
		this.materialReceipt = materialReceipt;
	}

	@Column(name = "materialBrand")
	public String getMaterialBrand(){
		return materialBrand;
	}

	public void setMaterialBrand(String materialBrand){
		this.materialBrand = materialBrand;
	}
	
}