package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.vo.CompanyVO;

/**
 * 预算员规则表 VO
 * 
 * @author Claude AI
 * @date 2026-03-20
 */
public class QuotationAssignUserRuleVO implements Serializable {

	private static final long serialVersionUID = -988461889194269257L;

	/**
	 * 预算员规则ID
	 */
	private Long qaurid;

	/**
	 * 预算员用户对象
	 */
	private UserBaseVO user;

	/**
	 * 公司对象
	 */
	private CompanyVO company;

	/**
	 * 部门对象
	 */
	private DepartmentVO department;

	/**
	 * 状态: 1-待分配，2-制作中，3-停止
	 */
	private Short status;

	/**
	 * 支持的类型（单选）：-1通用，0半包，1整装
	 */
	private Integer supportedType;

	/**
	 * 最后完成时间
	 */
	private Timestamp lastFinishTime;

	/**
	 * 当前任务数量
	 */
	private Integer currentTaskCount;

	/**
	 * 创建时间
	 */
	private Timestamp createTime;

	/**
	 * 更新时间
	 */
	private Timestamp updateTime;

	/**
	 * 默认构造函数
	 */
	public QuotationAssignUserRuleVO() {
		super();
	}

	/**
	 * 带关联对象的构造函数
	 * 
	 * @param user 预算员用户对象
	 * @param company 公司对象
	 * @param department 部门对象
	 */
	public QuotationAssignUserRuleVO(UserBaseVO user, CompanyVO company, DepartmentVO department) {
		super();
		this.user = user;
		this.company = company;
		this.department = department;
	}

	// ==================== Getter & Setter ====================

	public Long getQaurid() {
		return qaurid;
	}

	public void setQaurid(Long qaurid) {
		this.qaurid = qaurid;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public CompanyVO getCompany() {
		return company;
	}

	public void setCompany(CompanyVO company) {
		this.company = company;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getSupportedType() {
		return supportedType;
	}

	public void setSupportedType(Integer supportedType) {
		this.supportedType = supportedType;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getLastFinishTime() {
		return lastFinishTime;
	}

	public void setLastFinishTime(Timestamp lastFinishTime) {
		this.lastFinishTime = lastFinishTime;
	}

	public Integer getCurrentTaskCount() {
		return currentTaskCount;
	}

	public void setCurrentTaskCount(Integer currentTaskCount) {
		this.currentTaskCount = currentTaskCount;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}
}
