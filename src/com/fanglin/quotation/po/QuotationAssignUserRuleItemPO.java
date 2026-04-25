/**
 * @File Name     : QuotationAssignUserRuleItemPO.java
 * @Package      : com.fanglin.quotation.po
 * @Version       : 1.0
 * @Date          : 2026-04-21
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员规则明细表实体类（公司/部门/业务类型维度）
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
import com.fanglin.quotation.vo.QuotationAssignUserRuleItemVO;
import com.fanglin.system.po.CompanyPO;

/**
 * 预算员规则明细表实体类
 * 
 * <p>
 * 职责：定义预算员在特定公司/部门下支持的装修类型
 * </p>
 * 
 * <p>
 * 核心字段：
 * </p>
 * <ul>
 * <li>qauriid: 明细ID（主键）</li>
 * <li>userRule: 所属预算员规则（外键）</li>
 * <li>company: 公司</li>
 * <li>department: 部门（NULL表示该公司所有部门）</li>
 * <li>supportedType: 支持的装修类型（-1通用，0半包，1整装）</li>
 * </ul>
 * 
 * @author Claude AI
 * @version 1.0
 */
@Entity
@Table(name = "quotationassignuserruleitem", catalog = "quotation")
public class QuotationAssignUserRuleItemPO implements Serializable {

	private static final long serialVersionUID = -5713284976684534443L;

	// ==================== 字段定义 ====================

	/**
	 * 明细ID（主键）
	 */
	private long qauriid;

	/**
	 * 所属预算员规则
	 */
	private QuotationAssignUserRulePO userRule;

	/**
	 * 关联公司对象
	 */
	private CompanyPO company;

	/**
	 * 部门对象（NULL表示该公司所有部门）
	 */
	private DepartmentPO department;

	/**
	 * 支持的类型：-1通用，0半包，1整装
	 */
	private int supportedType;

	/**
	 * 创建时间
	 */
	private Timestamp createTime;

	/**
	 * 更新时间
	 */
	private Timestamp updateTime;

	// ==================== 构造函数 ====================

	public QuotationAssignUserRuleItemPO() {
		super();
	}

	public QuotationAssignUserRuleItemPO(long qauriid) {
		super();
		this.qauriid = qauriid;
	}

	// ==================== Getter/Setter ====================

	@Id
	@GeneratedValue
	@Column(name = "qauriid", unique = true, nullable = false)
	public long getQauriid() {
		return qauriid;
	}

	public void setQauriid(long qauriid) {
		this.qauriid = qauriid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "qaurid", referencedColumnName = "qaurid")
	public QuotationAssignUserRulePO getUserRule() {
		return userRule;
	}

	public void setUserRule(QuotationAssignUserRulePO userRule) {
		this.userRule = userRule;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "cid")
	public CompanyPO getCompany() {
		return company;
	}

	public void setCompany(CompanyPO company) {
		this.company = company;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "department", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@Column(name = "supportedType", nullable = false)
	public int getSupportedType() {
		return supportedType;
	}

	public void setSupportedType(int supportedType) {
		this.supportedType = supportedType;
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

	public QuotationAssignUserRuleItemVO ptv(QuotationAssignUserRuleItemVO vo) throws FLException {

		BeanUtils.copyProperties(this, vo, "userRule", "company", "department");

		if (vo.getCompany() != null && getCompany() != null) getCompany().ptv(vo.getCompany());
		if (vo.getDepartment() != null && getDepartment() != null) getDepartment().ptv(vo.getDepartment());

		return vo;
	}
}
