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

@Entity
@Table(name = "materialoutsidepayment", catalog = "platform")
public class MaterialOutsidePaymentPO implements java.io.Serializable {

	private static final long serialVersionUID = -341320174803538669L;
	
	public static final short PAYMENTSTATUS_INTI_INT = 0;
	
	public static final short PAYMENTSTATUS_COLLECT_INT = 1;
	
	public static final short PAYMENTTYPE_COLLECT_INT = 0;
	
	public static final short PAYMENTTYPE_REFUND_INT = 1;
	
	public static final String COLUMN_MOID_STR = "moId";
	
	public static final String COLUMN_PAYMENTSTATUS_STR = "paymentStatus";
	
	public static final String COLUMN_PAYMENTTYPE_STR = "paymentType";
	
	private long mopId;
	
	private long moId;
	
	private short paymentType;
	
	private short paymentStatus;
	
	private String orderId;
	
	private String orderAddr;
	
	private String customerName;
	
	private String materialTypeName;
	
	private String materialBrandName;
	
	private String createUserId;
	
	private String createUserName;
	
	private Timestamp createTime;
	
	private MaterialOutsideReceiptPO materialOutsideReceipt;
	
	private float referMoney;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mopId")
	public long getMopId() {
		return this.mopId;
	}

	public void setMopId(long mopId) {
		this.mopId = mopId;
	}

	@Column(name = "moId")
	public long getMoId() {
		return this.moId;
	}

	public void setMoId(long moId) {
		this.moId = moId;
	}

	@Column(name = "paymentType")
	public short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(short paymentType) {
		this.paymentType = paymentType;
	}

	@Column(name = "paymentStatus")
	public short getPaymentStatus() {
		return this.paymentStatus;
	}

	public void setPaymentStatus(short paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "orderAddr")
	public String getOrderAddr() {
		return this.orderAddr;
	}

	public void setOrderAddr(String orderAddr) {
		this.orderAddr = orderAddr;
	}

	@Column(name = "customerName")
	public String getCustomerName() {
		return this.customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	@Column(name = "materialTypeName")
	public String getMaterialTypeName() {
		return this.materialTypeName;
	}

	public void setMaterialTypeName(String materialTypeName) {
		this.materialTypeName = materialTypeName;
	}

	@Column(name = "materialBrandName")
	public String getMaterialBrandName() {
		return this.materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName) {
		this.materialBrandName = materialBrandName;
	}

	@Column(name = "createUserId")
	public String getCreateUserId() {
		return this.createUserId;
	}

	public void setCreateUserId(String createUserId) {
		this.createUserId = createUserId;
	}

	@Column(name = "createUserName")
	public String getCreateUserName() {
		return this.createUserName;
	}

	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "morId", referencedColumnName = "morId")
	public MaterialOutsideReceiptPO getMaterialOutsideReceipt() {
		return materialOutsideReceipt;
	}

	public void setMaterialOutsideReceipt(
			MaterialOutsideReceiptPO materialOutsideReceipt) {
		this.materialOutsideReceipt = materialOutsideReceipt;
	}

	@Column(name = "referMoney")
	public float getReferMoney() {
		return this.referMoney;
	}

	public void setReferMoney(float referMoney) {
		this.referMoney = referMoney;
	}

}