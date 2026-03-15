package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 预算员类型支持表 PO
 * 职责: 定义预算员支持的装修类型（半包/整装）
 * @table quotationuserruletype
 */
@Entity
@Table(name = "quotationuserruletype", catalog = "quotation")
public class BudgetUserRuleTypePO implements Serializable {

	private static final long serialVersionUID = 1L;

	// 装修类型常量
	public static final byte TYPE_HALF_INT = 1;	// 半包
	public static final byte TYPE_FULL_INT = 2;	// 整装

	// 字段
	private Integer id;			// ID
	private Integer burid;		// 预算员规则ID
	private Byte type;			// 装修类型：1-半包，2-整装
	private Timestamp createTime;	// 创建时间

	// 构造函数
	public BudgetUserRuleTypePO() {
		super();
	}

	// Getter and Setter
	@Id
	@GeneratedValue
	@Column(name = "id")
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "burid", nullable = false)
	public Integer getBurid() {
		return burid;
	}

	public void setBurid(Integer burid) {
		this.burid = burid;
	}

	@Column(name = "type", nullable = false)
	public Byte getType() {
		return type;
	}

	public void setType(Byte type) {
		this.type = type;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
}
