package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 预算配置表 PO
 * 职责: 控制哪些公司/部门启用预算员分配功能
 * @table quotationconfig
 */
@Entity
@Table(name = "quotationconfig", catalog = "quotation")
public class QuotationConfigPO implements Serializable {

	private static final long serialVersionUID = 1L;

	// 启用状态常量
	public static final byte ENABLED_DISABLED_INT = 0;	// 禁用
	public static final byte ENABLED_ENABLED_INT = 1;	// 启用

	// 自动分配常量
	public static final byte AUTO_ASSIGN_MANUAL_INT = 0;	// 手动
	public static final byte AUTO_ASSIGN_AUTO_INT = 1;		// 自动

	// 字段
	private Integer bcid;				// 配置ID
	private Integer company;			// 公司ID
	private Integer department;			// 部门ID
	private Byte enabled;				// 是否启用：0-禁用，1-启用
	private Byte autoAssign;			// 是否自动分配：0-手动，1-自动
	private Timestamp createTime;		// 创建时间
	private Timestamp updateTime;		// 更新时间

	// 构造函数
	public QuotationConfigPO() {
		super();
		// 默认值
		this.enabled = ENABLED_ENABLED_INT;
		this.autoAssign = AUTO_ASSIGN_AUTO_INT;
		this.createTime = new Timestamp(System.currentTimeMillis());
	}

	// Getter and Setter
	@Id
	@GeneratedValue
	@Column(name = "bcid")
	public Integer getBcid() {
		return bcid;
	}

	public void setBcid(Integer bcid) {
		this.bcid = bcid;
	}

	@Column(name = "company", nullable = false)
	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	@Column(name = "department")
	public Integer getDepartment() {
		return department;
	}

	public void setDepartment(Integer department) {
		this.department = department;
	}

	@Column(name = "enabled", nullable = false)
	public Byte getEnabled() {
		return enabled;
	}

	public void setEnabled(Byte enabled) {
		this.enabled = enabled;
	}

	@Column(name = "autoAssign", nullable = false)
	public Byte getAutoAssign() {
		return autoAssign;
	}

	public void setAutoAssign(Byte autoAssign) {
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
}
