package com.fanglin.production.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotationItem", catalog = "production")
public class PuotationItemPO implements Serializable {

	private static final long serialVersionUID = 522706962469078583L;

	public static final String COLUMN_QID_STR = "qid";

	public static final String COLUMN_QIID_STR = "qiid";

	private long qiid;

	private long qid;

	private String name;

	private String format;

	private int height;

	private int width;

	private int thick;

	private int unitPrice;

	private int num;

	private long total;

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
	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	@Column(name = "width")
	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	@Column(name = "thick")
	public int getThick() {
		return thick;
	}

	public void setThick(int thick) {
		this.thick = thick;
	}

	@Column(name = "unitprice")
	public int getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(int unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
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
