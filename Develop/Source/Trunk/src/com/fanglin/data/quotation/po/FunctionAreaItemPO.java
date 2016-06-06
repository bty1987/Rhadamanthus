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

package com.fanglin.data.quotation.po;

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
@Table(name = "functionAreaQuoteItem", catalog = "platform")
public class FunctionAreaItemPO implements Serializable {

	private static final long serialVersionUID = 13444646L;

	private long autoId;
	
	private FunctionAreaPO functionArea;
	
	private QuotationItemPO quotationItem;
	
	@Id
	@GeneratedValue
	@Column(name="autoId", nullable = false)
	public long getAutoId(){
		return autoId;
	}

	public void setAutoId(long autoId){
		this.autoId = autoId;
	}

	public void setQuotationItem(QuotationItemPO quotationItem){
		this.quotationItem = quotationItem;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "quoteItemId", referencedColumnName="autoId")
	public QuotationItemPO getQuotationItem(){
		return quotationItem;
	}

	public void setFunctionArea(FunctionAreaPO functionArea){
		this.functionArea = functionArea;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "functionAreaId", referencedColumnName="autoId")
	public FunctionAreaPO getFunctionArea(){
		return functionArea;
	}
}
