package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "walletran", catalog = "payment")
public class WalletranPO implements java.io.Serializable {

	private static final long serialVersionUID = -5449429919016691362L;

	public static final short TYPE_RECHARGE_INT = 0; //充值

	public static final short TYPE_WITHDRAW_INT = 1; //提现

	public static final short TYPE_CONSUME_INT = 2; //消费

	public static final short TYPE_TRANSFER_INT = 3; //转账

	public static final short TYPE_REFUND_INT = 4; //退款

	private long wtid;
	
	private String no;
	
	private WalletPO wallet;
	
	private WalletPO tallet;
	
	private long amount;
	
	private short type;
	
	private short status;
	
	private String comment;

	public WalletranPO() {
		super();
	}

	public WalletranPO(WalletPO wallet, WalletPO tallet) {
		super();
		this.wallet = wallet;
		this.tallet = tallet;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wtid")
	public long getWtid() {
		return wtid;
	}

	public void setWtid(long wtid) {
		this.wtid = wtid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wid", referencedColumnName = "wid")
	public WalletPO getWallet() {
		return wallet;
	}

	public void setWallet(WalletPO wallet) {
		this.wallet = wallet;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tid", referencedColumnName = "wid")
	public WalletPO getTallet() {
		return tallet;
	}

	public void setTallet(WalletPO tallet) {
		this.tallet = tallet;
	}

	@Column(name = "amount")
	public long getAmount() {
		return amount;
	}

	public void setAmount(long amount) {
		this.amount = amount;
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

}