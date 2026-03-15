package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CompanyVO;

/**
 * 报价单预算配置表 VO
 */
public class QuotationAssignConfigVO implements Serializable {

	private static final long serialVersionUID = 1L;

	// 字段
	private Long qacid;				// 配置ID
	private Integer company;			// 公司ID
	private Integer department;			// 部门ID
	private Short enabled;				// 是否启用：0-禁用，1-启用
	private String enabledName;			// 启用状态名称
	private Short autoAssign;			// 是否自动分配：0-手动，1-自动
	private String autoAssignName;		// 自动分配状态名称
	private Timestamp createTime;		// 创建时间
	private Timestamp updateTime;		// 更新时间

	// 关联对象
	private CompanyVO companyVO;		// 公司信息
	private String departmentName;		// 部门名称

	// 构造函数
	public QuotationAssignConfigVO() {
		super();
	}

	// Getter and Setter
	public Long getQacid() {
		return qacid;
	}

	public void setQacid(Long qacid) {
		this.qacid = qacid;
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

	public Short getEnabled() {
		return enabled;
	}

	public void setEnabled(Short enabled) {
		this.enabled = enabled;
	}

	public String getEnabledName() {
		return enabledName;
	}

	public void setEnabledName(String enabledName) {
		this.enabledName = enabledName;
	}

	public Short getAutoAssign() {
		return autoAssign;
	}

	public void setAutoAssign(Short autoAssign) {
		this.autoAssign = autoAssign;
	}

	public String getAutoAssignName() {
		return autoAssignName;
	}

	public void setAutoAssignName(String autoAssignName) {
		this.autoAssignName = autoAssignName;
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
}
