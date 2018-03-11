package com.fanglin.sales.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "salesbalance", catalog = "sales")
public class SalesBalancePO implements Serializable{

	private static final long serialVersionUID = -334568283189550919L;
	
	public static final String COLUMN_ORDERID_STR= "sales.orderId";
	
	public static final String COLUMN_SALESNO_STR = "sales.no";
	
	public static final String COLUMN_SALESBRAND_STR = "sales.brand";
	
	public static final String COLUMN_SALESVILLAGE_STR = "village.no";
	
	public static final String COLUMN_SALESREGION_STR = "region.deptName";
	
	public static final String COLUMN_SALESDEPT_STR = "dept.deptName";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_SALESFULLPAYTIME_STR = "sales.fullpayTime";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	public static final String COLUMN_VENDERTIME_STR ="venderTime";
	
	public static final String COLUMN_POSTTIME_STR = "postTime";
	
	public static final short STATUS_PREBALANCE_INT = 0;
	
	public static final short STATUS_VENDORBALANCE_INT = 1;
	
	public static final short STATUS_BALANCE_INT = 2;
	
	public static final short TYPE_INIT_INT = 0;
	
	public static final short TYPE_PREBALANCEREFUNDS_INT = 1;
	
	public static final short TYPE_BALANCEREFUNDS_INT = 2;
	
	private long sbid;
	
	private SalesPO sales;
	
	private RefundsPO refunds;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private UserPO poster;
	
	private Timestamp postTime;
	
	private Timestamp venderTime;
	
	private float total;
	
	private float balance;
	
	private float difference;
	
	private float vbalance;
	
	private float pbalance;
	
	private short type;
	
	private short status;
	
	private String comment;
	
	public SalesBalancePO() {
		super();
	}

	public SalesBalancePO(SalesPO sales, UserPO creater, UserPO poster) {
		super();
		this.sales = sales;
		this.creater = creater;
		this.poster = poster;
	}

	public SalesBalancePO(SalesPO sales, RefundsPO refunds, UserPO creater,
			UserPO poster) {
		super();
		this.sales = sales;
		this.refunds = refunds;
		this.creater = creater;
		this.poster = poster;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sbid")
	public long getSbid() {
		return sbid;
	}

	public void setSbid(long sbid) {
		this.sbid = sbid;
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
	@JoinColumn(name = "rid", referencedColumnName = "rid")
	public RefundsPO getRefunds() {
		return refunds;
	}

	public void setRefunds(RefundsPO refunds) {
		this.refunds = refunds;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "puid", referencedColumnName = "uid")
	public UserPO getPoster() {
		return poster;
	}

	public void setPoster(UserPO poster) {
		this.poster = poster;
	}

	@Column(name = "postTime")
	public Timestamp getPostTime() {
		return postTime;
	}

	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
	}

	@Column(name = "venderTime")
	public Timestamp getVenderTime() {
		return venderTime;
	}

	public void setVenderTime(Timestamp venderTime) {
		this.venderTime = venderTime;
	}

	@Column(name = "total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	@Column(name = "balance")
	public float getBalance() {
		return balance;
	}

	public void setBalance(float balance) {
		this.balance = balance;
	}

	@Column(name = "difference")
	public float getDifference() {
		return difference;
	}

	public void setDifference(float difference) {
		this.difference = difference;
	}

	@Column(name = "vbalance")
	public float getVbalance() {
		return vbalance;
	}

	public void setVbalance(float vbalance) {
		this.vbalance = vbalance;
	}

	@Column(name = "pbalance")
	public float getPbalance() {
		return pbalance;
	}

	public void setPbalance(float pbalance) {
		this.pbalance = pbalance;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
