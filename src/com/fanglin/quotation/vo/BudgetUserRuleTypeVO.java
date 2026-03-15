package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * 预算员类型支持表 VO
 */
public class BudgetUserRuleTypeVO implements Serializable {

	private static final long serialVersionUID = 1L;

	// 字段
	private Integer id;			// ID
	private Integer burid;		// 预算员规则ID
	private Byte type;			// 装修类型：1-半包，2-整装
	private String typeName;		// 类型名称
	private Timestamp createTime;	// 创建时间

	// 构造函数
	public BudgetUserRuleTypeVO() {
		super();
	}

	// Getter and Setter
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getBurid() {
		return burid;
	}

	public void setBurid(Integer burid) {
		this.burid = burid;
	}

	public Byte getType() {
		return type;
	}

	public void setType(Byte type) {
		this.type = type;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
}
