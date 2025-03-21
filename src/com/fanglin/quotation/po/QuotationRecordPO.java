package com.fanglin.quotation.po;

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
@Table(name = "quotationrecord", catalog = "customer")
public class QuotationRecordPO implements Serializable {

	private static final long serialVersionUID = 7534349183938276916L;

	public static final short TYPE_COMMON_INT = 0;

	public static final short TYPE_SPECIAL_INT = 1;

	public static final short TYPE_USER_RULE_INT = 2;

	private long qrid;

	private long qid;

	private short type;

	private UserPO operater;

	private Timestamp operatTime;

	private String comment;

	public QuotationRecordPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "qrid")
	public long getQrid() {
		return qrid;
	}

	public void setQrid(long qrid) {
		this.qrid = qrid;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
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

	@Column(name = "operatTime")
	public Timestamp getOperatTime() {
		return operatTime;
	}

	public void setOperatTime(Timestamp operatTime) {
		this.operatTime = operatTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public QuotationRecordPO init(long qid, String comment, Short type, UserPO operater) {

		setQid(qid);
		setType(type);
		setOperater(operater);

		setOperatTime(new Timestamp(System.currentTimeMillis()));

		setComment(comment);

		return this;
	}

	public QuotationRecordPO init(String comment, Short type, UserPO operater) {

		setType(type);
		setOperater(operater);

		setOperatTime(new Timestamp(System.currentTimeMillis()));

		setComment(comment);

		return this;
	}
}
