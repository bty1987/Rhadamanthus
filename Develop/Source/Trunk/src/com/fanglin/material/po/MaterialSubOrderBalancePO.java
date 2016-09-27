package com.fanglin.material.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "materialsuborderbalance", catalog = "platform")
public class MaterialSubOrderBalancePO implements java.io.Serializable {

	private static final long serialVersionUID = -7169809440225703812L;
	
	public static final short STATUS_INIT_INT = 0;
	
	public static final short STATUS_VENDER_BALANCE_INT = 1;
	
	public static final short STATUS_FINISH_INT = 2;
	
	public static final short TYPE_ADD_INT = 0;
	
	public static final short TYPE_SUB_INT = 1;

	private int msobId;
	
	private MaterialSubOrderPO materialSubOrder;
	
	private UserPO user;
	
	private Timestamp balanceTime;
	
	private float balance;
	
	private float difference;
	
	private float vbalance;
	
	private Timestamp vbalanceTime;
	
	private short status;
	
	private short type;
	
	private int ident;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "msobId")
	public int getMsobId() {
		return msobId;
	}

	public void setMsobId(int msobId) {
		this.msobId = msobId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "msoId", referencedColumnName="msoId")
	public MaterialSubOrderPO getMaterialSubOrder() {
		return materialSubOrder;
	}

	public void setMaterialSubOrder(MaterialSubOrderPO materialSubOrder) {
		this.materialSubOrder = materialSubOrder;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId", referencedColumnName="userId")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "balance")
	public float getBalance() {
		return balance;
	}

	public void setBalance(float balance) {
		this.balance = balance;
	}

	@Column(name = "difference")
	public float getDifference() {
		return difference;
	}

	public void setDifference(float difference) {
		this.difference = difference;
	}

	@Column(name = "vbalance")
	public float getVbalance() {
		return vbalance;
	}

	public void setVbalance(float vbalance) {
		this.vbalance = vbalance;
	}

	@Column(name = "vbalanceTime")
	public Timestamp getVbalanceTime() {
		return vbalanceTime;
	}

	public void setVbalanceTime(Timestamp vbalanceTime) {
		this.vbalanceTime = vbalanceTime;
	}

	@Column(name = "status")
	public short getStatus(){
		return this.status;
	}

	public void setStatus(short status){
		this.status = status;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "ident")
	public int getIdent() {
		return ident;
	}

	public void setIdent(int ident) {
		this.ident = ident;
	}

}