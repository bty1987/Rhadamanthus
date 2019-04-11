package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.personel.vo.UserBaseVO;

public class DecorationBalanceVO implements Serializable {

	private static final long serialVersionUID = -5236989417289346963L;

	private Long dbid;
	
	private DecorationVO decoration;
	
	private Float balance;
	
	private UserBaseVO user;
	
	private Timestamp balanceTime;
	
	public DecorationBalanceVO(){
		super();
	}

	public DecorationBalanceVO(DecorationVO decoration, UserBaseVO user) {
		super();
		this.decoration = decoration;
		this.user = user;
	}
	
	public Long getDbid() {
		return dbid;
	}

	public void setDbid(Long dbid) {
		this.dbid = dbid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Float getBalance() {
		return balance;
	}

	public void setBalance(Float balance) {
		this.balance = balance;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}
	
}
