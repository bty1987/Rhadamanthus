package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "selection", catalog = "quotation")
public class SelectionDO implements Serializable {

	private static final long serialVersionUID = -1966474753738725031L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_QID_STR = "qid";

	public static final short STATUS_LOCK_INT = 1;// 状态, 锁定

	public static final short STATUS_INIT_INT = 0;// 状态, 初始

	private long sid;// 选材单ID

	private long qid;// 报价ID

	private DecorationPO decoration;

	private long total;// 总额

	private long quotationTotal;// 报价总额

	private long extensionAddTotal;// 拓展增总额

	private long extensionReduceTotal;// 拓展减总额

	private long addReduceAddTotal;// 增减增总额

	private long addReduceMinusTotal;// 增减减总额

	private Timestamp createTime;// 创建时间

	private Timestamp affirmTime;// 确认时间

	private UserPO creater;

	private UserPO splitter;

	private UserPO traner;

	private short status;// 状态 , 0: 初始 , 1: 锁定

	private short isAffirm;// 是否确认 , 0: 未确认 , 1: 客户确认

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "isAffirm")
	public short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(short isAffirm) {
		this.isAffirm = isAffirm;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "quotationTotal")
	public long getQuotationTotal() {
		return quotationTotal;
	}

	public void setQuotationTotal(long quotationTotal) {
		this.quotationTotal = quotationTotal;
	}

	@Column(name = "extensionAddTotal")
	public long getExtensionAddTotal() {
		return extensionAddTotal;
	}

	public void setExtensionAddTotal(long extensionAddTotal) {
		this.extensionAddTotal = extensionAddTotal;
	}

	@Column(name = "extensionReduceTotal")
	public long getExtensionReduceTotal() {
		return extensionReduceTotal;
	}

	public void setExtensionReduceTotal(long extensionReduceTotal) {
		this.extensionReduceTotal = extensionReduceTotal;
	}

	@Column(name = "addReduceAddTotal")
	public long getAddReduceAddTotal() {
		return addReduceAddTotal;
	}

	public void setAddReduceAddTotal(long addReduceAddTotal) {
		this.addReduceAddTotal = addReduceAddTotal;
	}

	@Column(name = "addReduceMinusTotal")
	public long getAddReduceMinusTotal() {
		return addReduceMinusTotal;
	}

	public void setAddReduceMinusTotal(long addReduceMinusTotal) {
		this.addReduceMinusTotal = addReduceMinusTotal;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "affirmTime")
	public Timestamp getAffirmTime() {
		return affirmTime;
	}

	public void setAffirmTime(Timestamp affirmTime) {
		this.affirmTime = affirmTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "suid", referencedColumnName = "uid")
	public UserPO getSplitter() {
		return splitter;
	}

	public void setSplitter(UserPO splitter) {
		this.splitter = splitter;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "tuid", referencedColumnName = "uid")
	public UserPO getTraner() {
		return traner;
	}

	public void setTraner(UserPO traner) {
		this.traner = traner;
	}

}
