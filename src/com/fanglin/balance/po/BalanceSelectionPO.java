package com.fanglin.balance.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.balance.vo.BalanceSelectionVO;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "balanceselection", catalog = "balance")
public class BalanceSelectionPO implements java.io.Serializable {

	private static final long serialVersionUID = 994632463610008703L;

	public static final String COLUMN_BALANCE_STR = "balance.bid";

	public static final String COLUMN_CUID_STR = "cuid";

	public static final String COLUMN_GRADE_STR = "grade";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_NAME_STR = "name";

	public static final short STATUS_INIT_INT = 0;// 初始

	public static final short STATUS_UNLOCK_INT = 1;// 锁定

	public static final short STATUS_WAIT_INT = 2;// 待审

	public static final short STATUS_ENABLE_CHECK_INT = 3;// 审核

	private long bsid;

	private long bid;

	private String name;

	private BrandPO brand;

	private String grade;

	private long income;

	private long cost;

	private long payment;

	private long profit;

	private int discount;

	private UserPO creater;

	private UserPO auditer;

	private UserPO balancer;

	private Timestamp createTime;

	private Timestamp lockTime;

	private Timestamp auditTime;

	private Timestamp balanceTime;

	private short status;

	private short atttype;

	private int company;

	public BalanceSelectionPO() {
		super();
	}

	public BalanceSelectionPO(BrandPO brand) {
		super();
		this.brand = brand;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bsid")
	public long getBsid() {
		return bsid;
	}

	public void setBsid(long bsid) {
		this.bsid = bsid;
	}

	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "brid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	@Column(name = "grade")
	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	@Column(name = "income")
	public long getIncome() {
		return income;
	}

	public void setIncome(long income) {
		this.income = income;
	}

	@Column(name = "cost")
	public long getCost() {
		return cost;
	}

	public void setCost(long cost) {
		this.cost = cost;
	}

	@Column(name = "payment")
	public long getPayment() {
		return payment;
	}

	public void setPayment(long payment) {
		this.payment = payment;
	}

	@Column(name = "profit")
	public long getProfit() {
		return profit;
	}

	public void setProfit(long profit) {
		this.profit = profit;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "auid", referencedColumnName = "uid")
	public UserPO getAuditer() {
		return auditer;
	}

	public void setAuditer(UserPO auditer) {
		this.auditer = auditer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "buid", referencedColumnName = "uid")
	public UserPO getBalancer() {
		return balancer;
	}

	public void setBalancer(UserPO balancer) {
		this.balancer = balancer;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "lockTime")
	public Timestamp getLockTime() {
		return lockTime;
	}

	public void setLockTime(Timestamp lockTime) {
		this.lockTime = lockTime;
	}

	@Column(name = "auditTime")
	public Timestamp getAuditTime() {
		return auditTime;
	}

	public void setAuditTime(Timestamp auditTime) {
		this.auditTime = auditTime;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public BalanceSelectionPO init(BrandPO brand, String grade, UserPO creater, int company) {

		setName(String.format("%s-%s-%s", brand.getName(), DateUtil.current("yyyyMMdd"), grade));
		setBrand(brand);

		setGrade(grade);

		setCreater(creater);
		setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		setCompany(company);

		return this;
	}

	public BalanceSelectionVO ptv(BalanceSelectionVO balanceSelectionVO) {

		BeanUtil.copyPropertie(this, balanceSelectionVO, Arrays.asList("brand", "balance", "creater", "auditer", "balancer"));

		if (balanceSelectionVO.getBrand() != null && getBrand() != null) getBrand().ptv(balanceSelectionVO.getBrand());

		if (balanceSelectionVO.getCreater() != null && getCreater() != null) balanceSelectionVO.getCreater().setBaseInfo(getCreater());
		if (balanceSelectionVO.getAuditer() != null && getAuditer() != null) balanceSelectionVO.getAuditer().setBaseInfo(getAuditer());
		if (balanceSelectionVO.getBalancer() != null && getBalancer() != null) balanceSelectionVO.getBalancer().setBaseInfo(getBalancer());

		return balanceSelectionVO;
	}
}
