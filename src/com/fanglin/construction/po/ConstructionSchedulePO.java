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

import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.utils.BeanUtil;

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

	private Timestamp preStartTime;

	private Timestamp preEndTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Timestamp enterTime;

	private Timestamp leaveTime;

	private short status;

	private short checkout;

	private short schedule;

	private short workStatus;

	private short scheduleStatus;

	private int accessoryLimit;

	private int salaryLimit;

	private int accessoryTotal;

	private int salaryTotal;

	private int precheck;

	private int postcheck;

	private int stacheck;

	private int fincheck;

	public ConstructionSchedulePO() {
		super();
	}

	public ConstructionSchedulePO(long cid, String orderId) {
		super();
		this.cid = cid;
		this.orderId = orderId;
	}

	public ConstructionSchedulePO(long cid, String orderId, Timestamp startTime, Timestamp endTime) {
		super();
		this.cid = cid;
		this.orderId = orderId;
		this.startTime = startTime;
		this.endTime = endTime;
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

	public short getScheduleStatus() {
		return scheduleStatus;
	}

	public void setScheduleStatus(short scheduleStatus) {
		this.scheduleStatus = scheduleStatus;
	}

	@Column(name = "accessoryLimit")
	public int getAccessoryLimit() {
		return accessoryLimit;
	}

	public void setAccessoryLimit(int accessoryLimit) {
		this.accessoryLimit = accessoryLimit;
	}

	@Column(name = "salaryLimit")
	public int getSalaryLimit() {
		return salaryLimit;
	}

	public void setSalaryLimit(int salaryLimit) {
		this.salaryLimit = salaryLimit;
	}

	@Column(name = "accessoryTotal")
	public int getAccessoryTotal() {
		return accessoryTotal;
	}

	public void setAccessoryTotal(int accessoryTotal) {
		this.accessoryTotal = accessoryTotal;
	}

	@Column(name = "salaryTotal")
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

	public ConstructionSchedulePO init(ConstructionNodeVO constructionNodeVO) {

		BeanUtil.copyProperties(constructionNodeVO, this, "");

		return this;
	}
}
