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

import com.fanglin.balance.vo.BalanceCutpayVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "balancecutpay", catalog = "balance")
public class BalanceCutpayPO implements java.io.Serializable {

	private static final long serialVersionUID = 7183877468314316566L;

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_OPERATER_UID_STR = "operater.uid";

	public final short TYPE_CUTPAY_INT = 0;

	public static final short STATUS_INIT_INT = 0;// 初始

	public static final short STATUS_BIND_INT = 1;// 绑定

	private long bcid;

	private String name;

	private BalancePO balance;

	private BalanceCutpayPO cutpay;

	private BalanceDccountPO dccount;

	private UserPO operater;

	private Timestamp operateTime;

	private long total;

	private int money;

	private short type;

	private short status;

	private String comment;

	public BalanceCutpayPO() {
		super();
	}

	public BalanceCutpayPO(BalancePO balance) {
		super();
		this.balance = balance;
	}

	public BalanceCutpayPO(BalancePO balance, BalanceDccountPO dccount) {
		super();
		this.balance = balance;
		this.dccount = dccount;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bcid")
	public long getBcid() {
		return bcid;
	}

	public void setBcid(long bcid) {
		this.bcid = bcid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bid", referencedColumnName = "bid")
	public BalancePO getBalance() {
		return balance;
	}

	public void setBalance(BalancePO balance) {
		this.balance = balance;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bccid", referencedColumnName = "bcid")
	public BalanceCutpayPO getCutpay() {
		return cutpay;
	}

	public void setCutpay(BalanceCutpayPO cutpay) {
		this.cutpay = cutpay;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ouid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "money")
	public int getMoney() {
		return money;
	}

	public void setMoney(int money) {
		this.money = money;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
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

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bdid", referencedColumnName = "bdid")
	public BalanceDccountPO getDccount() {
		return dccount;
	}

	public void setDccount(BalanceDccountPO dccount) {
		this.dccount = dccount;
	}

	public BalanceCutpayVO ptv(BalanceCutpayVO balanceCutpayVO) {

		BeanUtil.copyPropertie(this, balanceCutpayVO, Arrays.asList("balance", "operater", "dccount", "cutpay"));

		if (balanceCutpayVO.getOperater() != null && getOperater() != null) balanceCutpayVO.getOperater().setBaseInfo(getOperater());
		if (balanceCutpayVO.getDccount() != null && getDccount() != null) getDccount().ptv(balanceCutpayVO.getDccount());

		return balanceCutpayVO;
	}
}
