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
@Table(name = "constructer", catalog = "platform")
public class ConstructerPO implements java.io.Serializable {

	private static final long serialVersionUID = 7434364138129555697L;
	public static final String  COLUMN_ORDERID_STR = "orderId";
	public static final String  COLUMN_CSID_STR  = "csId";
	public static final String  COLUMN_CID_STR  = "cid";
	public static final String  COLUMN_STATUS_STR  = "status";
	public static final String  COLUMN_USERID_STR = "user.userId";
	private Long cid;
	private Integer csId;
	private String orderId;
	private UserPO	user;
	private Integer schedule;
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
	@Column(name = "cid")
	public Long getCid() {
		return this.cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	@Column(name = "csId")
	public Integer getCsId() {
		return this.csId;
	}

	public void setCsId(Integer csId) {
		this.csId = csId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "schedule")
	public Integer getSchedule() {
		return this.schedule;
	}

	public void setSchedule(Integer schedule) {
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
	@JoinColumn(name = "createrId", referencedColumnName="userId")
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
	@JoinColumn(name = "userId", referencedColumnName="userId")
	public UserPO getUser() {
		return user;
	}


	public void setUser(UserPO user) {
		this.user = user;
	}
}