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
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name = "functionArea", catalog = "platform")
public class FunctionAreaPO implements Serializable {

	private static final long serialVersionUID = 13444646L;
	
	private long faId;
	
	private String functionAreaId;
	
	private String functionAreaName;
	
	private QuotationVersionPO quotationVersion;
	
	private int functionAreaOrder;
	
	private String functionAreaType;

	@Id
	@Column(name="faId")
	public long getFaId(){
		return faId;
	}

	public void setFaId(long faId){
		this.faId = faId;
	}

	public String getFunctionAreaId(){
		return functionAreaId;
	}

	public void setFunctionAreaId(String functionAreaId){
		this.functionAreaId = functionAreaId;
	}

	public String getFunctionAreaName(){
		return functionAreaName;
	}

	public void setFunctionAreaName(String functionAreaName){
		this.functionAreaName = functionAreaName;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "versionId")
	public QuotationVersionPO getQuotationVersion(){
		return quotationVersion;
	}

	public void setQuotationVersion(QuotationVersionPO quotationVersion){
		this.quotationVersion = quotationVersion;
	}

	public int getFunctionAreaOrder(){
		return functionAreaOrder;
	}

	public void setFunctionAreaOrder(int functionAreaOrder){
		this.functionAreaOrder = functionAreaOrder;
	}

	public String getFunctionAreaType(){
		return functionAreaType;
	}

	public void setFunctionAreaType(String functionAreaType){
		this.functionAreaType = functionAreaType;
	}

}
