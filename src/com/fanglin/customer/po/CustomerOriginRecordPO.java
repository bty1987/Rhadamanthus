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
@Table(name = "customeroriginrecord", catalog = "customer")
public class CustomerOriginRecordPO implements Serializable {

	private static final long serialVersionUID = 6333097863766164838L;

	public static final short TYPE_UPDATE_INT = 0;

	public static final short TYPE_DEFINE_INT = 1;

	private long crid;

	private long csid;

	private String comment;

	private short type;

	private UserPO operater;

	private Timestamp operatTime;

	public CustomerOriginRecordPO() {
		super();
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

	@Column(name = "coid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
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

	public CustomerOriginRecordPO init(long csid, String comment, Short type, UserPO operater) {

		setCsid(csid);
		setComment(comment);
		setType(type);
		setOperater(operater);
		setOperatTime(new Timestamp(System.currentTimeMillis()));

		return this;
	}

}
