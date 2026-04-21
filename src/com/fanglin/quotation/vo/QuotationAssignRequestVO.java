package com.fanglin.quotation.vo;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.po.UserPO;
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
	private String requestTime;

	/**
	 * 请求人用户对象
	 */
	private UserPO requestUser;

	/**
	 * 状态: 1-待分配，2-已分配，3-已完成
	 */
	private Short status;

	/**
	 * 分配给的预算员用户ID
	 */
	private Integer uid;

	/**
	 * 分配给的预算员用户对象
	 */
	private UserPO user;

	/**
	 * 分配时间
	 */
	private String assignTime;

	/**
	 * 完成时间（报价交付时间）
	 */
	private String finishTime;

	/**
	 * 备注
	 */
	private String remark;

	/**
	 * 创建时间
	 */
	private String createTime;

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

	public String getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(String requestTime) {
		this.requestTime = requestTime;
	}

	public UserPO getRequestUser() {
		return requestUser;
	}

	public void setRequestUser(UserPO requestUser) {
		this.requestUser = requestUser;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	public String getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(String assignTime) {
		this.assignTime = assignTime;
	}

	public String getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(String finishTime) {
		this.finishTime = finishTime;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
}
