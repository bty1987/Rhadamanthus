package com.fanglin.balance.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class BalanceCutpayVO implements java.io.Serializable {

	private static final long serialVersionUID = -6266671736442001678L;

	private Long bcid;

	private BalanceVO balance;

	private UserBaseVO operater;

	private Timestamp operateTime;

	private Long cutpay;

	private Integer money;

	private Short type;

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

	public Long getCutpay() {
		return cutpay;
	}

	public void setCutpay(Long cutpay) {
		this.cutpay = cutpay;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}