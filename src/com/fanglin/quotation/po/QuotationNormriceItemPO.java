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

import com.fanglin.data.po.ConstructionNodePO;

@Entity
@Table(name = "quotationnormpiceitem", catalog = "quotation")
public class QuotationNormriceItemPO implements Serializable {

	private static final long serialVersionUID = 1650807063740164250L;

	public static final short TYPE_OFFER_INT = 0;

	public static final short NORMTYPE_ADD_INT = 1;

	public static final short ATTTYPE_COLLECTION_INT = 0;

	private long qnpiid;

	private long qid;

	private long sid;

	private long areald;

	private long quoteld;

	private long qiid;

	private short type;

	private short normtype;

	private short atttype;

	private ConstructionNodePO constructionNode;

	private String unit;

	private int trannum;

	private int salary;

	public QuotationNormriceItemPO() {
		super();
	}

	public QuotationNormriceItemPO(ConstructionNodePO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "qnpiid")
	public long getQnpiid() {
		return qnpiid;
	}

	public void setQnpiid(long qnpiid) {
		this.qnpiid = qnpiid;
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
	@JoinColumn(nullable = true, name = "cnid", referencedColumnName = "cnid")
	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}

	@Column(name = "unit")
	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@Column(name = "trannum")
	public int getTrannum() {
		return trannum;
	}

	public void setTrannum(int trannum) {
		this.trannum = trannum;
	}

	@Column(name = "salary")
	public int getSalary() {
		return salary;
	}

	public void setSalary(int salary) {
		this.salary = salary;
	}

}
