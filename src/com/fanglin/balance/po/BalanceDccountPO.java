package com.fanglin.balance.po;


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
@Table(name = "balancedccount", catalog = "balance")
public class BalanceDccountPO implements java.io.Serializable {

	private static final long serialVersionUID = 1793382413311584005L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_BELONGER_UID_STR = "belonger.uid";

	public static final String COLUMN_TYPE_STR = "type";

	public static final short TYPE_CUTPAY_INT = 0;//扣款

	public static final short TYPE_UNCUTPAY_INT = 1;//返款

	public static final short STATUS_VALID_SHORT = 0; //有效

	public static final short STATUS_UNVALID_SHORT = 1; // 失效

	private long bdid;

	private String name;

	private UserPO creater;

	private UserPO belonger;

	private Timestamp createTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private long cutpay;

	private long surplus;

	private short type;

	private short status;

	private String comment;

	public BalanceDccountPO() {
		super();
	}

	public BalanceDccountPO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bdid")
	public long getBdid() {
		return bdid;
	}

	public void setBdid(long bdid) {
		this.bdid = bdid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid",referencedColumnName="uid")
	public UserPO getCreater() {
		return creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "buid",referencedColumnName="uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
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

	@Column(name = "startTime")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	@Column(name = "cutpay")
	public long getCutpay() {
		return cutpay;
	}

	public void setCutpay(long cutpay) {
		this.cutpay = cutpay;
	}

	@Column(name = "surplus")
	public long getSurplus() {
		return surplus;
	}

	public void setSurplus(long surplus) {
		this.surplus = surplus;
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

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
