package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.system.vo.CompanyVO;

/**
 * 预算员规则明细表 VO（公司/部门/业务类型维度）
 * 
 * @author Claude AI
 * @date 2026-04-21
 */
public class QuotationAssignUserRuleItemVO implements Serializable {

	private static final long serialVersionUID = -8875618891942692571L;

	/**
	 * 明细ID
	 */
	private Long qauriid;

	/**
	 * 所属规则ID
	 */
	private Long qaurid;

	/**
	 * 公司对象
	 */
	private CompanyVO company;

	/**
	 * 部门对象
	 */
	private DepartmentVO department;

	/**
	 * 支持的类型：-1通用，0半包，1整装
	 */
	private Integer supportedType;

	/**
	 * 创建时间
	 */
	private Timestamp createTime;

	/**
	 * 更新时间
	 */
	private Timestamp updateTime;

	public QuotationAssignUserRuleItemVO() {
		super();
	}

	public QuotationAssignUserRuleItemVO(CompanyVO company, DepartmentVO department) {
		super();
		this.company = company;
		this.department = department;
	}

	// ==================== Getter & Setter ====================

	public Long getQauriid() {
		return qauriid;
	}

	public void setQauriid(Long qauriid) {
		this.qauriid = qauriid;
	}

	public Long getQaurid() {
		return qaurid;
	}

	public void setQaurid(Long qaurid) {
		this.qaurid = qaurid;
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

	public Integer getSupportedType() {
		return supportedType;
	}

	public void setSupportedType(Integer supportedType) {
		this.supportedType = supportedType;
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
