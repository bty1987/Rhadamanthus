package com.fanglin.inventory.po;



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
@Table(name = "purchasebalance", catalog = "inventory")
public class PurchaseBalancePO implements Serializable{

	private static final long serialVersionUID = -3855963119019395466L;
	
	public static final String COLUMN_PID_STR = "pid";
	
	public static final short STATUS_DONE_INT = 1;

	private long pbid;
	
	private long pid;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private float balance;
	
	private short status;
	
	private String comment;
	
	

	public PurchaseBalancePO(UserPO creater) {
		super();
		this.creater = creater;
	}

	public PurchaseBalancePO(long pid) {
		super();
		this.pid = pid;
	}

	public PurchaseBalancePO() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Id
	@GeneratedValue(strategy = IDENTITY) 
	@Column(name = "pbid")
	public long getPbid() {
		return pbid;
	}

	public void setPbid(long pbid) {
		this.pbid = pbid;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cuid", referencedColumnName = "uId")
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

	@Column(name = "balance")
	public float getBalance() {
		return balance;
	}

	public void setBalance(float balance) {
		this.balance = balance;
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
