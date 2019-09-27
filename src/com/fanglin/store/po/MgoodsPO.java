package com.fanglin.store.po;

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
@Table(name = "mgoods", catalog = "store")
public class MgoodsPO implements Serializable {

	private static final long serialVersionUID = -4319485362492429004L;

	public static final String COLUMN_GID_STR = "gid";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_BID_STR = "mbrand.bid";

	public static final short STATUS_ABLE_SHORT = 0;

	public static final short STATUS_DISABLE_SHORT = 1;

	private long gid;

	private String no;

	private String name;

	private String pinyin;

	private MbrandPO mbrand;

	private String barcode;

	private String title;

	private String defaultImg;

	private long price;

	private short status;

	public MgoodsPO() {
		super();
	}

	public MgoodsPO(MbrandPO mbrand) {
		super();
		this.mbrand = mbrand;
	}

	@Id
	@GeneratedValue
	@Column(name = "gid")
	public long getGid() {
		return gid;
	}

	public void setGid(long gid) {
		this.gid = gid;
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

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bid", referencedColumnName = "bid")
	public MbrandPO getMbrand() {
		return mbrand;
	}

	public void setMbrand(MbrandPO mbrand) {
		this.mbrand = mbrand;
	}

	@Column(name = "barcode")
	public String getBarcode() {
		return barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "defaultImg")
	public String getDefaultImg() {
		return defaultImg;
	}

	public void setDefaultImg(String defaultImg) {
		this.defaultImg = defaultImg;
	}

	@Column(name = "price")
	public long getPrice() {
		return price;
	}

	public void setPrice(long price) {
		this.price = price;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
