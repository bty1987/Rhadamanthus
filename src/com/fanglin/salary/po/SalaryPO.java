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
@Table(name = "salary", catalog = "salary")
public class SalaryPO implements Serializable {

	private static final long serialVersionUID = -1415708618939227278L;

	public static final short STATUS_BEGIN_INT = 0;

	public static final short STATUS_PASS_INT = 1;

	public static final short STATUS_REFUSE_INT = 2;

	public static final short STATUS_REPEAL_INT = 3;

	public static final String COLUMN_USERID_STR = "user.userId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_OPERATETIME_STR = "operateTime";

	private long sid;

	private UserPO user;

	private Timestamp createTime;

	private short type;

	private short onetype;

	private short twotype;

	private short thrtype;

	private long money;

	private short status;

	private UserPO operater;

	private Timestamp operateTime;

	private String comment;

	public SalaryPO() {
		super();
	}

	public SalaryPO(UserPO user) {
		super();
		this.user = user;
	}

	public SalaryPO(UserPO user, UserPO operater) {
		super();
		this.user = user;
		this.operater = operater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "onetype")
	public short getOnetype() {
		return onetype;
	}

	public void setOnetype(short onetype) {
		this.onetype = onetype;
	}

	@Column(name = "twotype")
	public short getTwotype() {
		return twotype;
	}

	public void setTwotype(short twotype) {
		this.twotype = twotype;
	}

	@Column(name = "thrtype")
	public short getThrtype() {
		return thrtype;
	}

	public void setThrtype(short thrtype) {
		this.thrtype = thrtype;
	}

	@Column(name = "money")
	public long getMoney() {
		return money;
	}

	public void setMoney(long money) {
		this.money = money;
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
