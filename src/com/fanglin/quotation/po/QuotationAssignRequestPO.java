/**
 * @File Name     : QuotationAssignRequestPO.java
 * @Package      : com.fanglin.quotation.po
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配请求表实体类
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
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.system.po.CompanyPO;

/**
 * 装修单预算分配请求表实体类
 * 
 * <p>
 * 职责：控制分配逻辑和待分配队列（装修单级别，最多1条活跃记录）
 * </p>
 * 
 * <p>
 * 核心字段：
 * </p>
 * <ul>
 * <li>qarid: 请求ID（主键）</li>
 * <li>orderId: 装修单号（关联 decoration.orderId）</li>
 * <li>company: 公司ID</li>
 * <li>department: 部门ID（NULL表示该公司所有部门）</li>
 * <li>decorationType: 装修类型（0-半包，1-整装，2-全包，与DecorationPO.type一致）</li>
 * <li>priority: 优先级（1-最高，5-普通，9-最低）</li>
 * <li>status: 状态（1-待分配，2-已分配）</li>
 * <li>requestTime: 请求加入队列的时间</li>
 * <li>assignTime: 分配时间</li>
 * </ul>
 * 
 * @author Claude AI
 * @version 1.0
 */
@Entity
@Table(name = "quotationassignrequest", catalog = "quotation")
public class QuotationAssignRequestPO implements Serializable {

	private static final long serialVersionUID = 1L;

	// ==================== 常量定义 ====================

	/**
	 * 状态：待分配（在队列中等待）
	 */
	public static final Short STATUS_PENDING_INT = 1;

	/**
	 * 状态：已分配（成功分配给预算员）
	 */
	public static final Short STATUS_ASSIGNED_INT = 2;

	/**
	 * 状态：已完成（报价已交付）
	 */
	public static final Short STATUS_COMPLETED_INT = 3;

	/**
	 * 优先级：最高
	 */
	public static final Short PRIORITY_HIGHEST_INT = 1;

	/**
	 * 优先级：高
	 */
	public static final Short PRIORITY_HIGH_INT = 3;

	/**
	 * 优先级：普通（默认）
	 */
	public static final Short PRIORITY_NORMAL_INT = 5;

	/**
	 * 优先级：低
	 */
	public static final Short PRIORITY_LOW_INT = 7;

	/**
	 * 优先级：最低
	 */
	public static final Short PRIORITY_LOWEST_INT = 9;

	// ==================== 字段定义 ====================

	/**
	 * 请求ID（主键）
	 */
	private long qarid;

	/**
	 * 装修单号（关联 decoration.orderId）
	 */
	private String orderId;

	/**
	 * 关联公司
	 */
	private CompanyPO company;

	/**
	 * 部门（NULL表示该公司所有部门）
	 */
	private DepartmentPO department;

	/**
	 * 装修类型：0-半包，1-整装，2-全包（与DecorationPO.type取值一致）
	 */
	private short decorationType;

	/**
	 * 优先级：1-最高，5-普通，9-最低
	 */
	private short priority;

	/**
	 * 请求加入队列的时间
	 */
	private Timestamp requestTime;

	/**
	 * 请求人（设计师）
	 */
	private UserPO requestUser;

	/**
	 * 状态: 1-待分配(在队列中等待)，2-已分配(成功分配给预算员)，3-已完成(报价已交付)
	 */
	private short status;

	/**
	 * 分配给的预算员（status=2时有值，status=1时为NULL）
	 */
	private UserPO user;

	/**
	 * 分配时间（status=2时有值，status=1时为NULL）
	 */
	private Timestamp assignTime;

	/**
	 * 完成时间（status=3时有值，报价交付时间）
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

	// ==================== 构造函数 ====================

	/**
	 * 默认构造函数
	 */
	public QuotationAssignRequestPO() {
		super();
	}

	/**
	 * 带主键的构造函数
	 * 
	 * @param qarid 请求ID
	 */
	public QuotationAssignRequestPO(long qarid) {
		super();
		this.qarid = qarid;
	}

	// ==================== Getter/Setter ====================

	/**
	 * 获取请求ID
	 * 
	 * @return 请求ID
	 */
	@Id
	@GeneratedValue
	@Column(name = "qarid", unique = true, nullable = false)
	public long getQarid() {
		return qarid;
	}

	/**
	 * 设置请求ID
	 * 
	 * @param qarid 请求ID
	 */
	public void setQarid(long qarid) {
		this.qarid = qarid;
	}

	/**
	 * 获取装修单号
	 * 
	 * @return 装修单号
	 */
	@Column(name = "orderId", nullable = false, length = 15)
	public String getOrderId() {
		return orderId;
	}

	/**
	 * 设置装修单号
	 * 
	 * @param orderId 装修单号
	 */
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	/**
	 * 获取关联公司
	 * 
	 * @return 公司对象
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "cid")
	public CompanyPO getCompany() {
		return company;
	}

	/**
	 * 设置关联公司
	 * 
	 * @param company 公司对象
	 */
	public void setCompany(CompanyPO company) {
		this.company = company;
	}

	/**
	 * 获取部门
	 * 
	 * @return 部门对象（NULL表示该公司所有部门）
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "department", referencedColumnName = "dId")
	public DepartmentPO getDepartment() {
		return department;
	}

	/**
	 * 设置部门
	 * 
	 * @param department 部门对象（NULL表示该公司所有部门）
	 */
	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	/**
	 * 获取装修类型
	 * 
	 * @return 装修类型（0-半包，1-整装，2-全包，与DecorationPO.type一致）
	 */
	@Column(name = "decorationType", nullable = false)
	public short getDecorationType() {
		return decorationType;
	}

	/**
	 * 设置装修类型
	 * 
	 * @param decorationType 装修类型（0-半包，1-整装，2-全包，与DecorationPO.type一致）
	 */
	public void setDecorationType(short decorationType) {
		this.decorationType = decorationType;
	}

	/**
	 * 获取优先级
	 * 
	 * @return 优先级（1-最高，5-普通，9-最低）
	 */
	@Column(name = "priority", nullable = false)
	public short getPriority() {
		return priority;
	}

	/**
	 * 设置优先级
	 * 
	 * @param priority 优先级（1-最高，5-普通，9-最低）
	 */
	public void setPriority(short priority) {
		this.priority = priority;
	}

	/**
	 * 获取请求时间
	 * 
	 * @return 请求时间
	 */
	@Column(name = "requestTime", nullable = false)
	public Timestamp getRequestTime() {
		return requestTime;
	}

	/**
	 * 设置请求时间
	 * 
	 * @param requestTime 请求时间
	 */
	public void setRequestTime(Timestamp requestTime) {
		this.requestTime = requestTime;
	}

	/**
	 * 获取请求人
	 * 
	 * @return 请求人用户对象
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "requestUid", referencedColumnName = "uid")
	public UserPO getRequestUser() {
		return requestUser;
	}

	/**
	 * 设置请求人
	 * 
	 * @param requestUser 请求人用户对象
	 */
	public void setRequestUser(UserPO requestUser) {
		this.requestUser = requestUser;
	}

	/**
	 * 获取状态
	 * 
	 * @return 状态
	 */
	@Column(name = "status", nullable = false)
	public short getStatus() {
		return status;
	}

	/**
	 * 设置状态
	 *
	 * @param status 状态
	 */
	public void setStatus(short status) {
		this.status = status;
	}

	/**
	 * 获取分配给的预算员
	 *
	 * @return 预算员用户对象
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	/**
	 * 设置分配给的预算员
	 *
	 * @param user 预算员用户对象
	 */
	public void setUser(UserPO user) {
		this.user = user;
	}

	/**
	 * 获取分配时间
	 *
	 * @return 分配时间
	 */
	@Column(name = "assignTime")
	public Timestamp getAssignTime() {
		return assignTime;
	}

	/**
	 * 设置分配时间
	 * 
	 * @param assignTime 分配时间
	 */
	public void setAssignTime(Timestamp assignTime) {
		this.assignTime = assignTime;
	}

	/**
	 * 获取完成时间
	 */
	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	/**
	 * 设置完成时间
	 * 
	 * @param finishTime 完成时间
	 */
	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	/**
	 * 获取备注
	 * 
	 * @return 备注
	 */
	@Column(name = "remark", length = 255)
	public String getRemark() {
		return remark;
	}

	/**
	 * 设置备注
	 * 
	 * @param remark 备注
	 */
	public void setRemark(String remark) {
		this.remark = remark;
	}

	/**
	 * 获取创建时间
	 * 
	 * @return 创建时间
	 */
	@Column(name = "createTime", nullable = false)
	public Timestamp getCreateTime() {
		return createTime;
	}

	/**
	 * 设置创建时间
	 * 
	 * @param createTime 创建时间
	 */
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	// ==================== PO/VO 转换方法 ====================

	/**
	 * PO 转 VO
	 * 
	 * @param vo VO对象
	 * @return 转换后的VO对象
	 */
	public QuotationAssignRequestVO ptv(QuotationAssignRequestVO vo) {
		BeanUtils.copyProperties(this, vo, "company", "department", "requestUser", "user");

		if (vo.getCompany() != null && getCompany() != null) getCompany().ptv(vo.getCompany());
		if (vo.getDepartment() != null && getDepartment() != null) getDepartment().ptv(vo.getDepartment());
		if (vo.getRequestUser() != null && getRequestUser() != null) vo.getRequestUser().setBaseInfo(getRequestUser());
		if (vo.getUser() != null && getUser() != null) vo.getUser().setBaseInfo(getUser());

		return vo;
	}

	/**
	 * VO 转 PO
	 * 
	 * @param vo VO对象
	 * @return 转换后的PO对象
	 */
	public QuotationAssignRequestPO vtp(QuotationAssignRequestVO vo) {
		// 复制基本属性，排除关联对象（UserBaseVO无法直接复制到UserPO）
		com.fanglin.utils.BeanUtil.copyProperties(vo, this, "company", "department", "requestUser", "user");

		return this;
	}
}
