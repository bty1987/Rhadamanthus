package com.fanglin.quotation.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotationmaterialitem", catalog = "platform")
public class QuotationMaterialItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -133292708707160108L;
	
	public static final String COLUMN_QID_STR = "qid";
	
	public static final short STATUS_INIT_INT = 0;
	
	public static final short STATUS_UPGRADE_INT = 1;
	
	public static final short STATUS_DISCOUNT_INT = 2;

	private long qmiId;
	
	private long qid;
	
	private String no;
	
	private String name;
	
	private String category;
	
	private String brand;
	
	private String measurementUnit;
	
	private float price;
	
	private float diff;
	
	private short status;
	
	private String des;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qmiId")
	public long getQmiId() {
		return this.qmiId;
	}

	public void setQmiId(long qmiId) {
		this.qmiId = qmiId;
	}

	@Column(name = "qid")
	public long getQid() {
		return this.qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "no")
	public String getNo() {
		return this.no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "category")
	public String getCategory() {
		return this.category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Column(name = "brand")
	public String getBrand() {
		return this.brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	@Column(name = "measurementUnit")
	public String getMeasurementUnit() {
		return this.measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@Column(name = "price")
	public float getPrice() {
		return this.price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	@Column(name = "diff")
	public float getDiff() {
		return this.diff;
	}

	public void setDiff(float diff) {
		this.diff = diff;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "des")
	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

}