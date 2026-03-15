package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CompanyVO;
import com.fanglin.personel.vo.UserBaseVO;

/**
 * 报价单预算员规则表 VO
 */
public class QuotationAssignUserRuleVO implements Serializable {

	private static final long serialVersionUID = 1L;

	// 基础字段
	private Long qaurid;				// 预算员规则ID
	private Integer uid;				// 用户ID（预算员工号）
	private Integer company;			// 关联公司ID
	private Integer department;			// 部门ID
	private Short status;				// 状态：1-待分配，2-制作中，3-停止，4-已完成
	private Timestamp lastFinishTime;	// 最后完成时间
	private Integer currentTaskCount;	// 当前任务数量
	private Timestamp createTime;		// 创建时间
	private Timestamp updateTime;		// 更新时间

	// 关联对象
	private UserBaseVO user;			// 预算员用户信息
	private CompanyVO companyVO;		// 公司信息
	private String departmentName;		// 部门名称
	private String statusName;			// 状态名称
	private String supportedTypes;		// 支持的类型（如："半包,整装"）

	// 构造函数
	public QuotationAssignUserRuleVO() {
		super();
	}

	// Getter and Setter
	public Long getQaurid() {
		return qaurid;
	}

	public void setQaurid(Long qaurid) {
		this.qaurid = qaurid;
	}

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Integer getDepartment() {
		return department;
	}

	public void setDepartment(Integer department) {
		this.department = department;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

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

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@JSON(serialize = false)
	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	@JSON(serialize = false)
	public CompanyVO getCompanyVO() {
		return companyVO;
	}

	public void setCompanyVO(CompanyVO companyVO) {
		this.companyVO = companyVO;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getStatusName() {
		return statusName;
	}

	public void setStatusName(String statusName) {
		this.statusName = statusName;
	}

	public String getSupportedTypes() {
		return supportedTypes;
	}

	public void setSupportedTypes(String supportedTypes) {
		this.supportedTypes = supportedTypes;
	}
}
