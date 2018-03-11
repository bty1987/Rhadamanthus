package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "constructer", catalog = "construction")
public class ConstructerPO implements java.io.Serializable {

	private static final long serialVersionUID = 7434364138129555697L;
	
	public static final String  COLUMN_ORDERID_STR = "orderId";
	
	public static final String  COLUMN_CRID_STR  = "crid";
	
	public static final String  COLUMN_CID_STR  = "cid";
	
	public static final String  COLUMN_STATUS_STR  = "status";
	
	public static final String  COLUMN_USERID_STR = "user.userId";
	
	public static final short	STATUS_ENABLE_SHORT  = 0;
	
	public static final short	STATUS_DISABLE_SHORT  = 1;
	
	private long crid;
	
	private long cid;
	
	private String orderId;
	
	private UserPO	user;
	
	private int schedule;
	
	private short rate;
	
	private String assessment;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private short status;

	public ConstructerPO() {
		super();
	}

	public ConstructerPO(UserPO user) {
		super();
		this.user = user;
	}
	
	public ConstructerPO(UserPO user, UserPO creater) {
		super();
		this.user = user;
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
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
	

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "schedule")
	public int getSchedule() {
		return this.schedule;
	}

	public void setSchedule(int schedule) {
		this.schedule = schedule;
	}

	@Column(name = "rate")
	public short getRate() {
		return this.rate;
	}

	public void setRate(short rate) {
		this.rate = rate;
	}

	@Column(name = "assessment")
	public String getAssessment() {
		return this.assessment;
	}

	public void setAssessment(String assessment) {
		this.assessment = assessment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName="uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
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
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wuid", referencedColumnName="uid")
	public UserPO getUser() {
		return user;
	}


	public void setUser(UserPO user) {
		this.user = user;
	}
	
}