/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

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
@Table(name = "functionAreaQuoteItem", catalog = "quotation")
public class FunctionAreaItemPO implements Serializable {

	private static final long serialVersionUID = 13444646L;

	private long faiid;

	private FunctionAreaPO functionArea;

	private QuotationItemPO quotationItem;
	
	private String formula;

	@Id
	@GeneratedValue
	@Column(name = "faiid", nullable = false)
	public long getFaiid() {
		return faiid;
	}

	public void setFaiid(long faiid) {
		this.faiid = faiid;
	}

	public void setQuotationItem(QuotationItemPO quotationItem) {
		this.quotationItem = quotationItem;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "quoteItemId", referencedColumnName = "qiid")
	public QuotationItemPO getQuotationItem() {
		return quotationItem;
	}

	public void setFunctionArea(FunctionAreaPO functionArea) {
		this.functionArea = functionArea;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "functionAreaId", referencedColumnName = "faid")
	public FunctionAreaPO getFunctionArea() {
		return functionArea;
	}
	
	public String getFormula() {
		return formula;
	}
	
	public void setFormula(String formula) {
		this.formula = formula;
	}
	
}
