package com.fanglin.production.po;
import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
@Entity
@Table(name = "quoteitem" , catalog = "production")
public class PuoteItemPO implements Serializable {

	private static final long serialVersionUID = -1781071815606052938L;

	public static final short STATUS_UNLOCK_SHORT = 0;
	
	public static final short STATUS_LOCK_SHORT = 1;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_PINYIN_STR = "pinyin";
	
	public static final String COLUMN_QUOTETYPENAME_STR = "quoteType.name";
    
	public static final String COLUMN_COMPANY_INT = "company";
	
	private long qiid;
	
	private String name;
	
	private String pinyin;
	
	private String format;
	
	private String measurementunit;
	
	private short status;

	private float unitprice;
	
	private int company;
	
	private QuoteTypePO quoteType;
	
	public PuoteItemPO() {
		super();
	}
	
	public PuoteItemPO(QuoteTypePO quoteType) {
		super();
		this.quoteType = quoteType;
	}


	@Id
	@GeneratedValue
	@Column(name="qiid")
	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}
    @Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}
	@Column(name = "format")
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}
	@Column(name = "measurementunit")
	public String getMeasurementunit() {
		return measurementunit;
	}

	public void setMeasurementunit(String measurementunit) {
		this.measurementunit = measurementunit;
	}
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
	@Column(name = "unitprice")
	public float getUnitprice() {
		return unitprice;
	}


	public void setUnitprice(float unitprice) {
		this.unitprice = unitprice;
	}


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "qtid", referencedColumnName="qtid")
	public QuoteTypePO getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(QuoteTypePO quoteType) {
		this.quoteType = quoteType;
	}
	
	
}
