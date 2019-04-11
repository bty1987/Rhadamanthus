package com.fanglin.decoration.po;

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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationbalance", catalog = "decoration")
public class DecorationBalancePO implements Serializable {

	private static final long serialVersionUID = 832035399958007947L;
	
	public static final String COLUMN_DOID_STR = "decoration.doid";
	
	private long dbid;
	
	private DecorationPO decoration;
	
	private float balance;
	
	private UserPO user;
	
	private Timestamp balanceTime;
	
	public DecorationBalancePO(){
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "dbid")
	public long getDbid() {
		return dbid;
	}

	public void setDbid(long dbid) {
		this.dbid = dbid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "doid", referencedColumnName = "doid")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name="balance")
	public float getBalance() {
		return balance;
	}

	public void setBalance(float balance) {
		this.balance = balance;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name="balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

}
