package com.fanglin.balance.po;

import static javax.persistence.GenerationType.IDENTITY;

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

import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "balance", catalog = "balance")
public class BalancePO implements java.io.Serializable {

	private static final long serialVersionUID = -8637607309881551992L;

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_FINISH_INT = 1; // 完结

	public static final short TYPE_PAYOUT_INT = 0; // 支出

	public static final short TYPE_COLLECT_INT = 1; // 收款

	public static final short TYPE_WITHDRAW_INT = 2;// 提款

	public static final short ISPAY_PAYED_INT = 1;// 已付

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_ISPAY_STR = "isPay";

	private long bid;

	private String no;

	private UserPO belonger;

	private UserPO creater;

	private UserPO balancer;

	private Timestamp createTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Timestamp balanceTime;

	private long amount;

	private long surplus;

	private long cutpay;

	private short type;

	private short status;

	private short isPay;

	private int company;

	public BalancePO() {
		super();
	}

	public BalancePO(UserPO belonger, UserPO creater) {
		super();
		this.belonger = belonger;
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "buid", referencedColumnName = "uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "bluid", referencedColumnName = "uid")
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

	@Column(name = "startTime")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "amount")
	public long getAmount() {
		return amount;
	}

	public void setAmount(long amount) {
		this.amount = amount;
	}

	@Column(name = "surplus")
	public long getSurplus() {
		return surplus;
	}

	public void setSurplus(long surplus) {
		this.surplus = surplus;
	}

	@Column(name = "cutpay")
	public long getCutpay() {
		return cutpay;
	}

	public void setCutpay(long cutpay) {
		this.cutpay = cutpay;
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

	@Column(name = "isPay")
	public short getIsPay() {
		return isPay;
	}

	public void setIsPay(short isPay) {
		this.isPay = isPay;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public BalanceVO ptv(BalanceVO balanceVO) {

		BeanUtil.copyProperties(this, balanceVO, Arrays.asList("creater", "belonger", "balancer"));

		if (balanceVO.getCreater() != null && getCreater() != null) balanceVO.getCreater().setBaseInfo(getCreater());
		if (balanceVO.getBelonger() != null && getBelonger() != null) balanceVO.getBelonger().setBaseInfo(getBelonger());
		if (balanceVO.getBalancer() != null && getBalancer() != null) balanceVO.getBalancer().setBaseInfo(getBalancer());

		return balanceVO;
	}
}
