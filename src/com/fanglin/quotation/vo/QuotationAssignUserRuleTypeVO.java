package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * 报价单预算员类型支持表 VO
 */
public class QuotationAssignUserRuleTypeVO implements Serializable {

	private static final long serialVersionUID = 1L;

	// 字段
	private Long id;			// ID
	private Long qaurid;		// 预算员规则ID
	private Short type;			// 装修类型：1-半包，2-整装
	private String typeName;	// 类型名称
	private Timestamp createTime;	// 创建时间

	// 构造函数
	public QuotationAssignUserRuleTypeVO() {
		super();
	}

	// Getter and Setter
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getQaurid() {
		return qaurid;
	}

	public void setQaurid(Long qaurid) {
		this.qaurid = qaurid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
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
