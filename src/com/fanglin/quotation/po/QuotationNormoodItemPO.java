package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.GoodsPO;

@Entity
@Table(name = "quotationnormooditem", catalog = "quotation")
public class QuotationNormoodItemPO implements Serializable {

	private static final long serialVersionUID = -7353897102057094950L;

	public static final short TYPE_OFFER_INT = 0;

	public static final short NORMTYPE_PACK_INT = 1;

	public static final short ATTTYPE_COLLECTION_INT = 0;

	private long qngiid;

	private long qid;

	private long sid;

	private long areald;

	private long quoteld;

	private long qiid;

	private short type;

	private short normtype;

	private short atttype;

	private GoodsPO goods;

	private String normunit;

	private int normnum;

	private String storeunit;

	private int storenum;

	public QuotationNormoodItemPO() {
		super();
	}

	public QuotationNormoodItemPO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "qngiid")
	public long getQngiid() {
		return qngiid;
	}

	public void setQngiid(long qngiid) {
		this.qngiid = qngiid;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "areald")
	public long getAreald() {
		return areald;
	}

	public void setAreald(long areald) {
		this.areald = areald;
	}

	@Column(name = "quoteld")
	public long getQuoteld() {
		return quoteld;
	}

	public void setQuoteld(long quoteld) {
		this.quoteld = quoteld;
	}

	@Column(name = "qiid")
	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "normtype")
	public short getNormtype() {
		return normtype;
	}

	public void setNormtype(short normtype) {
		this.normtype = normtype;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@Column(name = "normunit")
	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	@Column(name = "normnum")
	public int getNormnum() {
		return normnum;
	}

	public void setNormnum(int normnum) {
		this.normnum = normnum;
	}

	@Column(name = "storeunit")
	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	@Column(name = "storenum")
	public int getStorenum() {
		return storenum;
	}

	public void setStorenum(int storenum) {
		this.storenum = storenum;
	}

}
