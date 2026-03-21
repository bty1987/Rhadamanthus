/**
 * @File Name     : QuotationAssignVO.java
 * @Package      : com.fanglin.quotation.vo
 * @Version       : 1.0
 * @Date          : 2026-03-21
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员分配请求 VO
 */

package com.fanglin.quotation.vo;

import com.fanglin.personel.vo.UserBaseVO;

/**
 * 预算员分配请求 VO
 *
 * <p>
 * 用于封装预算员自动分配、手动分配、重新分配等操作的参数
 * </p>
 *
 * @author Claude AI
 * @version 1.0
 */
public class QuotationAssignVO {

	/**
	 * 装修单号
	 */
	private String orderId;

	/**
	 * 预算员ID（手动分配时使用）
	 */
	private Integer budgetUid;

	/**
	 * 新预算员ID（重新分配时使用）
	 */
	private Integer newBudgetUid;

	/**
	 * 分配人ID（预算经理，手动分配时使用）
	 */
	private Integer assignUid;

	/**
	 * 预算员信息（关联对象）
	 */
	private UserBaseVO budgetUser;

	/**
	 * 新预算员信息（重新分配时使用，关联对象）
	 */
	private UserBaseVO newBudgetUser;

	/**
	 * 分配人信息（关联对象）
	 */
	private UserBaseVO assignUser;

	public QuotationAssignVO() {
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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

	public UserBaseVO getBudgetUser() {
		return budgetUser;
	}

	public void setBudgetUser(UserBaseVO budgetUser) {
		this.budgetUser = budgetUser;
	}

	public UserBaseVO getNewBudgetUser() {
		return newBudgetUser;
	}

	public void setNewBudgetUser(UserBaseVO newBudgetUser) {
		this.newBudgetUser = newBudgetUser;
	}

	public UserBaseVO getAssignUser() {
		return assignUser;
	}

	public void setAssignUser(UserBaseVO assignUser) {
		this.assignUser = assignUser;
	}
}
