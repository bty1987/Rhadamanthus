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
	
	public static final String COLUMN_USERID_STR = "user.userId";
	
	public static final String COLUMN_MSOID_STR = "materialSubOrder.msoId";
	
	public static final String COLUMN_ORDERID_STR = "materialSubOrder.orderId";
	
	public static final String COLUMN_MSONO_STR = "materialSubOrder.msoNo";
	
	public static final String COLUMN_INSTOREID_STR = "instorer.userId";
	
	public static final String COLUMN_FULLCOLLECTTIME_STR = "materialSubOrder.fullCollectTime";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_PRE_BALANCE_INT = 0;
	
	public static final short STATUS_VENDER_BALANCE_INT = 1;
	
	public static final short STATUS_FINISH_INT = 2;
	
	public static final short TYPE_ADD_INT = 0;
	
	public static final short TYPE_SUB_INT = 1;

	private int msobId;
	
	private MaterialSubOrderPO materialSubOrder;
	
	private UserPO creater;
	
	private UserPO instorer;
	
	private UserPO poster;
	
	private Timestamp balanceTime;
	
	private float balance;
	
	private float difference;
	
	private float vbalance;
	
	private Timestamp vbalanceTime;
	
	private Timestamp postTime;
	
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
	@JoinColumn(name = "createrId", referencedColumnName="userId")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "instorerId", referencedColumnName="userId")
	public UserPO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserPO instorer) {
		this.instorer = instorer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "posterId", referencedColumnName="userId")
	public UserPO getPoster() {
		return poster;
	}

	public void setPoster(UserPO poster) {
		this.poster = poster;
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

	@Column(name = "postTime")
	public Timestamp getPostTime() {
		return postTime;
	}

	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
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