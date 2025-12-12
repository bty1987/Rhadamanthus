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

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_CRID_STR = "crid";

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_CNID_STR = "cnid";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_UID_STR = "user.uid";

	public static final String COLUMN_USERID_STR = "user.userId";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	public static final short STATUS_SEND_INT = 2;

	public static final short STATUS_FINISH_INT = 3;

	private long crid;

	private String orderId;

	private long cid;

	private long csid;

	private long cnid;

	private UserPO user;

	private short schedule;

	private short rate;

	private short rate1;

	private short rate2;

	private String assessment;

	private UserPO creater;

	private Timestamp createTime;

	private Timestamp sendTime;

	private Timestamp finishTime;

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

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@Column(name = "schedule")
	public short getSchedule() {
		return this.schedule;
	}

	public void setSchedule(short schedule) {
		this.schedule = schedule;
	}

	@Column(name = "rate")
	public short getRate() {
		return this.rate;
	}

	public void setRate(short rate) {
		this.rate = rate;
	}

	@Column(name = "rate1")
	public short getRate1() {
		return rate1;
	}

	public void setRate1(short rate1) {
		this.rate1 = rate1;
	}

	@Column(name = "rate2")
	public short getRate2() {
		return rate2;
	}

	public void setRate2(short rate2) {
		this.rate2 = rate2;
	}

	@Column(name = "assessment")
	public String getAssessment() {
		return this.assessment;
	}

	public void setAssessment(String assessment) {
		this.assessment = assessment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
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

	@Column(name = "sendTime")
	public Timestamp getSendTime() {
		return sendTime;
	}

	public void setSendTime(Timestamp sendTime) {
		this.sendTime = sendTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wuid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

}