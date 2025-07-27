/**
 * @File Name	: Construction.java
 * @Package   	: com.fanglin.entity.construction
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
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "construction", catalog = "construction")
public class ConstructionPO implements Serializable {

	private static final long serialVersionUID = -3113263670279309498L;

	public static final String COLUMN_ORDERID_STR = "decoration.orderId";

	public static final String COLUMN_CID_STR = "cid";

	public static final int SCHEDULE_TYPE_PUTLINE_INT = 2;

	public static final int SCHEDULE_TYPE_WATERWAYCIRCUIT_INT = 3;

	public static final short ACCESSORY_OPEN_SHORT = 0;

	public static final short ACCESSORY_LOCK_SHORT = 1;

	public static final short PROCESS_INIT_INT = 0;

	public static final short PROCESS_FINISH_INT = 0;

	private long cid;

	private DecorationPO decoration;

	private long cnid;

	private int schedule;

	private short process;

	private int period;

	private short accessory;

	private long accessoryLimit;

	private long salaryLimit;

	private long accessoryTotal;

	private long salaryTotal;

	private UserPO supervisor;

	private UserPO locker;

	private Timestamp createTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Timestamp finishTime;

	private Timestamp lockTime;

	private Timestamp processTime;

	private short workStatus;

	private short scheduleStatus;

	public ConstructionPO() {
		super();
	}

	public ConstructionPO(DecorationPO decoration) {

		super();

		this.decoration = decoration;
	}

	public ConstructionPO(DecorationPO decoration, UserPO supervisor) {

		super();

		this.decoration = decoration;
		this.supervisor = supervisor;
	}

	public ConstructionPO(DecorationPO decoration, UserPO supervisor, UserPO locker) {

		super();

		this.decoration = decoration;
		this.supervisor = supervisor;
		this.locker = locker;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@Column(name = "schedule")
	public int getSchedule() {
		return schedule;
	}

	public void setSchedule(int schedule) {
		this.schedule = schedule;
	}

	@Column(name = "process")
	public short getProcess() {
		return process;
	}

	public void setProcess(short process) {
		this.process = process;
	}

	@Column(name = "period")
	public int getPeriod() {
		return period;
	}

	public void setPeriod(int period) {
		this.period = period;
	}

	@Column(name = "accessory")
	public short getAccessory() {
		return accessory;
	}

	public void setAccessory(short accessory) {
		this.accessory = accessory;
	}

	@Column(name = "accessoryLimit")
	public long getAccessoryLimit() {
		return accessoryLimit;
	}

	public void setAccessoryLimit(long accessoryLimit) {
		this.accessoryLimit = accessoryLimit;
	}

	@Column(name = "salaryLimit")
	public long getSalaryLimit() {
		return salaryLimit;
	}

	public void setSalaryLimit(long salaryLimit) {
		this.salaryLimit = salaryLimit;
	}

	@Column(name = "accessoryTotal")
	public long getAccessoryTotal() {
		return accessoryTotal;
	}

	public void setAccessoryTotal(long accessoryTotal) {
		this.accessoryTotal = accessoryTotal;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "suid", referencedColumnName = "uid")
	public UserPO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserPO supervisor) {
		this.supervisor = supervisor;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "luid", referencedColumnName = "uid")
	public UserPO getLocker() {
		return locker;
	}

	public void setLocker(UserPO locker) {
		this.locker = locker;
	}

	@Column(name = "salaryTotal")
	public long getSalaryTotal() {
		return salaryTotal;
	}

	public void setSalaryTotal(long salaryTotal) {
		this.salaryTotal = salaryTotal;
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

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "lockTime")
	public Timestamp getLockTime() {
		return lockTime;
	}

	public void setLockTime(Timestamp lockTime) {
		this.lockTime = lockTime;
	}

	@Column(name = "processTime")
	public Timestamp getProcessTime() {
		return processTime;
	}

	public void setProcessTime(Timestamp processTime) {
		this.processTime = processTime;
	}

	public short getWorkStatus() {
		return workStatus;
	}

	public void setWorkStatus(short workStatus) {
		this.workStatus = workStatus;
	}

	public short getScheduleStatus() {
		return scheduleStatus;
	}

	public void setScheduleStatus(short scheduleStatus) {
		this.scheduleStatus = scheduleStatus;
	}

}