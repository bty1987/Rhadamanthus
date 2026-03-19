/**
 * @File Name		: QuotationAssignConfigPO.java
 * @Package   	: com.fanglin.quotation.po
 * @Version		: 1.0
 * @Date			: 2026-03-19
 * @Copyright	: Copyright Creators 2026
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 预算配置表实体类
 */

package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.beans.BeanUtils;

import com.fanglin.quotation.vo.QuotationAssignConfigVO;

/**
 * 预算配置表实体类
 * 
 * <p>
 * 职责：控制哪些公司/部门启用预算员分配功能，以及分配方式
 * </p>
 * 
 * <p>
 * 核心字段：
 * </p>
 * <ul>
 * <li>qacid: 配置ID（主键）</li>
 * <li>company: 公司ID</li>
 * <li>department: 部门ID（NULL表示该公司所有部门）</li>
 * <li>enabled: 是否启用（0-禁用，1-启用）</li>
 * <li>autoAssign: 是否自动分配（0-手动，1-自动）</li>
 * </ul>
 * 
 * @author bty1987
 * @version 1.0
 */
@Entity
@Table(name = "quotationassignconfig", catalog = "quotation")
public class QuotationAssignConfigPO implements Serializable {

	private static final long serialVersionUID = 1L;

	// ==================== 常量定义 ====================

	/**
	 * 禁用状态（不使用预算员自动分配，走原流程）
	 */
	public static final Short ENABLED_DISABLED_INT = 0;

	/**
	 * 启用状态（使用预算员自动分配）
	 */
	public static final Short ENABLED_ENABLED_INT = 1;

	/**
	 * 手动分配（预算员完成后不自动分配，需要手动派单）
	 */
	public static final Short AUTO_ASSIGN_MANUAL_INT = 0;

	/**
	 * 自动分配（预算员完成后自动从队列分配）
	 */
	public static final Short AUTO_ASSIGN_AUTO_INT = 1;

	// ==================== 字段定义 ====================

	/**
	 * 配置ID（主键）
	 */
	private long qacid;

	/**
	 * 公司ID
	 */
	private int company;

	/**
	 * 部门ID（NULL表示该公司所有部门）
	 */
	private Integer department;

	/**
	 * 是否启用（0-禁用，1-启用）
	 */
	private short enabled;

	/**
	 * 是否自动分配（0-手动，1-自动）
	 */
	private short autoAssign;

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
	public QuotationAssignConfigPO() {
		super();
	}

	/**
	 * 带主键的构造函数
	 * 
	 * @param qacid 配置ID
	 */
	public QuotationAssignConfigPO(long qacid) {
		super();
		this.qacid = qacid;
	}

	// ==================== Getter/Setter ====================

	/**
	 * 获取配置ID
	 * 
	 * @return 配置ID
	 */
	@Id
	@GeneratedValue
	@Column(name = "qacid", unique = true, nullable = false)
	public long getQacid() {
		return qacid;
	}

	/**
	 * 设置配置ID
	 * 
	 * @param qacid 配置ID
	 */
	public void setQacid(long qacid) {
		this.qacid = qacid;
	}

	/**
	 * 获取公司ID
	 * 
	 * @return 公司ID
	 */
	@Column(name = "company", nullable = false)
	public int getCompany() {
		return company;
	}

	/**
	 * 设置公司ID
	 * 
	 * @param company 公司ID
	 */
	public void setCompany(int company) {
		this.company = company;
	}

	/**
	 * 获取部门ID
	 * 
	 * @return 部门ID（NULL表示该公司所有部门）
	 */
	@Column(name = "department")
	public Integer getDepartment() {
		return department;
	}

	/**
	 * 设置部门ID
	 * 
	 * @param department 部门ID（NULL表示该公司所有部门）
	 */
	public void setDepartment(Integer department) {
		this.department = department;
	}

	/**
	 * 获取是否启用状态
	 * 
	 * @return 是否启用（0-禁用，1-启用）
	 */
	@Column(name = "enabled", nullable = false)
	public short getEnabled() {
		return enabled;
	}

	/**
	 * 设置是否启用状态
	 * 
	 * @param enabled 是否启用（0-禁用，1-启用）
	 */
	public void setEnabled(short enabled) {
		this.enabled = enabled;
	}

	/**
	 * 获取是否自动分配
	 * 
	 * @return 是否自动分配（0-手动，1-自动）
	 */
	@Column(name = "autoAssign", nullable = false)
	public short getAutoAssign() {
		return autoAssign;
	}

	/**
	 * 设置是否自动分配
	 * 
	 * @param autoAssign 是否自动分配（0-手动，1-自动）
	 */
	public void setAutoAssign(short autoAssign) {
		this.autoAssign = autoAssign;
	}

	/**
	 * 获取创建时间
	 * 
	 * @return 创建时间
	 */
	@Column(name = "createTime", nullable = false, updatable = false)
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

	// ==================== 工具方法 ====================

	/**
	 * 判断是否启用
	 * 
	 * @return true-启用，false-禁用
	 */
	public boolean isEnabled() {
		return this.enabled == ENABLED_ENABLED_INT;
	}

	/**
	 * 判断是否自动分配
	 * 
	 * @return true-自动分配，false-手动分配
	 */
	public boolean isAutoAssign() {
		return this.autoAssign == AUTO_ASSIGN_AUTO_INT;
	}

	public QuotationAssignConfigVO ptv(QuotationAssignConfigVO quotationAssignConfigVO) {

		BeanUtils.copyProperties(this, quotationAssignConfigVO, "department", "company");

		return quotationAssignConfigVO;
	}
}
