package com.fanglin.quotation.vo;

import java.io.Serializable;

/**
 * 报价单预算分配 VO
 * 职责：封装预算分配相关的请求参数
 */
public class QuotationAssignVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private String orderId; // 装修单号
	private Integer companyId; // 公司ID
	private Integer department; // 部门ID
	private Short decorationType; // 装修类型：1-半包，2-整装
	private Integer budgetUid; // 预算员用户ID
	private Integer newBudgetUid; // 新预算员用户ID（重新分配时使用）
	private Integer assignUid; // 分配人用户ID（手动分配时使用）
	private String remark; // 备注

	// Getter and Setter

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Integer getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Integer companyId) {
		this.companyId = companyId;
	}

	public Integer getDepartment() {
		return department;
	}

	public void setDepartment(Integer department) {
		this.department = department;
	}

	public Short getDecorationType() {
		return decorationType;
	}

	public void setDecorationType(Short decorationType) {
		this.decorationType = decorationType;
	}

	public Integer getBudgetUid() {
		return budgetUid;
	}

	public void setBudgetUid(Integer budgetUid) {
		this.budgetUid = budgetUid;
	}

	public Integer getNewBudgetUid() {
		return newBudgetUid;
	}

	public void setNewBudgetUid(Integer newBudgetUid) {
		this.newBudgetUid = newBudgetUid;
	}

	public Integer getAssignUid() {
		return assignUid;
	}

	public void setAssignUid(Integer assignUid) {
		this.assignUid = assignUid;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
}
