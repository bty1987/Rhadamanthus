package com.fanglin.balance.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class BalanceDetailVO implements Serializable {

	private static final long serialVersionUID = 950904568941125216L;

	private Long bdid;

	private BalanceAccountVO account;

	private BalanceVO balance;

	private UserBaseVO operater;

	private Timestamp operateTime;

	private Long money;

	public BalanceDetailVO() {
		super();
	}
	
	public BalanceDetailVO(BalanceAccountVO account,
			UserBaseVO operater) {
		super();
		this.account = account;
		this.operater = operater;
	}

	public Long getBdid() {
		return bdid;
	}
	
	public void setBdid(Long bdid) {
		this.bdid = bdid;
	}

	public BalanceAccountVO getAccount() {
		return account;
	}

	public void setAccount(BalanceAccountVO account) {
		this.account = account;
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

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

}
