package com.fanglin.quotation.po;

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

import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.QuotationAssignRecordVO;
import com.fanglin.utils.BeanUtil;

/**
 * 装修单预算分配记录表 PO
 * 职责: 追溯所有分配尝试（成功、失败、重新分配）
 * @table quotationassignrecord
 */
@Entity
@Table(name = "quotationassignrecord", catalog = "quotation")
public class QuotationAssignRecordPO implements Serializable {

	private static final long serialVersionUID = 1L;

	// COLUMN 常量
	public static final String COLUMN_ORDERID_STR = "orderId";
	public static final String COLUMN_USER_STR = "user.uid";

	// 分配类型常量
	public static final short ASSIGN_TYPE_AUTO_INT = 1;		// 正向自动
	public static final short ASSIGN_TYPE_MANUAL_INT = 2;	// 手动
	public static final short ASSIGN_TYPE_REVERSE_INT = 3;	// 反向自动

	// 分配结果常量
	public static final short ASSIGN_RESULT_FAIL_INT = 0;	// 失败
	public static final short ASSIGN_RESULT_SUCCESS_INT = 1;	// 成功

	// 字段
	private long qarid;					// 记录ID
	private String orderId;				// 装修单号
	private UserPO user;				// 预算员用户对象（成功时有值）
	private short assignType;			// 分配类型：1-正向自动，2-手动，3-反向自动
	private short assignResult;			// 分配结果：1-成功，0-失败
	private UserPO assignUser;			// 分配人对象（手动分配时）
	private Timestamp assignTime;		// 分配时间
	private String failReason;			// 失败原因
	private Short decorationType;		// 装修类型

	// 构造函数
	public QuotationAssignRecordPO() {
		super();
		this.assignTime = new Timestamp(System.currentTimeMillis());
	}

	// Getter and Setter
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qarid")
	public long getQarid() {
		return qarid;
	}

	public void setQarid(long qarid) {
		this.qarid = qarid;
	}

	@Column(name = "orderId", nullable = false)
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uId")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "assignType", nullable = false)
	public short getAssignType() {
		return assignType;
	}

	public void setAssignType(short assignType) {
		this.assignType = assignType;
	}

	@Column(name = "assignResult", nullable = false)
	public short getAssignResult() {
		return assignResult;
	}

	public void setAssignResult(short assignResult) {
		this.assignResult = assignResult;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assignUid", referencedColumnName = "uId")
	public UserPO getAssignUser() {
		return assignUser;
	}

	public void setAssignUser(UserPO assignUser) {
		this.assignUser = assignUser;
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
	public Short getDecorationType() {
		return decorationType;
	}

	public void setDecorationType(Short decorationType) {
		this.decorationType = decorationType;
	}

	// PO 转 VO 方法
	public QuotationAssignRecordVO ptv(QuotationAssignRecordVO vo) {
		BeanUtil.copyProperties(this, vo);

		// 处理 user 关联对象（预算员）
		if (getUser() != null) {
			vo.setUid(getUser().getUid());
		}

		// 处理 assignUser 关联对象（分配人）
		if (getAssignUser() != null) {
			vo.setAssignUid(getAssignUser().getUid());
		}

		return vo;
	}
}
