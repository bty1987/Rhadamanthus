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
@Table(name="mpayment", catalog = "store")
public class MpaymentPO implements Serializable{

	private static final long serialVersionUID = -4211290319807165352L;

	public static final short STATUS_PAYMENT_SHORT = 1;
	
	private long mpid;
	
	private MorderPO morder;
	
	private float totalPrice;
	
	private short type;
	
	private short status;

	public MpaymentPO() {
		super();
	}

	public MpaymentPO(MorderPO morder) {
		super();
		this.morder = morder;
	}

	@Id
	@GeneratedValue
	@Column(name="mpid")
	public long getMpid() {
		return mpid;
	}

	public void setMpid(long mpid) {
		this.mpid = mpid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "oid", referencedColumnName="oid")
	public MorderPO getMorder() {
		return morder;
	}

	public void setMorder(MorderPO morder) {
		this.morder = morder;
	}

	@Column(name="totalPrice")
	public float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(float totalPrice) {
		this.totalPrice = totalPrice;
	}
	
	@Column(name="type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
