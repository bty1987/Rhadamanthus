package com.fanglin.store.po;

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

@Entity
@Table(name = "morder", catalog = "store")
public class MorderPO implements Serializable{

	private static final long serialVersionUID = -586716249741389800L;

	public static final String COLUMN_UID_STR = "muser.uid";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final short STATUS_INIT_STR = 0;
	
	public static final short STATUS_DELETE_STR = 4;
	
	private long oid;
	
	private String no;
	
	private MuserPO muser;
	
	private AddressPO address;
	
	private float total;
	
	private Timestamp createTime;
	
	private Timestamp paymentTime;
	
	private short status;

	public MorderPO() {
		super();
	}
	
	public MorderPO(String no) {
		super();
		this.no = no;
	}

	public MorderPO(MuserPO muser, AddressPO address) {
		super();
		this.muser = muser;
		this.address = address;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName="uid")
	public MuserPO getMuser() {
		return muser;
	}

	public void setMuser(MuserPO muser) {
		this.muser = muser;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aid", referencedColumnName="aid")
	public AddressPO getAddress() {
		return address;
	}

	public void setAddress(AddressPO address) {
		this.address = address;
	}

	@Column(name = "total")
	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "paymentTime")
	public Timestamp getPaymentTime() {
		return paymentTime;
	}

	public void setPaymentTime(Timestamp paymentTime) {
		this.paymentTime = paymentTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
