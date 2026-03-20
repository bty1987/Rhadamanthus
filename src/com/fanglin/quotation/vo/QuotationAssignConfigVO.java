/**
 * @File Name		: QuotationAssignConfigVO.java
 * @Package   	: com.fanglin.quotation.vo
 * @Version		: 1.0
 * @Date			: 2026-03-19
 * @Copyright	: Copyright Creators 2026
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 预算配置表值对象
 */

package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.system.vo.CompanyVO;

/**
 * 预算配置表值对象
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
 * <li>companyVO: 公司信息（关联对象）</li>
 * <li>department: 部门ID</li>
 * <li>departmentVO: 部门信息（关联对象）</li>
 * <li>enabled: 是否启用（0-禁用，1-启用）</li>
 * <li>autoAssign: 是否自动分配（0-手动，1-自动）</li>
 * </ul>
 * 
 * <p>
 * 注意：
 * </p>
 * <ul>
 * <li>枚举值转换由前端处理，不在 VO 中添加转文字的方法</li>
 * <li>前端使用三元运算符：v.enabled == 1 ? "启用" : "禁用"</li>
 * <li>前端从 ds/*.json 文件读取枚举定义</li>
 * </ul>
 * 
 * @author bty1987
 * @version 1.0
 */
public class QuotationAssignConfigVO implements Serializable {

	private static final long serialVersionUID = -988461889194269257L;

	/**
	 * 配置ID
	 */
	private Long qacid;

	/**
	 * 公司信息（关联对象）
	 */
	private CompanyVO company;

	/**
	 * 部门信息（关联对象）
	 */
	private DepartmentVO department;

	/**
	 * 是否启用（0-禁用，1-启用）
	 */
	private Short enabled;

	/**
	 * 是否自动分配（0-手动，1-自动）
	 */
	private Short autoAssign;

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
	public QuotationAssignConfigVO() {
		super();
	}

	public QuotationAssignConfigVO(CompanyVO company, DepartmentVO department) {
		super();
		this.company = company;
		this.department = department;
	}

	/**
	 * 带主键的构造函数
	 * 
	 * @param qacid 配置ID
	 */
	public QuotationAssignConfigVO(Long qacid) {
		super();
		this.qacid = qacid;
	}

	// ==================== Getter/Setter ====================

	/**
	 * 获取配置ID
	 * 
	 * @return 配置ID
	 */
	public Long getQacid() {
		return qacid;
	}

	/**
	 * 设置配置ID
	 * 
	 * @param qacid 配置ID
	 */
	public void setQacid(Long qacid) {
		this.qacid = qacid;
	}

	/**
	 * 获取公司ID
	 * 
	 * @return 公司ID
	 */
	public CompanyVO getCompany() {
		return company;
	}

	/**
	 * 设置公司ID
	 * 
	 * @param company 公司ID
	 */
	public void setCompany(CompanyVO company) {
		this.company = company;
	}

	/**
	 * 获取部门ID
	 * 
	 * @return 部门ID（NULL表示该公司所有部门）
	 */
	public DepartmentVO getDepartment() {
		return department;
	}

	/**
	 * 设置部门ID
	 * 
	 * @param department 部门ID（NULL表示该公司所有部门）
	 */
	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}

	/**
	 * 获取是否启用状态
	 * 
	 * @return 是否启用（0-禁用，1-启用）
	 */
	public Short getEnabled() {
		return enabled;
	}

	/**
	 * 设置是否启用状态
	 * 
	 * @param enabled 是否启用（0-禁用，1-启用）
	 */
	public void setEnabled(Short enabled) {
		this.enabled = enabled;
	}

	/**
	 * 获取是否自动分配
	 * 
	 * @return 是否自动分配（0-手动，1-自动）
	 */
	public Short getAutoAssign() {
		return autoAssign;
	}

	/**
	 * 设置是否自动分配
	 * 
	 * @param autoAssign 是否自动分配（0-手动，1-自动）
	 */
	public void setAutoAssign(Short autoAssign) {
		this.autoAssign = autoAssign;
	}

	/**
	 * 获取创建时间
	 * 
	 * @return 创建时间
	 */
	@JSON(format = "yyyy-MM-dd")
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
	@JSON(format = "yyyy-MM-dd")
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
}
