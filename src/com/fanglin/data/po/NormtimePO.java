package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "normtime", catalog = "data")
public class NormtimePO implements Serializable {

	private static final long serialVersionUID = -7988435531109348844L;

	public static final String COLUMN_QIID_STR = "quotationItem.qiid";

	public static final String COLUMN_QUOTATIONITEMNAME_STR = "quotationItem.name";

	public static final String COLUMN_QUOTATIONVERSION_STR = "quotationItem.quotationVersion.no";

	public static final String COLUMN_CONSTRUCTIONNODENAME_STR = "constructionNode.name";

	public static final short STATUS_VALID_STR = 0;

	public static final short STATUS_INVALID_STR = 1;

	private long ntid;// 定额工期id

	private QuotationItemPO quotationItem;// 报价id

	private ConstructionNodePO constructionNode;// 施工节点

	private String unit;

	private int trannum;

	private BigDecimal workdays;// 工时天数

	private short status;// 状态

	public NormtimePO() {
		super();
	}

	public NormtimePO(QuotationItemPO quotationItem, ConstructionNodePO constructionNode) {
		super();
		this.quotationItem = quotationItem;
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ntid")
	public long getNtid() {
		return ntid;
	}

	public void setNtid(long ntid) {
		this.ntid = ntid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "qiid", referencedColumnName = "qiid")
	public QuotationItemPO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemPO quotationItem) {
		this.quotationItem = quotationItem;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cnid", referencedColumnName = "cnid")
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

	@Column(name = "workdays", precision = 10, scale = 2)
	public BigDecimal getWorkdays() {
		return workdays;
	}

	public void setWorkdays(BigDecimal workdays) {
		this.workdays = workdays;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
