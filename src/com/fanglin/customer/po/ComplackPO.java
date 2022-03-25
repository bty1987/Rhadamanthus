package com.fanglin.customer.po;

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
@Table(name = "complack", catalog = "customer")
public class ComplackPO implements Serializable {

	private static final long serialVersionUID = 7298290762938281881L;

	public static final String COLUMN_CTID_STR = "ctid";

	private long ckid;

	private long cid;

	private long ctid;

	private Timestamp createTime;

	private Timestamp operateTime;

	private UserPO operater;

	private String comment;

	public ComplackPO() {
		super();
	}

	public ComplackPO(UserPO operater) {
		super();
		this.operater = operater;
	}

	@Id
	@GeneratedValue
	@Column(name = "ckid")
	public long getCkid() {
		return ckid;
	}

	public void setCkid(long ckid) {
		this.ckid = ckid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "ctid")
	public long getCtid() {
		return ctid;
	}

	public void setCtid(long ctid) {
		this.ctid = ctid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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
