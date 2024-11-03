/**
 * @File Name	: Bricklayconstructionschedule.java
 * @Package   	: com.fanglin.entity.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

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

import com.fanglin.decoration.po.DecorationPO;

@Entity
@Table(name = "constructionschedule", catalog = "construction")
public class ConstructionScheduleDO implements Serializable {

	private static final long serialVersionUID = -4715729970075470712L;

	public static final String COLUMN_CSID_STR = "csId";

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_SCHEDULE_STR = "schedule";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_BEGIN_INT = 1;

	public static final short STATUS_FINISH_INT = 2;

	public static final short CHECKOUT_VALID_INT = 0;

	public static final short CHECKOUT_PASS_INT = 1;

	public static final String COLUMN_CREATETIME_STR = "decoration.createTime";

	public static final String COLUMN_FINISHTIME_STR = "endTime";

	public static final String COLUMN_STATUSTIME_STR = "startTime";

	public static final String COLUMN_ENTERTIME_STR = "enterTime";

	public static final String COLUMN_LEAVETIME_STR = "leaveTime";

	private long csid;

	private ConstructionPO construction;

	private DecorationPO decoration;

	private long cnid;

	private Timestamp startTime;

	private Timestamp endTime;

	private Timestamp enterTime;

	private Timestamp leaveTime;

	private short status;

	private short workStatus;

	private short checkout;

	private short schedule;

	public ConstructionScheduleDO() {
		super();
	}

	public ConstructionScheduleDO(ConstructionPO construction, Timestamp startTime, Timestamp endTime, short schedule, DecorationPO decoration) {
		super();
		this.construction = construction;
		this.startTime = startTime;
		this.endTime = endTime;
		this.schedule = schedule;
		this.decoration = decoration;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public ConstructionPO getConstruction() {
		return construction;
	}

	public void setConstruction(ConstructionPO construction) {
		this.construction = construction;
	}

	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
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

	@Column(name = "leaveTime")
	public Timestamp getLeaveTime() {
		return leaveTime;
	}

	public void setLeaveTime(Timestamp leaveTime) {
		this.leaveTime = leaveTime;
	}

	@Column(name = "enterTime")
	public Timestamp getEnterTime() {
		return enterTime;
	}

	public void setEnterTime(Timestamp enterTime) {
		this.enterTime = enterTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	@Column(name = "workStatus")
	public short getWorkStatus() {
		return workStatus;
	}

	public void setWorkStatus(short workStatus) {
		this.workStatus = workStatus;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "checkout")
	public short getCheckout() {
		return checkout;
	}

	public void setCheckout(short checkout) {
		this.checkout = checkout;
	}

	@Column(name = "schedule")
	public short getSchedule() {
		return schedule;
	}

	public void setSchedule(short schedule) {
		this.schedule = schedule;
	}

}
