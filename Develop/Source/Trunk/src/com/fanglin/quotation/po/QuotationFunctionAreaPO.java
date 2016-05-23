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

	private static final long serialVersionUID = 1344464611L;
	
	public static String TYPE_COMMON_STR = "普通";
	
	public static String TYPE_MANAGEMENT_STR = "管理费";
	
	private long autoId;
	
	private QuotationPO quotation;
	
	private String functionAreaName;
	
	private int functionAreaOrder;
	
	private String functionAreaType;

	public QuotationFunctionAreaPO(){	}
	
	public QuotationFunctionAreaPO(long autoId){
		this.autoId = autoId;
	}
	
	@Id
	@GeneratedValue
	@Column(name="autoId")
	public long getAutoId(){
		return autoId;
	}

	public void setAutoId(long autoId){
		this.autoId = autoId;
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
	@JoinColumn(nullable = false, name = "quotationId",referencedColumnName = "autoId")
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
