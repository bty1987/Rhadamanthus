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
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;
import com.fanglin.utils.BeanUtil;

/**
 * 报价单预算员规则表 PO
 * 
 * @table quotationassignuserrule
 */
@Entity
@Table(name = "quotationassignuserrule", catalog = "quotation")
public class QuotationAssignUserRulePO implements Serializable {

	private static final long serialVersionUID = 1L;

	// COLUMN 常量
	public static final String COLUMN_UID_STR = "user.uid";
	public static final String COLUMN_COMPANY_STR = "company";
	public static final String COLUMN_DEPARTMENT_STR = "department";
	public static final String COLUMN_STATUS_STR = "status";
	public static final String COLUMN_LASTFINISHTIME_STR = "lastFinishTime";
	public static final String COLUMN_CURRENTTASKCOUNT_STR = "currentTaskCount";

	// 状态常量
	public static final short STATUS_AVAILABLE_INT = 1; // 待分配
	public static final short STATUS_BUSY_INT = 2; // 制作中
	public static final short STATUS_STOP_INT = 3; // 停止
	public static final short STATUS_COMPLETED_INT = 4; // 已完成

	// 字段
	private long qaurid; // 预算员规则ID
	private UserPO user; // 预算员用户对象
	private int company; // 关联公司ID
	private DepartmentPO department; // 部门对象
	private short status; // 状态：1-待分配，2-制作中，3-停止，4-已完成
	private Timestamp lastFinishTime; // 最后完成时间
	private int currentTaskCount; // 当前任务数量
	private Timestamp createTime; // 创建时间
	private Timestamp updateTime; // 更新时间

	// 构造函数
	public QuotationAssignUserRulePO() {
		super();
	}

	// Getter and Setter
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qaurid")
	public long getQaurid() {
		return qaurid;
	}

	public void setQaurid(long qaurid) {
		this.qaurid = qaurid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "uid", referencedColumnName = "uId", nullable = false)
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
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

	@Column(name = "status", nullable = false)
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "lastFinishTime")
	public Timestamp getLastFinishTime() {
		return lastFinishTime;
	}

	public void setLastFinishTime(Timestamp lastFinishTime) {
		this.lastFinishTime = lastFinishTime;
	}

	@Column(name = "currentTaskCount")
	public int getCurrentTaskCount() {
		return currentTaskCount;
	}

	public void setCurrentTaskCount(int currentTaskCount) {
		this.currentTaskCount = currentTaskCount;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	// PO 转 VO 方法
	public QuotationAssignUserRuleVO ptv(QuotationAssignUserRuleVO vo) {
		BeanUtil.copyProperties(this, vo);

		// 处理 user 关联对象
		if (getUser() != null) {
			vo.setUid(getUser().getUid());
		}

		// 处理 department 关联对象
		if (getDepartment() != null) {
			vo.setDepartment(getDepartment().getDid());
			vo.setDepartmentName(getDepartment().getName());
		}

		// 设置状态名称
		switch (getStatus()) {
			case STATUS_AVAILABLE_INT:
				vo.setStatusName("待分配");
				break;
			case STATUS_BUSY_INT:
				vo.setStatusName("制作中");
				break;
			case STATUS_STOP_INT:
				vo.setStatusName("停止");
				break;
			case STATUS_COMPLETED_INT:
				vo.setStatusName("已完成");
				break;
			default:
				vo.setStatusName("未知");
				break;
		}

		return vo;
	}
}
