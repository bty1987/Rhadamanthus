package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

/**
 * 装修单预算分配记录表 VO
 */
public class QuotationAssignRecordVO implements Serializable {

	private static final long serialVersionUID = 1L;

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

	// 关联对象
	private UserBaseVO budgetUser;		// 预算员用户信息
	private UserBaseVO assignUser;		// 分配人用户信息

	// 构造函数
	public QuotationAssignRecordVO() {
		super();
	}

	// Getter and Setter
	public Integer getQarid() {
		return qarid;
	}

	public void setQarid(Integer qarid) {
		this.qarid = qarid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public Byte getAssignType() {
		return assignType;
	}

	public void setAssignType(Byte assignType) {
		this.assignType = assignType;
	}

	public Byte getAssignResult() {
		return assignResult;
	}

	public void setAssignResult(Byte assignResult) {
		this.assignResult = assignResult;
	}

	public Integer getAssignUid() {
		return assignUid;
	}

	public void setAssignUid(Integer assignUid) {
		this.assignUid = assignUid;
	}

	public Timestamp getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(Timestamp assignTime) {
		this.assignTime = assignTime;
	}

	public String getFailReason() {
		return failReason;
	}

	public void setFailReason(String failReason) {
		this.failReason = failReason;
	}

	public Byte getDecorationType() {
		return decorationType;
	}

	public void setDecorationType(Byte decorationType) {
		this.decorationType = decorationType;
	}

	@JSON(serialize = false)
	public UserBaseVO getBudgetUser() {
		return budgetUser;
	}

	public void setBudgetUser(UserBaseVO budgetUser) {
		this.budgetUser = budgetUser;
	}

	@JSON(serialize = false)
	public UserBaseVO getAssignUser() {
		return assignUser;
	}

	public void setAssignUser(UserBaseVO assignUser) {
		this.assignUser = assignUser;
	}
}
