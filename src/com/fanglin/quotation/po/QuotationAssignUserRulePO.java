/**
 * @File Name     : QuotationAssignUserRulePO.java
 * @Package      : com.fanglin.quotation.po
 * @Version       : 2.0
 * @Date          : 2026-04-21
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员规则表实体类（人员维度）
 */

package com.fanglin.quotation.po;

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

import org.springframework.beans.BeanUtils;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;

/**
 * 预算员规则表实体类（人员维度，每人一条记录）
 * 
 * <p>
 * 职责：定义哪些用户可以作为预算员，以及其当前状态 公司/部门/业务类型维度通过 QuotationAssignUserRuleItemPO 维护
 * </p>
 * 
 * @author Claude AI
 * @version 2.0
 */
@Entity
@Table(name = "quotationassignuserrule", catalog = "quotation")
public class QuotationAssignUserRulePO implements Serializable {

	private static final long serialVersionUID = 2946584976684534443L;

	// ==================== 常量定义 ====================

	/** 状态：待分配（可接收新任务） */
	public static final short STATUS_AVAILABLE_INT = 1;

	/** 状态：制作中（正在处理任务） */
	public static final short STATUS_BUSY_INT = 2;

	/** 状态：停止（不再接收任务） */
	public static final short STATUS_STOPPED_INT = 3;

	/** 支持类型：通用（支持所有装修类型） */
	public static final int SUPPORTED_TYPE_ALL_INT = -1;

	/** 支持类型：半包 */
	public static final int SUPPORTED_TYPE_HALF_INT = 0;

	/** 支持类型：整装 */
	public static final int SUPPORTED_TYPE_FULL_INT = 1;

	// ==================== 字段定义 ====================

	/** 预算员规则ID（主键） */
	private long qaurid;

	/** 预算员用户对象 */
	private UserPO user;

	/** 状态: 1-待分配，2-制作中，3-停止 */
	private short status;

	/** 最后完成时间（用于自动分配排序） */
	private Timestamp lastFinishTime;

	/** 当前任务数量（缓存字段） */
	private int currentTaskCount;

	/** 任务数量统计时间 */
	private Timestamp taskCountUpdateTime;

	/** 创建时间 */
	private Timestamp createTime;

	/** 更新时间 */
	private Timestamp updateTime;

	// ==================== 构造函数 ====================

	public QuotationAssignUserRulePO() {
		super();
	}

	public QuotationAssignUserRulePO(long qaurid) {
		super();
		this.qaurid = qaurid;
	}

	// ==================== Getter/Setter ====================

	@Id
	@GeneratedValue
	@Column(name = "qaurid", unique = true, nullable = false)
	public long getQaurid() {
		return qaurid;
	}

	public void setQaurid(long qaurid) {
		this.qaurid = qaurid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "status", nullable = false)
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
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
	public int getCurrentTaskCount() {
		return currentTaskCount;
	}

	public void setCurrentTaskCount(int currentTaskCount) {
		this.currentTaskCount = currentTaskCount;
	}

	@Column(name = "taskCountUpdateTime")
	public Timestamp getTaskCountUpdateTime() {
		return taskCountUpdateTime;
	}

	public void setTaskCountUpdateTime(Timestamp taskCountUpdateTime) {
		this.taskCountUpdateTime = taskCountUpdateTime;
	}

	@Column(name = "createTime", nullable = false)
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "updateTime", nullable = false)
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	// ==================== PO/VO 转换方法 ====================

	public QuotationAssignUserRuleVO ptv(QuotationAssignUserRuleVO vo) throws FLException {

		BeanUtils.copyProperties(this, vo, "user");

		if (vo.getUser() != null && getUser() != null) vo.getUser().setBaseInfo(getUser());

		return vo;
	}
}
