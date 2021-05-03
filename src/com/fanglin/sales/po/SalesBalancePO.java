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

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "salesbalance", catalog = "sales")
public class SalesBalancePO implements Serializable {

	private static final long serialVersionUID = -334568283189550919L;

	public static final String COLUMN_ORDERID_STR = "sales.orderId";

	public static final String COLUMN_SALESNO_STR = "sales.no";

	public static final String COLUMN_SALESBRAND_STR = "sales.brand";

	public static final String COLUMN_SALESVILLAGE_STR = "village.no";

	public static final String COLUMN_SALESREGION_STR = "region.name";

	public static final String COLUMN_SALESDEPT_STR = "dept.name";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_SALESFULLPAYTIME_STR = "sales.fullpayTime";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_VENDERTIME_STR = "venderTime";

	public static final String COLUMN_POSTTIME_STR = "postTime";

	public static final String COLUMN_SALESCOMPANY_STR = "sales.company";

	public static final String COLUMN_SALESDOMPANY_STR = "sales.dompany";

	public static final String COLUMN_SALESPOMPANY_STR = "sales.pompany";

	public static final short STATUS_PREBALANCE_INT = 0;

	public static final short STATUS_VENDORBALANCE_INT = 1;

	public static final short STATUS_BALANCE_INT = 2;

	public static final short TYPE_INIT_INT = 0;

	public static final short TYPE_PREBALANCEREFUNDS_INT = 1;

	public static final short TYPE_BALANCEREFUNDS_INT = 2;

	public static final short TYPE_DEPOSITPAY_INT = 3;

	public static final short ONETYPE_INIT_INT = 0;

	public static final short ONETYPE_REFUND_INT = 1;

	public static final short ONETYPE_ALLBACK_INT = 2;

	public static final short ONETYPE_DBACKORDER_INT = 3;

	public static final short CHECKSTATUS_INIT_INT = 0;

	public static final short CHECKSTATUS_CHECK_INT = 1;

	private long sbid;

	private SalesPO sales;

	private RefundsPO refunds;

	private UserPO creater;

	private Timestamp createTime;

	private UserPO poster;

	private UserPO salesman;

	private DepartmentPO dept;

	private DepartmentPO region;

	private Timestamp postTime;
	
	private UserPO voster;//厂商结算人

	private Timestamp venderTime;

	private UserPO checker;

	private Timestamp checkTime;

	private long allowance;

	private long total;

	private long balance;

	private long difference;

	private long vbalance;

	private long pbalance;

	private short type;

	private short onetype;

	private short status;

	private short checkStatus;

	private String comment;

	public SalesBalancePO() {
		super();
	}

	public SalesBalancePO(SalesPO sales, UserPO creater, UserPO poster, UserPO salesman, DepartmentPO dept, DepartmentPO region) {
		super();
		this.sales = sales;
		this.creater = creater;
		this.poster = poster;
		this.salesman = salesman;
		this.dept = dept;
		this.region = region;
	}

	public SalesBalancePO(SalesPO sales, RefundsPO refunds, UserPO creater, UserPO poster, UserPO salesman, DepartmentPO dept, DepartmentPO region) {
		super();
		this.sales = sales;
		this.refunds = refunds;
		this.creater = creater;
		this.poster = poster;
		this.salesman = salesman;
		this.dept = dept;
		this.region = region;
	}
	
	public SalesBalancePO(SalesPO sales, RefundsPO refunds, UserPO creater, UserPO poster, UserPO salesman, DepartmentPO dept, DepartmentPO region, UserPO voster) {
		super();
		this.sales = sales;
		this.refunds = refunds;
		this.creater = creater;
		this.poster = poster;
		this.salesman = salesman;
		this.dept = dept;
		this.region = region;
		this.voster = voster;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "suid", referencedColumnName = "uid")
	public UserPO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserPO salesman) {
		this.salesman = salesman;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "did", referencedColumnName = "did")
	public DepartmentPO getDept() {
		return dept;
	}

	public void setDept(DepartmentPO dept) {
		this.dept = dept;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "drid", referencedColumnName = "did")
	public DepartmentPO getRegion() {
		return region;
	}

	public void setRegion(DepartmentPO region) {
		this.region = region;
	}

	@Column(name = "postTime")
	public Timestamp getPostTime() {
		return postTime;
	}

	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vuid", referencedColumnName = "uid")
	public UserPO getVoster() {
		return voster;
	}

	public void setVoster(UserPO voster) {
		this.voster = voster;
	}

	@Column(name = "venderTime")
	public Timestamp getVenderTime() {
		return venderTime;
	}

	public void setVenderTime(Timestamp venderTime) {
		this.venderTime = venderTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chuid", referencedColumnName = "uid")
	public UserPO getChecker() {
		return checker;
	}

	public void setChecker(UserPO checker) {
		this.checker = checker;
	}

	@Column(name = "checkTime")
	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	@Column(name = "allowance")
	public long getAllowance() {
		return allowance;
	}

	public void setAllowance(long allowance) {
		this.allowance = allowance;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "balance")
	public long getBalance() {
		return balance;
	}

	public void setBalance(long balance) {
		this.balance = balance;
	}

	@Column(name = "difference")
	public long getDifference() {
		return difference;
	}

	public void setDifference(long difference) {
		this.difference = difference;
	}

	@Column(name = "vbalance")
	public long getVbalance() {
		return vbalance;
	}

	public void setVbalance(long vbalance) {
		this.vbalance = vbalance;
	}

	@Column(name = "pbalance")
	public long getPbalance() {
		return pbalance;
	}

	public void setPbalance(long pbalance) {
		this.pbalance = pbalance;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "onetype")
	public short getOnetype() {
		return onetype;
	}

	public void setOnetype(short onetype) {
		this.onetype = onetype;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "checkStatus")
	public short getCheckStatus() {
		return checkStatus;
	}

	public void setCheckStatus(short checkStatus) {
		this.checkStatus = checkStatus;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
