package com.fanglin.sales.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "salesbalance", catalog = "sales")
public class SalesBalancePO implements Serializable {

	private static final long serialVersionUID = -334568283189550919L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_DELIVERSTATUS_STR = "deliverStatus";

	public static final String COLUMN_VERIFYSTATUS_STR = "verifyStatus";

	public static final String COLUMN_CONFIRMSTATUS_STR = "confirmStatus";

	public static final String COLUMN_TYPE_STR = "type";

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

	public static final short TYPE_BALANCE_INT = 4;

	public static final short ONETYPE_INIT_INT = 0;

	public static final short ONETYPE_REFUND_INT = 1;

	public static final short ONETYPE_ALLBACK_INT = 2;

	public static final short ONETYPE_DBACKORDER_INT = 3;

	public static final short CHECKSTATUS_INIT_INT = 0;

	public static final short CHECKSTATUS_CHECK_INT = 1;

	public static final short DELIVERSTATUS_PART_INT = 1;

	public static final short DELIVERSTATUS_ALL_INT = 2;

	public static final short DELIVERYSCHEDULE_NONE_INT = -1;

	private long sbid;

	private SalesPO sales;

	private SalesRefundsPO refunds;

	private UserPO creater;

	private Timestamp createTime;

	private UserPO poster;

	private UserPO salesman;

	private DepartmentPO dept;

	private DepartmentPO region;

	private BrandPO brand;

	private Timestamp postTime;

	private UserPO voster;// 厂商结算人

	private Timestamp venderTime;

	private UserPO checker;

	private Timestamp checkTime;

	private long allowance;

	private long coupon;

	private long total;

	private long balance;

	private long difference;

	private long vbalance;

	private long pbalance;

	private int rate;

	private short type;

	private short onetype;

	private short status;

	private short deliverStatus;

	private short confirmStatus;

	private short verifyStatus;

	private short checkStatus;

	private short deliverSchedule;

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

	public SalesBalancePO(SalesPO sales, UserPO creater, UserPO poster, UserPO salesman, DepartmentPO dept, DepartmentPO region, BrandPO brand) {
		super();
		this.sales = sales;
		this.creater = creater;
		this.poster = poster;
		this.salesman = salesman;
		this.dept = dept;
		this.region = region;
		this.brand = brand;
	}

	public SalesBalancePO(SalesPO sales, SalesRefundsPO refunds, UserPO creater, UserPO poster, UserPO salesman, DepartmentPO dept, DepartmentPO region) {
		super();
		this.sales = sales;
		this.refunds = refunds;
		this.creater = creater;
		this.poster = poster;
		this.salesman = salesman;
		this.dept = dept;
		this.region = region;
	}

	public SalesBalancePO(SalesPO sales, SalesRefundsPO refunds, UserPO creater, UserPO poster, UserPO salesman, DepartmentPO dept, DepartmentPO region, UserPO voster) {
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
	public SalesRefundsPO getRefunds() {
		return refunds;
	}

	public void setRefunds(SalesRefundsPO refunds) {
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
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

	@Column(name = "coupon")
	public long getCoupon() {
		return coupon;
	}

	public void setCoupon(long coupon) {
		this.coupon = coupon;
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

	@Column(name = "rate")
	public int getRate() {
		return rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
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

	@Column(name = "deliverStatus")
	public short getDeliverStatus() {
		return deliverStatus;
	}

	public void setDeliverStatus(short deliverStatus) {
		this.deliverStatus = deliverStatus;
	}

	@Column(name = "confirmStatus")
	public short getConfirmStatus() {
		return confirmStatus;
	}

	public void setConfirmStatus(short confirmStatus) {
		this.confirmStatus = confirmStatus;
	}

	@Column(name = "verifyStatus")
	public short getVerifyStatus() {
		return verifyStatus;
	}

	public void setVerifyStatus(short verifyStatus) {
		this.verifyStatus = verifyStatus;
	}

	@Column(name = "checkStatus")
	public short getCheckStatus() {
		return checkStatus;
	}

	public void setCheckStatus(short checkStatus) {
		this.checkStatus = checkStatus;
	}

	@Column(name = "deliverSchedule")
	public short getDeliverSchedule() {
		return deliverSchedule;
	}

	public void setDeliverSchedule(short deliverSchedule) {
		this.deliverSchedule = deliverSchedule;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public SalesBalanceVO ptv(SalesBalanceVO salesBalanceVO) {

		BeanUtil.copyPropertie(this, salesBalanceVO, Arrays.asList("sales", "refunds", "brand", "creater", "poster", "salesman", "dept", "region", "brand", "checker", "voster"));

		if (salesBalanceVO.getSalesman() != null && getSalesman() != null) salesBalanceVO.getSalesman().setBaseInfo(getSalesman());
		if (salesBalanceVO.getDept() != null && getDept() != null) getDept().ptv(salesBalanceVO.getDept());
		if (salesBalanceVO.getRegion() != null && getRegion() != null) getRegion().ptv(salesBalanceVO.getRegion());
		if (salesBalanceVO.getBrand() != null && getBrand() != null) getBrand().ptv(salesBalanceVO.getBrand());

		if (salesBalanceVO.getRefunds() != null && getRefunds() != null) getRefunds().ptv(salesBalanceVO.getRefunds());
		if (salesBalanceVO.getCreater() != null && getCreater() != null) salesBalanceVO.getCreater().setBaseInfo(getCreater());
		if (salesBalanceVO.getPoster() != null && getPoster() != null) salesBalanceVO.getPoster().setBaseInfo(getPoster());
		if (salesBalanceVO.getChecker() != null && getChecker() != null) salesBalanceVO.getChecker().setBaseInfo(getChecker());
		if (salesBalanceVO.getVoster() != null && getVoster() != null) salesBalanceVO.getVoster().setBaseInfo(getVoster());

		if (salesBalanceVO.getSales() != null && getSales() != null) getSales().ptv(salesBalanceVO.getSales());

		return salesBalanceVO;
	}
}
