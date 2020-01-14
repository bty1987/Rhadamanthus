/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			:
 * @Describing	: 
 */

package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "quotationfunctionarea", catalog = "quotation")
public class QuotationFunctionAreaPO implements Serializable {

	private static final long serialVersionUID = 7743703726911437039L;

	public static final short TYPE_MANAGEMENT_INT = 0; // 管理

	public static final short TYPE_PROJECT_NUM_INT = 1; // 工程量

	public static final short TYPE_FUNCTIONAREA_TOTAL_INT = 2; // 功能区总价

	public static final short TYPE_NOT_COUNT_INT = 3; // 不计算

	private long qfaId;

	private QuotationPO quotation;

	private String functionAreaName;

	private int functionAreaOrder;

	private String functionAreaType;

	private short type;

	private long total;

	public QuotationFunctionAreaPO() {
		super();
	}

	public QuotationFunctionAreaPO(long qfaId) {
		this.qfaId = qfaId;
	}

	public QuotationFunctionAreaPO(QuotationPO quotation, String functionAreaName, int functionAreaOrder, short type) {
		this.quotation = quotation;
		this.functionAreaName = functionAreaName;
		this.functionAreaOrder = functionAreaOrder;
		this.type = type;
	}

	@Id
	@GeneratedValue
	@Column(name = "qfaId")
	public long getQfaId() {
		return qfaId;
	}

	public void setQfaId(long qfaId) {
		this.qfaId = qfaId;
	}

	public String getFunctionAreaName() {
		return functionAreaName;
	}

	public void setFunctionAreaName(String functionAreaName) {
		this.functionAreaName = functionAreaName;
	}

	public void setQuotation(QuotationPO quotation) {
		this.quotation = quotation;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "quotationId", referencedColumnName = "qId")
	public QuotationPO getQuotation() {
		return quotation;
	}

	public void setFunctionAreaOrder(int functionAreaOrder) {
		this.functionAreaOrder = functionAreaOrder;
	}

	public int getFunctionAreaOrder() {
		return functionAreaOrder;
	}

	public void setFunctionAreaType(String functionAreaType) {
		this.functionAreaType = functionAreaType;
	}

	public String getFunctionAreaType() {
		return functionAreaType;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}
}
