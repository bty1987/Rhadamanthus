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
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

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

	public static final short PROCESS_FINISH_INT = 1;

	public static final short BALANCE_STATUS_BALANCE_INT = 1;

	private long cid;

	private DecorationPO decoration;

	private long cnid;

	private int schedule;

	private short process;

	private int period;

	private short accessory;

	private long accessoryLimit;

	private long accessoryTotal;

	private long salaryLimit;

	private long salaryLimitTotal;

	private long salaryTotal;

	private UserPO supervisor;

	private UserPO locker;

	private UserPO balancer;

	private Timestamp createTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Timestamp finishTime;

	private Timestamp lockTime;

	private Timestamp processTime;

	private Timestamp balanceTime;

	private short workStatus;

	private short scheduleStatus;

	private short balanceStatus;

	private Short terminalStatus;

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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "buid", referencedColumnName = "uid")
	public UserPO getBalancer() {
		return balancer;
	}

	public void setBalancer(UserPO balancer) {
		this.balancer = balancer;
	}

	@Column(name = "salaryTotal")
	public long getSalaryTotal() {
		return salaryTotal;
	}

	public void setSalaryTotal(long salaryTotal) {
		this.salaryTotal = salaryTotal;
	}

	@Column(name = "salaryLimitTotal")
	public long getSalaryLimitTotal() {
		return salaryLimitTotal;
	}

	public void setSalaryLimitTotal(long salaryLimitTotal) {
		this.salaryLimitTotal = salaryLimitTotal;
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

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
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

	public short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

	@Column(name = "terminalStatus")
	public Short getTerminalStatus() {
		return terminalStatus;
	}

	public void setTerminalStatus(Short terminalStatus) {
		this.terminalStatus = terminalStatus;
	}

	public ConstructionVO ptv(ConstructionVO constructionVO) {

		BeanUtil.copyProperties(this, constructionVO, Arrays.asList("decoration", "supervisor", "locker", "balancer"));

		if (constructionVO.getDecoration() != null && getDecoration() != null) getDecoration().ptvcascade(constructionVO.getDecoration());

		if (constructionVO.getSupervisor() != null && getSupervisor() != null) constructionVO.getSupervisor().setBaseInfo(getSupervisor());
		if (constructionVO.getLocker() != null && getLocker() != null) constructionVO.getLocker().setBaseInfo(getLocker());
		if (constructionVO.getBalancer() != null && getBalancer() != null) constructionVO.getBalancer().setBaseInfo(getBalancer());

		return constructionVO;
	}
}