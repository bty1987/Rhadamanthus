/**
 * @File Name	: CleaningConstructionScheduleVO.java
 * @Package   	: com.fanglin.vo.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.decoration.vo.DecorationVO;

public class ConstructionScheduleVO implements Serializable {

	private static final long serialVersionUID = -8887915345535064194L;

	private Long csid;

	private ConstructionVO construction;

	private DecorationVO decoration;

	private Long cid;

	private String orderId;

	private String name;

	private Long cnid;

	private Integer period;

	private Integer prenum;

	private Integer postnum;

	private Timestamp preStartTime;

	private Timestamp preEndTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Timestamp enterTime;

	private Timestamp leaveTime;

	private Short status;

	private Short workStatus;

	private Short checkout;

	private Short schedule;

	private Short scheduleStatus;

	private Short isUpload;

	private Short additemStatus;

	private ConstructionNodeVO node;

	private Integer accessoryLimit;

	private Integer accessoryTotal;

	private Integer salaryLimit;

	private Integer salaryLimitTotal;

	private Integer salaryTotal;

	private Integer precheck;

	private Integer postcheck;

	private Integer stacheck;

	private Integer fincheck;

	private Integer planSalary;

	private Short planStatus;

	private Timestamp planTime;

	public ConstructionScheduleVO() {
		super();
	}

	public ConstructionScheduleVO(ConstructionNodeVO node, ConstructionVO construction, DecorationVO decoration) {
		super();
		this.node = node;
		this.construction = construction;
		this.decoration = decoration;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public ConstructionVO getConstruction() {
		return construction;
	}

	public void setConstruction(ConstructionVO construction) {
		this.construction = construction;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public Integer getPeriod() {
		return period;
	}

	public void setPeriod(Integer period) {
		this.period = period;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPreStartTime() {
		return preStartTime;
	}

	public void setPreStartTime(Timestamp preStartTime) {
		this.preStartTime = preStartTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPreEndTime() {
		return preEndTime;
	}

	public void setPreEndTime(Timestamp preEndTime) {
		this.preEndTime = preEndTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getLeaveTime() {
		return leaveTime;
	}

	public void setLeaveTime(Timestamp leaveTime) {
		this.leaveTime = leaveTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getEnterTime() {
		return enterTime;
	}

	public void setEnterTime(Timestamp enterTime) {
		this.enterTime = enterTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getWorkStatus() {
		return workStatus;
	}

	public void setWorkStatus(Short workStatus) {
		this.workStatus = workStatus;
	}

	public Short getCheckout() {
		return checkout;
	}

	public void setCheckout(Short checkout) {
		this.checkout = checkout;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public Short getScheduleStatus() {
		return scheduleStatus;
	}

	public void setScheduleStatus(Short scheduleStatus) {
		this.scheduleStatus = scheduleStatus;
	}

	public Short getIsUpload() {
		return isUpload;
	}

	public void setIsUpload(Short isUpload) {
		this.isUpload = isUpload;
	}

	public Short getAdditemStatus() {
		return additemStatus;
	}

	public void setAdditemStatus(Short additemStatus) {
		this.additemStatus = additemStatus;
	}

	public ConstructionNodeVO getNode() {
		return node;
	}

	public void setNode(ConstructionNodeVO node) {
		this.node = node;
	}

	public Integer getAccessoryLimit() {
		return accessoryLimit;
	}

	public void setAccessoryLimit(Integer accessoryLimit) {
		this.accessoryLimit = accessoryLimit;
	}

	public Integer getAccessoryTotal() {
		return accessoryTotal;
	}

	public void setAccessoryTotal(Integer accessoryTotal) {
		this.accessoryTotal = accessoryTotal;
	}

	public Integer getSalaryLimit() {
		return salaryLimit;
	}

	public void setSalaryLimit(Integer salaryLimit) {
		this.salaryLimit = salaryLimit;
	}

	public Integer getSalaryLimitTotal() {
		return salaryLimitTotal;
	}

	public void setSalaryLimitTotal(Integer salaryLimitTotal) {
		this.salaryLimitTotal = salaryLimitTotal;
	}

	public Integer getSalaryTotal() {
		return salaryTotal;
	}

	public void setSalaryTotal(Integer salaryTotal) {
		this.salaryTotal = salaryTotal;
	}

	public Integer getPrecheck() {
		return precheck;
	}

	public void setPrecheck(Integer precheck) {
		this.precheck = precheck;
	}

	public Integer getPostcheck() {
		return postcheck;
	}

	public void setPostcheck(Integer postcheck) {
		this.postcheck = postcheck;
	}

	public Integer getStacheck() {
		return stacheck;
	}

	public void setStacheck(Integer stacheck) {
		this.stacheck = stacheck;
	}

	public Integer getFincheck() {
		return fincheck;
	}

	public void setFincheck(Integer fincheck) {
		this.fincheck = fincheck;
	}

	public Integer getPlanSalary() {
		return planSalary;
	}

	public void setPlanSalary(Integer planSalary) {
		this.planSalary = planSalary;
	}

	public Short getPlanStatus() {
		return planStatus;
	}

	public void setPlanStatus(Short planStatus) {
		this.planStatus = planStatus;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	public Integer getPrenum() {
		return prenum;
	}

	public void setPrenum(Integer prenum) {
		this.prenum = prenum;
	}

	public Integer getPostnum() {
		return postnum;
	}

	public void setPostnum(Integer postnum) {
		this.postnum = postnum;
	}

}
