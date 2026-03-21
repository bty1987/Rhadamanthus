/**
 * @File Name     : QuotationAssignUserRulePO.java
 * @Package      : com.fanglin.quotation.po
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员规则表实体类
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

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;
import com.fanglin.system.po.CompanyPO;

/**
 * 预算员规则表实体类
 * 
 * <p>
 * 职责：定义哪些用户可以作为预算员，以及其当前状态
 * </p>
 * 
 * <p>
 * 核心字段：
 * </p>
 * <ul>
 * <li>qaurid: 规则ID（主键）</li>
 * <li>uid: 用户ID（预算员工号）</li>
 * <li>company: 公司ID</li>
 * <li>department: 部门ID（NULL表示该公司所有部门）</li>
 * <li>status: 状态（1-待分配，2-制作中，3-停止）</li>
 * <li>lastFinishTime: 最后完成时间（用于自动分配排序）</li>
 * <li>currentTaskCount: 当前任务数量</li>
 * </ul>
 * 
 * @author Claude AI
 * @version 1.0
 */
@Entity
@Table(name = "quotationassignuserrule", catalog = "quotation")
public class QuotationAssignUserRulePO implements Serializable {

	private static final long serialVersionUID = 2946584976684534443L;

	// ==================== 常量定义 ====================

	/**
	 * 状态：待分配（可接收新任务）
	 */
	public static final short STATUS_AVAILABLE_INT = 1;

	/**
	 * 状态：制作中（正在处理任务）
	 */
	public static final short STATUS_BUSY_INT = 2;

	/**
	 * 状态：停止（不再接收任务）
	 */
	public static final short STATUS_STOPPED_INT = 3;

	/**
	 * 支持类型：通用（支持所有装修类型）
	 */
	public static final int SUPPORTED_TYPE_ALL_INT = -1;

	/**
	 * 支持类型：半包
	 */
	public static final int SUPPORTED_TYPE_HALF_INT = 0;

	/**
	 * 支持类型：整装
	 */
	public static final int SUPPORTED_TYPE_FULL_INT = 1;

	// ==================== 字段定义 ====================

	/**
	 * 预算员规则ID（主键）
	 */
	private long qaurid;

	/**
	 * 预算员用户对象
	 */
	private UserPO user;

	/**
	 * 关联公司对象
	 */
	private CompanyPO company;

	/**
	 * 部门对象（NULL表示该公司所有部门）
	 */
	private DepartmentPO department;

	/**
	 * 状态: 1-待分配(可接收新任务)，2-制作中(正在处理任务)，3-停止(不再接收任务)
	 */
	private short status;

	/**
	 * 支持的类型：-1通用，0半包，1整装
	 */
	private int supportedType;

	/**
	 * 最后完成时间（用于自动分配排序，最早完成的优先）
	 */
	private Timestamp lastFinishTime;

	/**
	 * 当前任务数量（缓存字段，基于quotationassignrequest统计）
	 */
	private int currentTaskCount;

	/**
	 * 任务数量统计时间（用于判断缓存是否过期）
	 */
	private Timestamp taskCountUpdateTime;

	/**
	 * 创建时间
	 */
	private Timestamp createTime;

	/**
	 * 更新时间
	 */
	private Timestamp updateTime;

	// ==================== 构造函数 ====================

	/**
	 * 默认构造函数
	 */
	public QuotationAssignUserRulePO() {
		super();
	}

	/**
	 * 带主键的构造函数
	 * 
	 * @param qaurid 预算员规则ID
	 */
	public QuotationAssignUserRulePO(long qaurid) {
		super();
		this.qaurid = qaurid;
	}

	// ==================== Getter/Setter ====================

	/**
	 * 获取预算员规则ID
	 * 
	 * @return 预算员规则ID
	 */
	@Id
	@GeneratedValue
	@Column(name = "qaurid", unique = true, nullable = false)
	public long getQaurid() {
		return qaurid;
	}

	/**
	 * 设置预算员规则ID
	 * 
	 * @param qaurid 预算员规则ID
	 */
	public void setQaurid(long qaurid) {
		this.qaurid = qaurid;
	}

	/**
	 * 获取预算员用户对象
	 * 
	 * @return 预算员用户对象
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	/**
	 * 设置预算员用户对象
	 * 
	 * @param user 预算员用户对象
	 */
	public void setUser(UserPO user) {
		this.user = user;
	}

	/**
	 * 获取公司对象
	 * 
	 * @return 公司对象
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "cid")
	public CompanyPO getCompany() {
		return company;
	}

	/**
	 * 设置公司对象
	 * 
	 * @param company 公司对象
	 */
	public void setCompany(CompanyPO company) {
		this.company = company;
	}

	/**
	 * 获取部门对象
	 * 
	 * @return 部门对象（NULL表示该公司所有部门）
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "department", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	/**
	 * 设置部门对象
	 * 
	 * @param department 部门对象（NULL表示该公司所有部门）
	 */
	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	/**
	 * 获取状态
	 * 
	 * @return 状态
	 */
	@Column(name = "status", nullable = false)
	public short getStatus() {
		return status;
	}

	/**
	 * 设置状态
	 * 
	 * @param status 状态
	 */
	public void setStatus(short status) {
		this.status = status;
	}

	/**
	 * 获取支持类型
	 * 
	 * @return 支持类型（-1通用，0半包，1整装）
	 */
	@Column(name = "supportedType", nullable = false)
	public int getSupportedType() {
		return supportedType;
	}

	/**
	 * 设置支持类型
	 * 
	 * @param supportedType 支持类型（-1通用，0半包，1整装）
	 */
	public void setSupportedType(int supportedType) {
		this.supportedType = supportedType;
	}

	/**
	 * 获取最后完成时间
	 * 
	 * @return 最后完成时间
	 */
	@Column(name = "lastFinishTime")
	public Timestamp getLastFinishTime() {
		return lastFinishTime;
	}

	/**
	 * 设置最后完成时间
	 * 
	 * @param lastFinishTime 最后完成时间
	 */
	public void setLastFinishTime(Timestamp lastFinishTime) {
		this.lastFinishTime = lastFinishTime;
	}

	/**
	 * 获取当前任务数量
	 * 
	 * @return 当前任务数量
	 */
	@Column(name = "currentTaskCount")
	public int getCurrentTaskCount() {
		return currentTaskCount;
	}

	/**
	 * 设置当前任务数量
	 * 
	 * @param currentTaskCount 当前任务数量
	 */
	public void setCurrentTaskCount(int currentTaskCount) {
		this.currentTaskCount = currentTaskCount;
	}

	/**
	 * 获取任务数量统计时间
	 * 
	 * @return 任务数量统计时间
	 */
	@Column(name = "taskCountUpdateTime")
	public Timestamp getTaskCountUpdateTime() {
		return taskCountUpdateTime;
	}

	/**
	 * 设置任务数量统计时间
	 * 
	 * @param taskCountUpdateTime 任务数量统计时间
	 */
	public void setTaskCountUpdateTime(Timestamp taskCountUpdateTime) {
		this.taskCountUpdateTime = taskCountUpdateTime;
	}

	/**
	 * 获取创建时间
	 * 
	 * @return 创建时间
	 */
	@Column(name = "createTime", nullable = false)
	public Timestamp getCreateTime() {
		return createTime;
	}

	/**
	 * 设置创建时间
	 * 
	 * @param createTime 创建时间
	 */
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	/**
	 * 获取更新时间
	 * 
	 * @return 更新时间
	 */
	@Column(name = "updateTime", nullable = false)
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	/**
	 * 设置更新时间
	 * 
	 * @param updateTime 更新时间
	 */
	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	// ==================== PO/VO 转换方法 ====================

	/**
	 * PO 转 VO
	 * 
	 * @param quotationAssignUserRuleVO VO对象
	 * @return 转换后的VO对象
	 */
	public QuotationAssignUserRuleVO ptv(QuotationAssignUserRuleVO quotationAssignUserRuleVO) throws FLException {

		BeanUtils.copyProperties(this, quotationAssignUserRuleVO, "user", "company", "department");

		if (quotationAssignUserRuleVO.getUser() != null && getUser() != null) quotationAssignUserRuleVO.getUser().setBaseInfo(getUser());
		if (quotationAssignUserRuleVO.getCompany() != null && getCompany() != null) getCompany().ptv(quotationAssignUserRuleVO.getCompany());
		if (quotationAssignUserRuleVO.getDepartment() != null && getDepartment() != null) getDepartment().ptv(quotationAssignUserRuleVO.getDepartment());

		return quotationAssignUserRuleVO;
	}
}
