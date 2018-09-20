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
	
	public static final String COLUMN_UNIONID_STR = "unionId";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	public static final short STATUS_INIT_SHORT = 0;
	
	public static final short STATUS_WAITINGSEND_SHORT = 1;
	
	public static final short STATUS_ENDSEND_SHORT = 2;
	
	public static final short STATUS_WAITINGEVALUATION_SHORT = 3;
	
	public static final short STATUS_DELETE_SHORT = 5;
	
	public static final short STATUS_COMPLETED_SHORT = 6;
	
	private long oid;
	
	private String no;
	
	private String unionId;
	
	private String rmunionId;
	
	private CouponPO coupon;
	
	private float total;
	
	private Timestamp createTime;
	
	private Timestamp paymentTime;
	
	private String address;
	
	private short status;

	public MorderPO() {
		super();
	}
	
	public MorderPO(CouponPO coupon) {
		super();
		this.coupon = coupon;
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

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "rmunionId")
	public String getRmunionId() {
		return rmunionId;
	}

	public void setRmunionId(String rmunionId) {
		this.rmunionId = rmunionId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName="cid")
	public CouponPO getCoupon() {
		return coupon;
	}

	public void setCoupon(CouponPO coupon) {
		this.coupon = coupon;
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

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
