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
import com.fanglin.quotation.vo.QuotationAssignConfigVO;
import com.fanglin.utils.BeanUtil;

/**
 * 报价单预算配置表 PO
 * 职责: 控制哪些公司/部门启用预算员分配功能
 * @table quotationassignconfig
 */
@Entity
@Table(name = "quotationassignconfig", catalog = "quotation")
public class QuotationAssignConfigPO implements Serializable {

	private static final long serialVersionUID = 1L;

	// COLUMN 常量
	public static final String COLUMN_COMPANY_STR = "company";
	public static final String COLUMN_DEPARTMENT_STR = "department";
	public static final String COLUMN_ENABLED_STR = "enabled";
	public static final String COLUMN_AUTOASSIGN_STR = "autoAssign";

	// 启用状态常量
	public static final short ENABLED_DISABLED_INT = 0;	// 禁用
	public static final short ENABLED_ENABLED_INT = 1;	// 启用

	// 自动分配常量
	public static final short AUTO_ASSIGN_MANUAL_INT = 0;	// 手动
	public static final short AUTO_ASSIGN_AUTO_INT = 1;		// 自动

	// 字段
	private long qacid;					// 配置ID
	private int company;				// 公司ID
	private DepartmentPO department;	// 部门对象
	private short enabled;				// 是否启用：0-禁用，1-启用
	private short autoAssign;			// 是否自动分配：0-手动，1-自动
	private Timestamp createTime;		// 创建时间
	private Timestamp updateTime;		// 更新时间

	// 构造函数
	public QuotationAssignConfigPO() {
		super();
		// 默认值
		this.enabled = ENABLED_ENABLED_INT;
		this.autoAssign = AUTO_ASSIGN_AUTO_INT;
		this.createTime = new Timestamp(System.currentTimeMillis());
	}

	// Getter and Setter
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qacid")
	public long getQacid() {
		return qacid;
	}

	public void setQacid(long qacid) {
		this.qacid = qacid;
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

	@Column(name = "enabled", nullable = false)
	public short getEnabled() {
		return enabled;
	}

	public void setEnabled(short enabled) {
		this.enabled = enabled;
	}

	@Column(name = "autoAssign", nullable = false)
	public short getAutoAssign() {
		return autoAssign;
	}

	public void setAutoAssign(short autoAssign) {
		this.autoAssign = autoAssign;
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
	public QuotationAssignConfigVO ptv(QuotationAssignConfigVO vo) {
		BeanUtil.copyProperties(this, vo);

		// 设置关联对象
		if (getDepartment() != null) {
			vo.setDepartment(getDepartment().getDId());
		}

		// 设置状态名称
		if (getEnabled() == ENABLED_ENABLED_INT) {
			vo.setEnabledName("已启用");
		} else {
			vo.setEnabledName("已禁用");
		}

		if (getAutoAssign() == AUTO_ASSIGN_AUTO_INT) {
			vo.setAutoAssignName("自动分配");
		} else {
			vo.setAutoAssignName("手动分配");
		}

		return vo;
	}
}
