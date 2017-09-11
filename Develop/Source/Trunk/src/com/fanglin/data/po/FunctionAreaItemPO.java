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
@Table(name = "functionareaquoteitem", catalog = "quotation")
public class FunctionAreaItemPO implements Serializable {

	private static final long serialVersionUID = 13444646L;

	private long faiId;
	
	private FunctionAreaPO functionArea;
	
	private QuotationItemPO quotationItem;
	
	@Id
	@GeneratedValue
	@Column(name="faiId", nullable = false)
	public long getFaiId(){
		return faiId;
	}

	public void setFaiId(long faiId){
		this.faiId = faiId;
	}

	public void setQuotationItem(QuotationItemPO quotationItem){
		this.quotationItem = quotationItem;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "quoteItemId", referencedColumnName="qiId")
	public QuotationItemPO getQuotationItem(){
		return quotationItem;
	}

	public void setFunctionArea(FunctionAreaPO functionArea){
		this.functionArea = functionArea;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "functionAreaId", referencedColumnName="faId")
	public FunctionAreaPO getFunctionArea(){
		return functionArea;
	}
}
