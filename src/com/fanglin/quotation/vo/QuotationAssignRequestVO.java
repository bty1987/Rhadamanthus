package com.fanglin.quotation.vo;

import java.sql.Timestamp;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.vo.CompanyVO;

/**
 * 装修单预算分配请求表 VO
 * 
 * @author Claude AI
 * @date 2026-03-20
 */
public class QuotationAssignRequestVO {

	/**
	 * 请求ID
	 */
	private Long qarid;

	/**
	 * 装修单号
	 */
	private String orderId;

	/**
	 * 公司对象
	 */
	private CompanyVO company;

	/**
	 * 部门对象
	 */
	private DepartmentVO department;

	/**
	 * 装修类型：1-半包，2-整装
	 */
	private Short decorationType;

	/**
	 * 优先级：1-最高，5-普通，9-最低
	 */
	private Short priority;

	/**
	 * 请求时间
	 */
	private Timestamp requestTime;

	/**
	 * 请求人用户对象
	 */
	private UserBaseVO requestUser;

	/**
	 * 状态: 1-待分配，2-已分配，3-已完成
	 */
	private Short status;

	/**
	 * 分配给的预算员用户对象（ManyToMany关联，包含uid等信息）
	 */
	private UserBaseVO user;

	/**
	 * 分配时间
	 */
	private Timestamp assignTime;

	/**
	 * 完成时间（报价交付时间）
	 */
	private Timestamp finishTime;

	/**
	 * 备注
	 */
	private String remark;

	/**
	 * 创建时间
	 */
	private Timestamp createTime;

	// ==================== Getter & Setter ====================

	public Long getQarid() {
		return qarid;
	}

	public void setQarid(Long qarid) {
		this.qarid = qarid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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

	public Short getDecorationType() {
		return decorationType;
	}

	public void setDecorationType(Short decorationType) {
		this.decorationType = decorationType;
	}

	public Short getPriority() {
		return priority;
	}

	public void setPriority(Short priority) {
		this.priority = priority;
	}

	public Timestamp getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(Timestamp requestTime) {
		this.requestTime = requestTime;
	}

	public UserBaseVO getRequestUser() {
		return requestUser;
	}

	public void setRequestUser(UserBaseVO requestUser) {
		this.requestUser = requestUser;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public Timestamp getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(Timestamp assignTime) {
		this.assignTime = assignTime;
	}

	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
}
