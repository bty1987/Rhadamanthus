package com.fanglin.store.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "coupon", catalog = "store")
public class CouponPO implements Serializable {

	private static final long serialVersionUID = -4328653080992704878L;

	public static final String COLUMN_CID_STR = "cid";

	public static final Short STATUS_ABLE_SHORT = 0;

	public static final Short STATUS_DISABLE_SHORT = 1;

	private long cid;

	private MgoodsPO mgoods;

	private String title;

	private long value;

	private short type;

	private short status;

	public CouponPO() {
		super();
	}

	public CouponPO(MgoodsPO mgoods) {
		super();
		this.mgoods = mgoods;
	}

	@Id
	@GeneratedValue
	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public MgoodsPO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsPO mgoods) {
		this.mgoods = mgoods;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "value")
	public long getValue() {
		return value;
	}

	public void setValue(long value) {
		this.value = value;
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
