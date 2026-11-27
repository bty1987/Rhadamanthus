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

import com.fanglin.data.po.NoodsPO;

/**
 * 定额材料明细原表实体(normooditem1, 分表路由 index=1)。
 * 结构照 qfai 正统(QuotationFunctionAreaItemPO0): extends 字段基类 NormoodItemPO(纯类),
 * 字段与@Id全重声明 —— 各实体独立根实体, 禁止实体间extends(启动SingleTableSubclass炸已实证)。
 */
@Entity
@Table(name = "normooditem1", catalog = "quotation")
public class NormoodItemPO1 extends NormoodItemPO implements Serializable {

	private static final long serialVersionUID = 1495497405192428115L;

	private long ngiid;

	private long qid;

	private long sid;

	private long areald;

	private long quoteld;

	private long qiid;

	private long ngid;

	private short type;

	private short normtype;

	private short atttype;

	private NoodsPO noods;

	private String normunit;

	private int normnum;

	private String storeunit;

	private int storenum;

	private short status;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ngiid")
	public long getNgiid() {
		return ngiid;
	}

	public void setNgiid(long ngiid) {
		this.ngiid = ngiid;
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

	@Column(name = "ngid")
	public long getNgid() {
		return ngid;
	}

	public void setNgid(long ngid) {
		this.ngid = ngid;
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
	@JoinColumn(name = "nid", referencedColumnName = "nid")
	public NoodsPO getNoods() {
		return noods;
	}

	public void setNoods(NoodsPO noods) {
		this.noods = noods;
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

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
