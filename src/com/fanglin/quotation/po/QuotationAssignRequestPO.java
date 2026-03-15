package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 装修单预算分配请求表 PO
 * 职责: 控制分配逻辑和待分配队列（装修单级别，最多1条活跃记录）
 * @table quotationassignrequest
 */
@Entity
@Table(name = "quotationassignrequest", catalog = "quotation")
public class QuotationAssignRequestPO implements Serializable {

	private static final long serialVersionUID = 1L;

	// 状态常量
	public static final byte STATUS_PENDING_INT = 1;	// 待分配
	public static final byte STATUS_ASSIGNED_INT = 2;	// 已分配

	// 优先级常量
	public static final byte PRIORITY_HIGHEST_INT = 1;	// 最高
	public static final byte PRIORITY_HIGH_INT = 3;		// 高
	public static final byte PRIORITY_NORMAL_INT = 5;	// 普通
	public static final byte PRIORITY_LOW_INT = 7;		// 低
	public static final byte PRIORITY_LOWEST_INT = 9;	// 最低

	// 字段
	private Integer barid;				// 请求ID
	private String orderId;			// 装修单号（关联 decoration）
	private Integer company;			// 公司ID
	private Integer department;			// 部门ID
	private Byte decorationType;		// 装修类型：1-半包，2-整装
	private Byte priority;				// 优先级：1-最高，5-普通，9-最低
	private Timestamp requestTime;		// 请求时间
	private Integer requestUid;			// 请求人用户ID（设计师）
	private Byte status;				// 状态：1-待分配，2-已分配
	private Timestamp assignTime;		// 分配时间
	private String remark;				// 备注

	// 构造函数
	public QuotationAssignRequestPO() {
		super();
		// 默认值
		this.priority = PRIORITY_NORMAL_INT;
		this.status = STATUS_PENDING_INT;
		this.requestTime = new Timestamp(System.currentTimeMillis());
	}

	// Getter and Setter
	@Id
	@GeneratedValue
	@Column(name = "barid")
	public Integer getBarid() {
		return barid;
	}

	public void setBarid(Integer barid) {
		this.barid = barid;
	}

	@Column(name = "orderId", nullable = false)
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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

	@Column(name = "decorationType", nullable = false)
	public Byte getDecorationType() {
		return decorationType;
	}

	public void setDecorationType(Byte decorationType) {
		this.decorationType = decorationType;
	}

	@Column(name = "priority", nullable = false)
	public Byte getPriority() {
		return priority;
	}

	public void setPriority(Byte priority) {
		this.priority = priority;
	}

	@Column(name = "requestTime", nullable = false)
	public Timestamp getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(Timestamp requestTime) {
		this.requestTime = requestTime;
	}

	@Column(name = "requestUid")
	public Integer getRequestUid() {
		return requestUid;
	}

	public void setRequestUid(Integer requestUid) {
		this.requestUid = requestUid;
	}

	@Column(name = "status", nullable = false)
	public Byte getStatus() {
		return status;
	}

	public void setStatus(Byte status) {
		this.status = status;
	}

	@Column(name = "assignTime")
	public Timestamp getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(Timestamp assignTime) {
		this.assignTime = assignTime;
	}

	@Column(name = "remark")
	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
}
