package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.material.po.MaterialPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "materialpayment", catalog = "payment")
public class MaterialPaymentPO implements java.io.Serializable {

	private static final long serialVersionUID = -4500536292742086545L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_MID_STR = "mid";
	
	public static final String COLUMN_NO_STR = "material.no";
	
	public static final String COLUMN_MPID_STR = "mpId";
	
	public static final String COLUMN_PAYMENTSTATUS_STR = "paymentStatus";
	
	public static final String COLUMN_PAYMENTTYPE_STR = "paymentType";
	
	public static final String COLUMN_COLLECTTIME_STR = "collectTime";
	
	public static final String COLUMN_MRID_STR = "materialReceipt.mrId";
	
	public static final short PAYMENTTYPE_TYPE_INIT_INT = 0;
	
	public static final short PAYMENTTYPE_TYPE_ADVANCE_INT = 1;
	
	public static final short PAYMENTTYPE_TYPE_DEPOSIT_INT = 2;
	
	public static final short PAYMENTTYPE_TYPE_FULL_INT = 3;
	
	public static final short PAYMENTTYPE_TYPE_REJECT_INT = 4;
	
	public static final short PAYMENTTYPE_TYPE_FULL_REFUND_INT = 5;
	
	public static final short PAYMENTTYPE_TYPE_COUPON_REFUND_INT = 6;
	
	public static final short PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT = 7;
	
	public static final String PAYMENTTYPE_TYPE_ADVANCE_STR = "预付款";
	
	public static final String PAYMENTTYPE_TYPE_DEPOSIT_STR = "定金";
	
	public static final String PAYMENTTYPE_TYPE_FULL_STR = "补款";
	
	public static final String PAYMENTTYPE_TYPE_REJECT_STR = "退款";
	
	public static final String PAYMENTTYPE_TYPE_FULL_REFUND_STR = "补款退款";
	
	public static final String PAYMENTTYPE_TYPE_COUPON_REFUND_STR = "券退款";
	
	public static final String PAYMENTTYPE_TYPE_DEPOSIT_REFUND_STR = "定金退款";
	
	public static final short PAYMENTSTATUS_TYPE_INIT_INT = 0;
	
	public static final short PAYMENTSTATUS_TYPE_COLLECT_INT = 1;
	
	public static final short PAYMENTSTATUS_TYPE_CONFIRM_INT = 2;
	
	public static final short ADVANCETYPE_TYPE_MATERIAL_INT = 1;
	
	public static final short ADVANCETYPE_TYPE_ZATERIAL_INT = 2;
	
	public static final short PAYMENTSTATUS_PAY_STR = 1;

	private long mpId;
	
	private MaterialReceiptPO materialReceipt;
	
	private MaterialPO material;
	
	private String category;
	
	private String brand;
	
	private short paymentType; 
	
	private short paymentStatus;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private long referMoney;
	
	private int company;
	
	public MaterialPaymentPO() {
		super();
	}

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
	@JoinColumn(name = "mrId", referencedColumnName = "mrId")
	public MaterialReceiptPO getMaterialReceipt() {
		return materialReceipt;
	}

	public void setMaterialReceipt(MaterialReceiptPO materialReceipt) {
		this.materialReceipt = materialReceipt;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mid", referencedColumnName = "mid")
	public MaterialPO getMaterial() {
		return material;
	}

	public void setMaterial(MaterialPO material) {
		this.material = material;
	}

	@Column(name = "category")
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Column(name = "brand")
	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	@Column(name = "paymentType")
	public short getPaymentType(){
		return this.paymentType;
	}

	public void setPaymentType(short paymentType){
		this.paymentType = paymentType;
	}

	@Column(name = "paymentStatus")
	public short getPaymentStatus(){
		return this.paymentStatus;
	}

	public void setPaymentStatus(short paymentStatus){
		this.paymentStatus = paymentStatus;
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
	
	@Column(name = "referMoney")
	public long getReferMoney(){
		return this.referMoney;
	}

	public void setReferMoney(long referMoney){
		this.referMoney = referMoney;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
}