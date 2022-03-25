package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "repairpay", catalog = "customer")
public class RepairpayPO implements Serializable {

	private static final long serialVersionUID = -3827026233276301733L;

	public static final short STATUS_INIT_INT = 0; // 初始

	private long rpid;

	private long aid;

	private short type;

	private long ident;

	private long money;

	private UserPO creater;

	private Timestamp createTime;

	private short status;

	public RepairpayPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rpid")
	public long getRpid() {
		return rpid;
	}

	public void setRpid(long rpid) {
		this.rpid = rpid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "ident")
	public long getIdent() {
		return ident;
	}

	public void setIdent(long ident) {
		this.ident = ident;
	}

	@Column(name = "money")
	public long getMoney() {
		return money;
	}

	public void setMoney(long money) {
		this.money = money;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
}
