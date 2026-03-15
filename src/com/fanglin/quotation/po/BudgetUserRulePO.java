package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 预算员规则表 PO
 * 职责: 管理预算员信息、状态、关联公司
 * @table quotationuserrule
 */
@Entity
@Table(name = "quotationuserrule", catalog = "quotation")
public class BudgetUserRulePO implements Serializable {

	private static final long serialVersionUID = 1L;

	// 状态常量
	public static final byte STATUS_AVAILABLE_INT = 1;	// 待分配
	public static final byte STATUS_BUSY_INT = 2;		// 制作中
	public static final byte STATUS_STOP_INT = 3;		// 停止
	public static final byte STATUS_COMPLETED_INT = 4;	// 已完成

	// 字段
	private Integer burid;				// 预算员规则ID
	private Integer uid;				// 用户ID（预算员工号）
	private Integer company;			// 关联公司ID
	private Integer department;			// 部门ID
	private Byte status;				// 状态：1-待分配，2-制作中，3-停止，4-已完成
	private Timestamp lastFinishTime;	// 最后完成时间
	private Integer currentTaskCount;	// 当前任务数量
	private Timestamp createTime;		// 创建时间
	private Timestamp updateTime;		// 更新时间

	// 构造函数
	public BudgetUserRulePO() {
		super();
	}

	// Getter and Setter
	@Id
	@GeneratedValue
	@Column(name = "burid")
	public Integer getBurid() {
		return burid;
	}

	public void setBurid(Integer burid) {
		this.burid = burid;
	}

	@Column(name = "uid", nullable = false)
	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	@Column(name = "company", nullable = false)
	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	@Column(name = "department")
	public Integer getDepartment() {
		return department;
	}

	public void setDepartment(Integer department) {
		this.department = department;
	}

	@Column(name = "status", nullable = false)
	public Byte getStatus() {
		return status;
	}

	public void setStatus(Byte status) {
		this.status = status;
	}

	@Column(name = "lastFinishTime")
	public Timestamp getLastFinishTime() {
		return lastFinishTime;
	}

	public void setLastFinishTime(Timestamp lastFinishTime) {
		this.lastFinishTime = lastFinishTime;
	}

	@Column(name = "currentTaskCount")
	public Integer getCurrentTaskCount() {
		return currentTaskCount;
	}

	public void setCurrentTaskCount(Integer currentTaskCount) {
		this.currentTaskCount = currentTaskCount;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}
}
