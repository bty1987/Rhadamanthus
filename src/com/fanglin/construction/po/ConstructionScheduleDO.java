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
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "constructionschedule", catalog = "construction")
public class ConstructionScheduleDO implements Serializable {

	private static final long serialVersionUID = -4715729970075470712L;

	public static final String COLUMN_CREATETIME_STR = "decoration.createTime";

	public static final String COLUMN_FINISHTIME_STR = "endTime";

	public static final String COLUMN_STATUSTIME_STR = "startTime";

	public static final String COLUMN_ENTERTIME_STR = "enterTime";

	public static final String COLUMN_LEAVETIME_STR = "leaveTime";

	private long csid;

	private ConstructionPO construction;

	private DecorationPO decoration;

	private ConstructionNodePO node;

	private int period;

	private String name;

	private Timestamp preStartTime;

	private Timestamp preEndTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Timestamp enterTime;

	private Timestamp leaveTime;

	private short status;

	private short workStatus;

	private short checkout;

	private short schedule;

	private short scheduleStatus;

	private short isUpload;

	private int accessoryLimit;

	private int salaryLimit;

	private int accessoryTotal;

	private int salaryTotal;

	private int precheck;

	private int postcheck;

	private int stacheck;

	private int fincheck;

	private int prenum;

	private int postnum;

	private int planSalary;

	private short planStatus;

	private Timestamp planTime;

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

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cnid", referencedColumnName = "cnid")
	public ConstructionNodePO getNode() {
		return node;
	}

	public void setNode(ConstructionNodePO node) {
		this.node = node;
	}

	@Column(name = "period")
	public int getPeriod() {
		return period;
	}

	public void setPeriod(int period) {
		this.period = period;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "preStartTime")
	public Timestamp getPreStartTime() {
		return preStartTime;
	}

	public void setPreStartTime(Timestamp preStartTime) {
		this.preStartTime = preStartTime;
	}

	@Column(name = "preEndTime")
	public Timestamp getPreEndTime() {
		return preEndTime;
	}

	public void setPreEndTime(Timestamp preEndTime) {
		this.preEndTime = preEndTime;
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

	public short getScheduleStatus() {
		return scheduleStatus;
	}

	public void setScheduleStatus(short scheduleStatus) {
		this.scheduleStatus = scheduleStatus;
	}

	@Column(name = "isUpload")
	public short getIsUpload() {
		return isUpload;
	}

	public void setIsUpload(short isUpload) {
		this.isUpload = isUpload;
	}

	public int getAccessoryLimit() {
		return accessoryLimit;
	}

	public void setAccessoryLimit(int accessoryLimit) {
		this.accessoryLimit = accessoryLimit;
	}

	public int getSalaryLimit() {
		return salaryLimit;
	}

	public void setSalaryLimit(int salaryLimit) {
		this.salaryLimit = salaryLimit;
	}

	public int getAccessoryTotal() {
		return accessoryTotal;
	}

	public void setAccessoryTotal(int accessoryTotal) {
		this.accessoryTotal = accessoryTotal;
	}

	public int getSalaryTotal() {
		return salaryTotal;
	}

	public void setSalaryTotal(int salaryTotal) {
		this.salaryTotal = salaryTotal;
	}

	public int getPrecheck() {
		return precheck;
	}

	public void setPrecheck(int precheck) {
		this.precheck = precheck;
	}

	public int getPostcheck() {
		return postcheck;
	}

	public void setPostcheck(int postcheck) {
		this.postcheck = postcheck;
	}

	public int getStacheck() {
		return stacheck;
	}

	public void setStacheck(int stacheck) {
		this.stacheck = stacheck;
	}

	public int getFincheck() {
		return fincheck;
	}

	public void setFincheck(int fincheck) {
		this.fincheck = fincheck;
	}

	public int getPrenum() {
		return prenum;
	}

	public void setPrenum(int prenum) {
		this.prenum = prenum;
	}

	public int getPostnum() {
		return postnum;
	}

	public void setPostnum(int postnum) {
		this.postnum = postnum;
	}

	public int getPlanSalary() {
		return planSalary;
	}

	public void setPlanSalary(int planSalary) {
		this.planSalary = planSalary;
	}

	public short getPlanStatus() {
		return planStatus;
	}

	public void setPlanStatus(short planStatus) {
		this.planStatus = planStatus;
	}

	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	public ConstructionScheduleVO ptv(ConstructionScheduleVO constructionScheduleVO) {

		BeanUtil.copyProperties(this, constructionScheduleVO, Arrays.asList("decoration", "construction", "node"));

		if (constructionScheduleVO.getDecoration() != null && getDecoration() != null) {
			getDecoration().ptvcascade(constructionScheduleVO.getDecoration());

			constructionScheduleVO.setOrderId(getDecoration().getOrderId());
		}

		if (constructionScheduleVO.getConstruction() != null && getConstruction() != null) {
			getConstruction().ptv(constructionScheduleVO.getConstruction());

			constructionScheduleVO.setCid(getConstruction().getCid());
		}

		if (constructionScheduleVO.getNode() != null && getNode() != null) {
			getNode().ptv(constructionScheduleVO.getNode());

			constructionScheduleVO.setCnid(constructionScheduleVO.getNode().getCnid());
			constructionScheduleVO.setSchedule(constructionScheduleVO.getSchedule());
		}

		return constructionScheduleVO;
	}

}
