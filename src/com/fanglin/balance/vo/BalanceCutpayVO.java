package com.fanglin.balance.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class BalanceCutpayVO implements java.io.Serializable {

	private static final long serialVersionUID = -6266671736442001678L;

	private Long bcid;

	private String name;

	private BalanceVO balance;

	private BalanceCutpayVO cutpay;

	private BalanceDccountVO dccount;

	private UserBaseVO operater;

	private Timestamp operateTime;

	private Long total;

	private Integer money;

	private Short type;

	private Short status;

	private String comment;

	public BalanceCutpayVO() {
		super();
	}

	public BalanceCutpayVO(UserBaseVO operater) {
		super();
		this.operater = operater;
	}

	public BalanceCutpayVO(BalanceVO balance, UserBaseVO operater) {
		super();
		this.balance = balance;
		this.operater = operater;
	}

	public BalanceCutpayVO(BalanceVO balance, UserBaseVO operater, BalanceDccountVO dccount, BalanceCutpayVO cutpay) {
		super();
		this.balance = balance;
		this.operater = operater;
		this.dccount = dccount;
		this.cutpay = cutpay;
	}

	public Long getBcid() {
		return bcid;
	}

	public void setBcid(Long bcid) {
		this.bcid = bcid;
	}

	public BalanceVO getBalance() {
		return balance;
	}

	public void setBalance(BalanceVO balance) {
		this.balance = balance;
	}

	public BalanceCutpayVO getCutpay() {
		return cutpay;
	}

	public void setCutpay(BalanceCutpayVO cutpay) {
		this.cutpay = cutpay;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Integer getMoney() {
		return money;
	}

	public void setMoney(Integer money) {
		this.money = money;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BalanceDccountVO getDccount() {
		return dccount;
	}

	public void setDccount(BalanceDccountVO dccount) {
		this.dccount = dccount;
	}

}