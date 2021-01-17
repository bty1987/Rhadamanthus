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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "wallet", catalog = "payment")
public class WalletPO implements java.io.Serializable {

	private static final long serialVersionUID = 5855741768401386029L;

	public static final short TYPE_COMPANY_INT = 0; //公司
	
	public static final short TYPE_SUPPLIER_INT = 1; //厂商
	
	public static final short TYPE_USER_INT = 2; //员工
	
	public static final short STATUS_INIT_INT = 0; //初始

	public static final short STATUS_BIND_INT = 1; //绑定

	public static final short STATUS_FROZEN_INT = 2; //冻结

	public static final short STATUS_CLOSE_INT = 3; //注销

	private long wid;
	
	private UserPO belonger;
	
	private String no;
	
	private String phone;
	
	private String identity;
	
	private long balance;
	
	private short type;
	
	private short status;

	public WalletPO() {
		super();
	}

	public WalletPO(UserPO belonger) {
		super();
		this.belonger = belonger;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wid")
	public long getWid() {
		return wid;
	}

	public void setWid(long wid) {
		this.wid = wid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "buid", referencedColumnName = "uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "identity")
	public String getIdentity() {
		return identity;
	}

	public void setIdentity(String identity) {
		this.identity = identity;
	}

	@Column(name = "balance")
	public long getBalance() {
		return balance;
	}

	public void setBalance(long balance) {
		this.balance = balance;
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

}