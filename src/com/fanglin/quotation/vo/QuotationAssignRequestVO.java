package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.vo.CompanyVO;

/**
 * 装修单预算分配请求表 VO
 */
public class QuotationAssignRequestVO implements Serializable {

	private static final long serialVersionUID = 1L;

	// 字段
	private Integer barid; // 请求ID
	private String orderId; // 装修单号
	private Integer company; // 公司ID
	private Integer department; // 部门ID
	private Byte decorationType; // 装修类型：1-半包，2-整装
	private String decorationTypeName; // 装修类型名称
	private Byte priority; // 优先级：1-最高，5-普通，9-最低
	private String priorityName; // 优先级名称
	private Timestamp requestTime; // 请求时间
	private Integer requestUid; // 请求人用户ID（设计师）
	private Byte status; // 状态：1-待分配，2-已分配
	private String statusName; // 状态名称
	private Timestamp assignTime; // 分配时间
	private String remark; // 备注

	// 关联对象
	private DecorationVO decoration; // 装修单信息
	private UserBaseVO requestUser; // 请求人（设计师）
	private UserBaseVO assignBudgetUser; // 分配的预算员
	private CompanyVO companyVO; // 公司信息
	private String departmentName; // 部门名称

	// 计算字段
	private Integer waitTime; // 等待时长（分钟）
	private Integer queuePosition; // 队列位置

	// 构造函数
	public QuotationAssignRequestVO() {
		super();
	}

	// Getter and Setter
	public Integer getBarid() {
		return barid;
	}

	public void setBarid(Integer barid) {
		this.barid = barid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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

	public Byte getDecorationType() {
		return decorationType;
	}

	public void setDecorationType(Byte decorationType) {
		this.decorationType = decorationType;
	}

	public String getDecorationTypeName() {
		return decorationTypeName;
	}

	public void setDecorationTypeName(String decorationTypeName) {
		this.decorationTypeName = decorationTypeName;
	}

	public Byte getPriority() {
		return priority;
	}

	public void setPriority(Byte priority) {
		this.priority = priority;
	}

	public String getPriorityName() {
		return priorityName;
	}

	public void setPriorityName(String priorityName) {
		this.priorityName = priorityName;
	}

	public Timestamp getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(Timestamp requestTime) {
		this.requestTime = requestTime;
	}

	public Integer getRequestUid() {
		return requestUid;
	}

	public void setRequestUid(Integer requestUid) {
		this.requestUid = requestUid;
	}

	public Byte getStatus() {
		return status;
	}

	public void setStatus(Byte status) {
		this.status = status;
	}

	public String getStatusName() {
		return statusName;
	}

	public void setStatusName(String statusName) {
		this.statusName = statusName;
	}

	public Timestamp getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(Timestamp assignTime) {
		this.assignTime = assignTime;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@JSON(serialize = false)
	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	@JSON(serialize = false)
	public UserBaseVO getRequestUser() {
		return requestUser;
	}

	public void setRequestUser(UserBaseVO requestUser) {
		this.requestUser = requestUser;
	}

	@JSON(serialize = false)
	public UserBaseVO getAssignBudgetUser() {
		return assignBudgetUser;
	}

	public void setAssignBudgetUser(UserBaseVO assignBudgetUser) {
		this.assignBudgetUser = assignBudgetUser;
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

	public Integer getWaitTime() {
		return waitTime;
	}

	public void setWaitTime(Integer waitTime) {
		this.waitTime = waitTime;
	}

	public Integer getQueuePosition() {
		return queuePosition;
	}

	public void setQueuePosition(Integer queuePosition) {
		this.queuePosition = queuePosition;
	}
}
