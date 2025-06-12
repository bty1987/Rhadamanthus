/**
 * @File Name	: ConstructionVO.java
 * @Package   	: com.fanglin.vo.construction
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

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class ConstructionVO implements Serializable {

	private static final long serialVersionUID = -6183413787236101280L;

	private Long cid;

	private String orderId;

	private DecorationVO decoration;

	private Long cnid;

	private Integer schedule;

	private Integer process;

	private Integer period;

	private Short accessory;

	private Long accessoryLimit;

	private Long salaryLimit;

	private Long accessoryTotal;

	private Long salaryTotal;

	private UserBaseVO supervisor;

	private UserBaseVO locker;

	private Timestamp createTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Timestamp finishTime;

	private Timestamp lockTime;

	private Timestamp processTime;

	public ConstructionVO() {
		super();
	}

	public ConstructionVO(UserBaseVO supervisor) {
		super();
		this.supervisor = supervisor;
	}

	public ConstructionVO(DecorationVO decoration, UserBaseVO supervisor) {
		super();
		this.decoration = decoration;
		this.supervisor = supervisor;
	}

	public ConstructionVO(DecorationVO decoration, UserBaseVO supervisor, UserBaseVO locker) {
		super();
		this.decoration = decoration;
		this.supervisor = supervisor;
		this.locker = locker;
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

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public Integer getSchedule() {
		return schedule;
	}

	public void setSchedule(Integer schedule) {
		this.schedule = schedule;
	}

	public Integer getProcess() {
		return process;
	}

	public void setProcess(Integer process) {
		this.process = process;
	}

	public Integer getPeriod() {
		return period;
	}

	public void setPeriod(Integer period) {
		this.period = period;
	}

	public Short getAccessory() {
		return accessory;
	}

	public void setAccessory(Short accessory) {
		this.accessory = accessory;
	}

	public Long getAccessoryLimit() {
		return accessoryLimit;
	}

	public void setAccessoryLimit(Long accessoryLimit) {
		this.accessoryLimit = accessoryLimit;
	}

	public Long getSalaryLimit() {
		return salaryLimit;
	}

	public void setSalaryLimit(Long salaryLimit) {
		this.salaryLimit = salaryLimit;
	}

	public Long getAccessoryTotal() {
		return accessoryTotal;
	}

	public void setAccessoryTotal(Long accessoryTotal) {
		this.accessoryTotal = accessoryTotal;
	}

	public Long getSalaryTotal() {
		return salaryTotal;
	}

	public void setSalaryTotal(Long salaryTotal) {
		this.salaryTotal = salaryTotal;
	}

	public UserBaseVO getLocker() {
		return locker;
	}

	public void setLocker(UserBaseVO locker) {
		this.locker = locker;
	}

	public UserBaseVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserBaseVO supervisor) {
		this.supervisor = supervisor;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getLockTime() {
		return lockTime;
	}

	public void setLockTime(Timestamp lockTime) {
		this.lockTime = lockTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getProcessTime() {
		return processTime;
	}

	public void setProcessTime(Timestamp processTime) {
		this.processTime = processTime;
	}
}
