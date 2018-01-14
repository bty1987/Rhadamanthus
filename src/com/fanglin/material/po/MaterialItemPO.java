package com.fanglin.material.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialitem", catalog = "material")
public class MaterialItemPO implements java.io.Serializable {

	private static final long serialVersionUID = 2310778692937056830L;
	
	public static final String COLUMN_MIID_STR = "miid";

	public static final String COLUMN_MID_STR = "mid";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_STATUS_STR = "status";

    public static final String COLUMN_PAYMENTSTATUS_STR = "paymentStatus";

	public static final String COLUMN_REFUNDSTATUS_STR = "refundStatus";

	public static final String COLUMN_BALANCESTATUS_STR = "balanceStatus";
	
	public static final short STATUS_TYPE_INIT_INT = 0;
	
	public static final short STATUS_TYPE_DELETE_INT = 4;
	
	public static final int PAYMENTSTATUS_TYPE_INIT_INT = 0;
	
	public static final int PAYMENTSTATUS_TYPE_PAYMENT_INT = 1;
	
	public static final int PAYMENTSTATUS_TYPE_CONFIRM_INT = 2;
	
	public static final int REFUNDSTATUS_TYPE_INIT_INT = 0;
	
	public static final short REFUNDSTATUS_TYPE_REJECT_INT = 1;
	
	public static final short BALANCESTATUS_TYPE_INIT_INT = 0;
	
	public static final short BALANCESTATUS_TYPE_PREBALANCE_INT = 1;
	
	public static final short BALANCESTATIS_TYPE_POSTBALANCE_INT = 3;
	
	public static final short CALCTYPE_TYPE_BASE_INT = 0;
	
	public static final short CALCTYPE_TYPE_POINT_INT = 1;
	
	private long miid;
	
	private long mid;
	
	private String no;
	
	private String name;
	
	private String category;
	
	private String brand;
	
	private String measurementUnit;
	
	private String packageName;
	
	private float unitPrice;
	
	private float purchasePrice;
	
	private float salePrice;
	
	private float price;
	
	private float discount;
	
	private float postDiscount;
	
	private float num;
	
	private float total;
	
	private short status; // 无 , 退货 , 预结算 , 结算 , 删除
	
	private short balanceStatus;
	
	private short refundStatus;
	
	private short rawCalcType;
	
	private float rawPoint;
	
	private short calcType;
	
	private float prePoint;
	
	private float postPoint;
	
	private String comment;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "miid")
	public long getMiid() {
		return miid;
	}

	public void setMiid(long miid) {
		this.miid = miid;
	}

	@Column(name = "mid")
	public long getMid() {
		return mid;
	}

	public void setMid(long mid) {
		this.mid = mid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	@Column(name = "measurementUnit")
	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@Column(name = "packageName")
	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	@Column(name = "unitPrice")
	public float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "purchasePrice")
	public float getPurchasePrice() {
		return purchasePrice;
	}

	public void setPurchasePrice(float purchasePrice) {
		this.purchasePrice = purchasePrice;
	}

	@Column(name = "salePrice")
	public float getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(float salePrice) {
		this.salePrice = salePrice;
	}

	@Column(name = "price")
	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	@Column(name = "discount")
	public float getDiscount() {
		return discount;
	}

	public void setDiscount(float discount) {
		this.discount = discount;
	}

	@Column(name = "postDiscount")
	public float getPostDiscount() {
		return postDiscount;
	}

	public void setPostDiscount(float postDiscount) {
		this.postDiscount = postDiscount;
	}

	@Column(name = "num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@Column(name = "total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "balanceStatus")
	public short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

	@Column(name = "refundStatus")
	public short getRefundStatus() {
		return refundStatus;
	}

	public void setRefundStatus(short refundStatus) {
		this.refundStatus = refundStatus;
	}

	@Column(name = "rawCalcType")
	public short getRawCalcType() {
		return rawCalcType;
	}

	public void setRawCalcType(short rawCalcType) {
		this.rawCalcType = rawCalcType;
	}

	@Column(name = "rawPoint")
	public float getRawPoint() {
		return rawPoint;
	}

	public void setRawPoint(float rawPoint) {
		this.rawPoint = rawPoint;
	}

	@Column(name = "calcType")
	public short getCalcType() {
		return calcType;
	}

	public void setCalcType(short calcType) {
		this.calcType = calcType;
	}

	@Column(name = "prePoint")
	public float getPrePoint() {
		return prePoint;
	}

	public void setPrePoint(float prePoint) {
		this.prePoint = prePoint;
	}

	@Column(name = "postPoint")
	public float getPostPoint() {
		return postPoint;
	}

	public void setPostPoint(float postPoint) {
		this.postPoint = postPoint;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}