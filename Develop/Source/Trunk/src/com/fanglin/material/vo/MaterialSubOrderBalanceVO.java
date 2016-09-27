package com.fanglin.material.vo;

import java.sql.Timestamp;

import com.fanglin.personel.vo.UserVO;

public class MaterialSubOrderBalanceVO implements java.io.Serializable {

	private static final long serialVersionUID = -7832029854932592374L;

	private Integer msobId;
	
	private MaterialSubOrderVO materialSubOrder;
	
	private UserVO user;
	
	private Timestamp balanceTime;
	
	private Float balance;
	
	private Float difference;
	
	private Float vbalance;
	
	private Timestamp vbalanceTime;
	
	private Short status;
	
	private Short type;
	
	private Integer ident;

	public MaterialSubOrderBalanceVO() {
		super();
	}

	public MaterialSubOrderBalanceVO(MaterialSubOrderVO materialSubOrder, UserVO user) {
		super();
		this.materialSubOrder = materialSubOrder;
		this.user = user;
	}

	public Integer getMsobId() {
		return msobId;
	}

	public void setMsobId(Integer msobId) {
		this.msobId = msobId;
	}

	public MaterialSubOrderVO getMaterialSubOrder() {
		return materialSubOrder;
	}

	public void setMaterialSubOrder(MaterialSubOrderVO materialSubOrder) {
		this.materialSubOrder = materialSubOrder;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	public Float getBalance() {
		return balance;
	}

	public void setBalance(Float balance) {
		this.balance = balance;
	}

	public Float getDifference() {
		return difference;
	}

	public void setDifference(Float difference) {
		this.difference = difference;
	}

	public Float getVbalance() {
		return vbalance;
	}

	public void setVbalance(Float vbalance) {
		this.vbalance = vbalance;
	}

	public Timestamp getVbalanceTime() {
		return vbalanceTime;
	}

	public void setVbalanceTime(Timestamp vbalanceTime) {
		this.vbalanceTime = vbalanceTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getIdent() {
		return ident;
	}

	public void setIdent(Integer ident) {
		this.ident = ident;
	}

}