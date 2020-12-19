package com.fanglin.sales.po;

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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "salesdeliveryitem", catalog = "sales")
public class SalesDeliveryItemPO implements Serializable {

	private static final long serialVersionUID = -7485323050460149431L;

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_SDIID_STR = "sdiid";

	public static final String COLUMN_SALESNO_STR = "sales.no";
	
	public static final String COLUMN_SALESORDERID_STR = "sales.orderId";
	
	public static final String COLUMN_SALESBRAND_STR = "sales.brand";
	
	public static final String COLUMN_SALESCATEGROY_STR = "sales.category";
	
	public static final String COLUMN_SIID_LONG = "salesItem.siid";
	
	public static final String COLUMN_GOODSNAME_STR = "goods.name";
	
	public static final String COLUMN_TRANERID_STR = "traner.userId";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_TRAN_INT = 1;

	public static final short STATUS_CHECK_INT = 2;

	public static final short STATUS_CONFIRM_INT = 3;

	public static final short STATUS_FINISH_INT = 4;

	private long sdiid;

	private SalesPO sales;

	private SalesItemPO salesItem;

	private short status;

	private Timestamp createTime;

	private Timestamp tranTime;

	private Timestamp checkTime;

	private Timestamp confirmTime;

	private Timestamp finishTime;

	private UserPO traner;

	private UserPO checker;

	private UserPO confirmer;

	private UserPO finisher;

	private String comment;

	private int company;

	public SalesDeliveryItemPO() {
		super();
	}

	public SalesDeliveryItemPO(long sdiid, SalesPO sales, SalesItemPO salesItem, short status, Timestamp createTime, Timestamp tranTime, Timestamp checkTime, Timestamp confirmTime, Timestamp finishTime, UserPO traner, UserPO checker, UserPO confirmer, UserPO finisher, String comment, int company) {
		super();
		this.sdiid = sdiid;
		this.sales = sales;
		this.salesItem = salesItem;
		this.status = status;
		this.createTime = createTime;
		this.tranTime = tranTime;
		this.checkTime = checkTime;
		this.confirmTime = confirmTime;
		this.finishTime = finishTime;
		this.traner = traner;
		this.checker = checker;
		this.confirmer = confirmer;
		this.finisher = finisher;
		this.comment = comment;
		this.company = company;
	}

	@Id
	@GeneratedValue
	@Column(name = "sdiid")
	public long getSdiid() {
		return sdiid;
	}

	public void setSdiid(long sdiid) {
		this.sdiid = sdiid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sid", referencedColumnName = "sid")
	public SalesPO getSales() {
		return sales;
	}

	public void setSales(SalesPO sales) {
		this.sales = sales;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siid", referencedColumnName = "siid")
	public SalesItemPO getSalesItem() {
		return salesItem;
	}

	public void setSalesItem(SalesItemPO salesItem) {
		this.salesItem = salesItem;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "tranTime")
	public Timestamp getTranTime() {
		return tranTime;
	}

	public void setTranTime(Timestamp tranTime) {
		this.tranTime = tranTime;
	}

	@Column(name = "checkTime")
	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tuid", referencedColumnName = "uid")
	public UserPO getTraner() {
		return traner;
	}

	public void setTraner(UserPO traner) {
		this.traner = traner;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chuid", referencedColumnName = "uid")
	public UserPO getChecker() {
		return checker;
	}

	public void setChecker(UserPO checker) {
		this.checker = checker;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "couid", referencedColumnName = "uid")
	public UserPO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserPO confirmer) {
		this.confirmer = confirmer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fuid", referencedColumnName = "uid")
	public UserPO getFinisher() {
		return finisher;
	}

	public void setFinisher(UserPO finisher) {
		this.finisher = finisher;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
