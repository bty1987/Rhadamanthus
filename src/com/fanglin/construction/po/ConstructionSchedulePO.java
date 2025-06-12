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
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "constructionschedule", catalog = "construction")
public class ConstructionSchedulePO implements Serializable {

	private static final long serialVersionUID = -4715729970075470712L;

	public static final String COLUMN_CSID_STR = "csId";

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_SCHEDULE_STR = "schedule";

	public static final String COLUMN_CNID_STR = "cnid";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_BEGIN_INT = 1;

	public static final short STATUS_FINISH_INT = 2;

	public static final short CHECKOUT_VALID_INT = 0;

	public static final short CHECKOUT_PASS_INT = 1;

	public static final short WORKSTATUS_INIT_INT = 0;

	public static final short WORKSTATUS_ENTER_INT = 1;

	public static final short WORKSTATUS_LEAVE_INT = 2;

	private long csid;

	private long cid;

	private String orderId;

	private long cnid;

	private int period;

	private Timestamp startTime;

	private Timestamp endTime;

	private Timestamp enterTime;

	private Timestamp leaveTime;

	private short status;

	private short checkout;

	private short schedule;

	private short workStatus;

	public ConstructionSchedulePO() {
		super();
	}

	public ConstructionSchedulePO(long cid, String orderId, Timestamp startTime, Timestamp endTime, short schedule, long cnid, int period) {

		super();

		this.cid = cid;
		this.orderId = orderId;

		this.cnid = cnid;
		this.period = period;
		this.schedule = schedule;

		this.startTime = startTime;
		this.endTime = endTime;
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

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@Column(name = "period")
	public int getPeriod() {
		return period;
	}

	public void setPeriod(int period) {
		this.period = period;
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

	@Column(name = "enterTime")
	public Timestamp getEnterTime() {
		return enterTime;
	}

	public void setEnterTime(Timestamp enterTime) {
		this.enterTime = enterTime;
	}

	@Column(name = "leaveTime")
	public Timestamp getLeaveTime() {
		return leaveTime;
	}

	public void setLeaveTime(Timestamp leaveTime) {
		this.leaveTime = leaveTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "workStatus")
	public short getWorkStatus() {
		return workStatus;
	}

	public void setWorkStatus(short workStatus) {
		this.workStatus = workStatus;
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
