package com.fanglin.production.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "quotationItem" , catalog = "production")
public class PuotationItemPO  implements Serializable {

	private static final long serialVersionUID = 522706962469078583L;
	
	public static final String COLUMN_QID_STR = "qid";
	
	public static final String COLUMN_QIID_STR = "qiid";
	
	private long qiid;
	
	private long qid;
	
	private String name; 
	
	private String format;
	
	private float height;
	
	private float width;
	
	private float thick;
	
	private float unitPrice;
	
	private float num;
	
	private float total;
	
	private String measurementUnit;
	
	private String comment;
	
	private String specil;
	
	private String quoteType;
	

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qiid")
	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "format")
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	@Column(name = "height")
	public float getHeight() {
		return height;
	}

	public void setHeight(float height) {
		this.height = height;
	}

	@Column(name = "width")
	public float getWidth() {
		return width;
	}

	public void setWidth(float width) {
		this.width = width;
	}

	@Column(name = "thick")
	public float getThick() {
		return thick;
	}

	public void setThick(float thick) {
		this.thick = thick;
	}

	@Column(name = "unitprice")
	public float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice) {
		this.unitPrice = unitPrice;
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

	@Column(name = "measurementunit")
	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "specil")
	public String getSpecil() {
		return specil;
	}

	public void setSpecil(String specil) {
		this.specil = specil;
	}

	@Column(name = "qtid")
	public String getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(String quoteType) {
		this.quoteType = quoteType;
	}
	
}
