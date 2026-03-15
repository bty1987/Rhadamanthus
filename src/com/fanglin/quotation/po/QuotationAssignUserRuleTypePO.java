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

import com.fanglin.quotation.vo.QuotationAssignUserRuleTypeVO;
import com.fanglin.utils.BeanUtil;

/**
 * 报价单预算员类型支持表 PO
 * @table quotationassignuserruletype
 */
@Entity
@Table(name = "quotationassignuserruletype", catalog = "quotation")
public class QuotationAssignUserRuleTypePO implements Serializable {

	private static final long serialVersionUID = 1L;

	// COLUMN 常量
	public static final String COLUMN_QAURID_STR = "quotationAssignUserRule.qaurid";
	public static final String COLUMN_TYPE_STR = "type";

	// 类型常量
	public static final short TYPE_HALF_INT = 1;	// 半包
	public static final short TYPE_FULL_INT = 2;	// 整装

	// 字段
	private long id;						// ID
	private QuotationAssignUserRulePO quotationAssignUserRule;	// 预算员规则对象
	private short type;					// 装修类型：1-半包，2-整装
	private Timestamp createTime;		// 创建时间

	// 构造函数
	public QuotationAssignUserRuleTypePO() {
		super();
	}

	// Getter and Setter
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "id")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "qaurid", referencedColumnName = "qaurid", nullable = false)
	public QuotationAssignUserRulePO getQuotationAssignUserRule() {
		return quotationAssignUserRule;
	}

	public void setQuotationAssignUserRule(QuotationAssignUserRulePO quotationAssignUserRule) {
		this.quotationAssignUserRule = quotationAssignUserRule;
	}

	@Column(name = "type", nullable = false)
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	// PO 转 VO 方法
	public QuotationAssignUserRuleTypeVO ptv() {
		return ptv(new QuotationAssignUserRuleTypeVO());
	}

	public QuotationAssignUserRuleTypeVO ptv(QuotationAssignUserRuleTypeVO vo) {
		BeanUtil.copyProperties(this, vo);

		// 处理 quotationAssignUserRule 关联对象
		if (getQuotationAssignUserRule() != null) {
			vo.setQaurid(getQuotationAssignUserRule().getQaurid());
		}

		// 设置类型名称
		if (getType() == TYPE_HALF_INT) {
			vo.setTypeName("半包");
		} else if (getType() == TYPE_FULL_INT) {
			vo.setTypeName("整装");
		} else {
			vo.setTypeName("未知");
		}

		return vo;
	}
}
