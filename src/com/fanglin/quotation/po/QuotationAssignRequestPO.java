package com.fanglin.quotation.po;

import static javax.persistence.GenerationType.IDENTITY;

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

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.utils.BeanUtil;

/**
 * 装修单预算分配请求表 PO
 * 职责: 控制分配逻辑和待分配队列（装修单级别，最多1条活跃记录）
 * @table quotationassignrequest
 */
@Entity
@Table(name = "quotationassignrequest", catalog = "quotation")
public class QuotationAssignRequestPO implements Serializable {

	private static final long serialVersionUID = 1L;

	// COLUMN 常量
	public static final String COLUMN_ORDERID_STR = "orderId";
	public static final String COLUMN_COMPANY_STR = "company";
	public static final String COLUMN_DEPARTMENT_STR = "department";
	public static final String COLUMN_STATUS_STR = "status";
	public static final String COLUMN_DECORATIONTYPE_STR = "decorationType";

	// 状态常量
	public static final short STATUS_PENDING_INT = 1;	// 待分配
	public static final short STATUS_ASSIGNED_INT = 2;	// 已分配

	// 优先级常量
	public static final short PRIORITY_HIGHEST_INT = 1;	// 最高
	public static final short PRIORITY_HIGH_INT = 3;		// 高
	public static final short PRIORITY_NORMAL_INT = 5;	// 普通
	public static final short PRIORITY_LOW_INT = 7;		// 低
	public static final short PRIORITY_LOWEST_INT = 9;	// 最低

	// 字段
	private long qarid;					// 请求ID
	private String orderId;				// 装修单号（关联 decoration）
	private int company;				// 公司ID
	private DepartmentPO department;	// 部门对象
	private short decorationType;		// 装修类型：1-半包，2-整装
	private short priority;				// 优先级：1-最高，5-普通，9-最低
	private Timestamp requestTime;		// 请求时间
	private UserPO requestUser;			// 请求人（设计师）
	private short status;				// 状态：1-待分配，2-已分配
	private Timestamp assignTime;		// 分配时间
	private String remark;				// 备注

	// 构造函数
	public QuotationAssignRequestPO() {
		super();
		// 默认值
		this.priority = PRIORITY_NORMAL_INT;
		this.status = STATUS_PENDING_INT;
		this.requestTime = new Timestamp(System.currentTimeMillis());
	}

	// Getter and Setter
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qarid")
	public long getQarid() {
		return qarid;
	}

	public void setQarid(long qarid) {
		this.qarid = qarid;
	}

	@Column(name = "orderId", nullable = false)
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "company", nullable = false)
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "department", referencedColumnName = "dId")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@Column(name = "decorationType", nullable = false)
	public short getDecorationType() {
		return decorationType;
	}

	public void setDecorationType(short decorationType) {
		this.decorationType = decorationType;
	}

	@Column(name = "priority", nullable = false)
	public short getPriority() {
		return priority;
	}

	public void setPriority(short priority) {
		this.priority = priority;
	}

	@Column(name = "requestTime", nullable = false)
	public Timestamp getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(Timestamp requestTime) {
		this.requestTime = requestTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "requestUid", referencedColumnName = "uId")
	public UserPO getRequestUser() {
		return requestUser;
	}

	public void setRequestUser(UserPO requestUser) {
		this.requestUser = requestUser;
	}

	@Column(name = "status", nullable = false)
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "assignTime")
	public Timestamp getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(Timestamp assignTime) {
		this.assignTime = assignTime;
	}

	@Column(name = "remark")
	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	// PO 转 VO 方法
	public QuotationAssignRequestVO ptv(QuotationAssignRequestVO vo) {
		BeanUtil.copyProperties(this, vo);

		// 处理 department 关联对象
		if (getDepartment() != null) {
			vo.setDepartment(getDepartment().getDId());
			vo.setDepartmentName(getDepartment().getDName());
		}

		// 处理 requestUser 关联对象
		if (getRequestUser() != null) {
			vo.setRequestUid(getRequestUser().getUid());
		}

		// 设置装修类型名称
		if (getDecorationType() == 1) {
			vo.setDecorationTypeName("半包");
		} else if (getDecorationType() == 2) {
			vo.setDecorationTypeName("整装");
		} else {
			vo.setDecorationTypeName("未知");
		}

		// 设置优先级名称
		switch (getPriority()) {
			case PRIORITY_HIGHEST_INT:
				vo.setPriorityName("最高");
				break;
			case PRIORITY_HIGH_INT:
				vo.setPriorityName("高");
				break;
			case PRIORITY_NORMAL_INT:
				vo.setPriorityName("普通");
				break;
			case PRIORITY_LOW_INT:
				vo.setPriorityName("低");
				break;
			case PRIORITY_LOWEST_INT:
				vo.setPriorityName("最低");
				break;
			default:
				vo.setPriorityName("未知");
				break;
		}

		// 设置状态名称
		if (getStatus() == STATUS_PENDING_INT) {
			vo.setStatusName("待分配");
		} else if (getStatus() == STATUS_ASSIGNED_INT) {
			vo.setStatusName("已分配");
		} else {
			vo.setStatusName("未知");
		}

		return vo;
	}
}
