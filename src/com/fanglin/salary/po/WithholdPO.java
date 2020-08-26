package com.fanglin.salary.po;

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
@Table(name = "withhold", catalog = "salary")
public class WithholdPO implements Serializable{

	private static final long serialVersionUID = -7174030094041756436L;
	
	public static final short CHECKUP_DECORATION_SHORT = 1;
	
	public static final String CHECKUP_TYPE_SHORT = "type";
	
	public static final String COLUMN_USERID_STR = "user.userId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_OPERATETIME_STR = "operateTime";
	
	private long wid;

	private UserPO user;

	private short type;
	
	private String orderId;

	private long ident;

	private long money;
	
	private Timestamp createTime;

	private short status;
	
	private UserPO operater;
	
	private Timestamp operateTime;
	
	private String comment;

	public WithholdPO() {
		super();
	}

	public WithholdPO(UserPO user, UserPO operater) {
		super();
		this.user = user;
		this.operater = operater;
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
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
