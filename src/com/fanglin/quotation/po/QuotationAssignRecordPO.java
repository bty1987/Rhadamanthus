package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 装修单预算分配记录表 PO
 * 职责: 追溯所有分配尝试（成功、失败、重新分配）
 * @table quotationassignrecord
 */
@Entity
@Table(name = "quotationassignrecord", catalog = "quotation")
public class QuotationAssignRecordPO implements Serializable {

	private static final long serialVersionUID = 1L;

	// 分配类型常量
	public static final byte ASSIGN_TYPE_AUTO_INT = 1;		// 正向自动
	public static final byte ASSIGN_TYPE_MANUAL_INT = 2;	// 手动
	public static final byte ASSIGN_TYPE_REVERSE_INT = 3;	// 反向自动

	// 分配结果常量
	public static final byte ASSIGN_RESULT_SUCCESS_INT = 1;	// 成功
	public static final byte ASSIGN_RESULT_FAIL_INT = 0;	// 失败

	// 字段
	private Integer qarid;				// 记录ID
	private String orderId;			// 装修单号
	private Integer uid;				// 预算员用户ID（成功时有值）
	private Byte assignType;			// 分配类型：1-正向自动，2-手动，3-反向自动
	private Byte assignResult;			// 分配结果：1-成功，0-失败
	private Integer assignUid;			// 分配人用户ID（手动分配时）
	private Timestamp assignTime;		// 分配时间
	private String failReason;			// 失败原因
	private Byte decorationType;		// 装修类型

	// 构造函数
	public QuotationAssignRecordPO() {
		super();
		this.assignTime = new Timestamp(System.currentTimeMillis());
	}

	// Getter and Setter
	@Id
	@GeneratedValue
	@Column(name = "qarid")
	public Integer getQarid() {
		return qarid;
	}

	public void setQarid(Integer qarid) {
		this.qarid = qarid;
	}

	@Column(name = "orderId", nullable = false)
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "uid")
	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	@Column(name = "assignType", nullable = false)
	public Byte getAssignType() {
		return assignType;
	}

	public void setAssignType(Byte assignType) {
		this.assignType = assignType;
	}

	@Column(name = "assignResult", nullable = false)
	public Byte getAssignResult() {
		return assignResult;
	}

	public void setAssignResult(Byte assignResult) {
		this.assignResult = assignResult;
	}

	@Column(name = "assignUid")
	public Integer getAssignUid() {
		return assignUid;
	}

	public void setAssignUid(Integer assignUid) {
		this.assignUid = assignUid;
	}

	@Column(name = "assignTime", nullable = false)
	public Timestamp getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(Timestamp assignTime) {
		this.assignTime = assignTime;
	}

	@Column(name = "failReason")
	public String getFailReason() {
		return failReason;
	}

	public void setFailReason(String failReason) {
		this.failReason = failReason;
	}

	@Column(name = "decorationType")
	public Byte getDecorationType() {
		return decorationType;
	}

	public void setDecorationType(Byte decorationType) {
		this.decorationType = decorationType;
	}
}
