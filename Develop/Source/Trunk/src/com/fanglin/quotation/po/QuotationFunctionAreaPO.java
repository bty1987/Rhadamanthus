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
@Table(name = "quotationfunctionarea", catalog = "platform")
public class QuotationFunctionAreaPO implements Serializable {

	private static final long serialVersionUID = 7743703726911437039L;

	public static final String TYPE_COMMON_STR = "普通";
	
	public static final String TYPE_MANAGEMENT_STR = "管理费";
	
	private long qfaId;
	
	private QuotationPO quotation;
	
	private String functionAreaName;
	
	private int functionAreaOrder;
	
	private String functionAreaType;

	public QuotationFunctionAreaPO(){
		super();
	}
	
	public QuotationFunctionAreaPO(long qfaId){
		this.qfaId = qfaId;
	}
	
	@Id
	@GeneratedValue
	@Column(name="qfaId")
	public long getQfaId(){
		return qfaId;
	}

	public void setQfaId(long qfaId){
		this.qfaId = qfaId;
	}

	public String getFunctionAreaName(){
		return functionAreaName;
	}

	public void setFunctionAreaName(String functionAreaName){
		this.functionAreaName = functionAreaName;
	}

	public void setQuotation(QuotationPO quotation){
		this.quotation = quotation;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "quotationId",referencedColumnName = "qId")
	public QuotationPO getQuotation(){
		return quotation;
	}

	public void setFunctionAreaOrder(int functionAreaOrder){
		this.functionAreaOrder = functionAreaOrder;
	}

	public int getFunctionAreaOrder(){
		return functionAreaOrder;
	}

	public void setFunctionAreaType(String functionAreaType){
		this.functionAreaType = functionAreaType;
	}

	public String getFunctionAreaType(){
		return functionAreaType;
	}

}
