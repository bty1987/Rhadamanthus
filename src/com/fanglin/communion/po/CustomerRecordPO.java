package com.fanglin.communion.po;

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
@Table(name = "customerrecord", catalog = "communion")
public class CustomerRecordPO implements Serializable {

	private static final long serialVersionUID = 3256551141185259683L;

	public static final short TYPE_QUERY_INT = 0;

	private long crid;

	private long cid;

	private long cpid;

	private short type;

	private UserPO operater;

	private Timestamp operateTime;

	private String comment;

	public CustomerRecordPO() {
		super();
	}

	public CustomerRecordPO(long cid, long cpid, short type, UserPO operater, Timestamp operateTime) {

		super();

		this.cid = cid;
		this.cpid = cpid;
		this.type = type;
		this.operater = operater;
		this.operateTime = operateTime;
	}

	@Id
	@GeneratedValue
	@Column(name = "crid")
	public long getCrid() {
		return crid;
	}

	public void setCrid(long crid) {
		this.crid = crid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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
