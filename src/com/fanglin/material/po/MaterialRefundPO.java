package com.fanglin.material.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialrefund", catalog = "material")
public class MaterialRefundPO implements java.io.Serializable {

	private static final long serialVersionUID = 8113424076445112728L;
	
	public static final int STATUS_TYPE_REFUND_INT = 0;
	
	public static final int STATUS_TYPE_CANCEL_INT = 1;
	
	public static final int STATUS_TYPE_PAYMENTCOLLECT_INT = 2;
	
	public static final int STATUS_TYPE_PAYMENTCONFIRM_INT = 3;
	
	public static final String COLUMN_MID_STR = "mid";
	
	public static final String COLUMN_MSOIID_STR = "miid";
	
	public static final String COLUMN_MPID_STR = "mpId";
	
	public static final String COLUMN_IDENT_STR = "ident";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	private long mrid;
	
	private long mid;
	
	private long miid;
	
	private long mpId;
	
	private int ident;
	
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
	
	private int status;
	
	private int balanceType;
	
	private float prePoint;
	
	private String comment;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mrid")
	public long getMrid() {
		return mrid;
	}

	public void setMrid(long mrid) {
		this.mrid = mrid;
	}

	@Column(name = "mid")
	public long getMid() {
		return mid;
	}

	public void setMid(long mid) {
		this.mid = mid;
	}

	@Column(name = "miid")
	public long getMiid() {
		return miid;
	}

	public void setMiid(long miid) {
		this.miid = miid;
	}

	@Column(name = "mpId")
	public long getMpId() {
		return mpId;
	}

	public void setMpId(long mpId) {
		this.mpId = mpId;
	}

	@Column(name = "ident")
	public int getIdent() {
		return ident;
	}

	public void setIdent(int ident) {
		this.ident = ident;
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
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Column(name = "balanceType")
	public int getBalanceType() {
		return balanceType;
	}

	public void setBalanceType(int balanceType) {
		this.balanceType = balanceType;
	}
	
	@Column(name = "prePoint")
	public float getPrePoint() {
		return prePoint;
	}

	public void setPrePoint(float prePoint) {
		this.prePoint = prePoint;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}