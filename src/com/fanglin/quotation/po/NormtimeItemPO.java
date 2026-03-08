package com.fanglin.quotation.po;

import java.io.Serializable;
import java.math.BigDecimal;

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
@Table(name = "normtimeitem", catalog = "quotation")
public class NormtimeItemPO implements Serializable {

	private static final long serialVersionUID = 1650807063740164251L;

	public static final short TYPE_OFFER_INT = 0;

	public static final short TYPE_EXPAND_INT = 1;

	public static final short TYPE_ADDCUT_INT = 2;

	public static final short TYPE_QUOTA_INT = 3;

	public static final short NORMTYPE_WORKDAYS_INT = 0;

	public static final short NORMTYPE_ADD_INT = 1;

	public static final short ATTTYPE_COLLECTION_INT = 0;

	public static final short ATTTYPE_SUB_INT = 1;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_DISABLED_INT = 1;

	private long ntiid;

	private long qid;

	private long sid;

	private long areald;

	private long quoteld;

	private long qiid;

	private long ntid;

	private short type;

	private short normtype;

	private short atttype;

	private ConstructionNodePO constructionNode;

	private String name;

	private String unit;

	private int trannum;

	private BigDecimal workdays;

	private int num;

	private short status;

	public NormtimeItemPO() {
		super();
	}

	public NormtimeItemPO(ConstructionNodePO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ntiid")
	public long getNtiid() {
		return ntiid;
	}

	public void setNtiid(long ntiid) {
		this.ntiid = ntiid;
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

	@Column(name = "ntid")
	public long getNtid() {
		return ntid;
	}

	public void setNtid(long ntid) {
		this.ntid = ntid;
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

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	@Column(name = "workdays", precision = 10, scale = 2)
	public BigDecimal getWorkdays() {
		return workdays;
	}

	public void setWorkdays(BigDecimal workdays) {
		this.workdays = workdays;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
}
