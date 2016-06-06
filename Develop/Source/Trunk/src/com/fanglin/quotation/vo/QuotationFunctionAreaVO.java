package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.util.List;

public class QuotationFunctionAreaVO implements Serializable {

	private static final long serialVersionUID = 793543025071046420L;
	
	private int id; // 配合页面存储信息

	private Long qfaId;
	
	private String functionAreaName;
	
	private Integer functionAreaOrder;
	
	private Float sum;
	
	private String functionAreaType;
	
	private List<QuotationFunctionAreaItemVO> quotationFunctionAreaItems;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Long getQfaId(){
		return qfaId;
	}

	public void setQfaId(Long qfaId){
		this.qfaId = qfaId;
	}

	public String getFunctionAreaName(){
		return functionAreaName;
	}

	public void setFunctionAreaName(String functionAreaName){
		this.functionAreaName = functionAreaName;
	}

	public Integer getFunctionAreaOrder(){
		return functionAreaOrder;
	}

	public void setFunctionAreaOrder(Integer functionAreaOrder){
		this.functionAreaOrder = functionAreaOrder;
	}

	public void setFunctionAreaType(String functionAreaType){
		this.functionAreaType = functionAreaType;
	}

	public String getFunctionAreaType(){
		return functionAreaType;
	}

	public void setSum(Float sum){
		this.sum = sum;
	}

	public Float getSum(){
		return sum;
	}
	
	public List<QuotationFunctionAreaItemVO> getQuotationFunctionAreaItems() {
		return quotationFunctionAreaItems;
	}

	public void setQuotationFunctionAreaItems(
			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItems) {
		this.quotationFunctionAreaItems = quotationFunctionAreaItems;
	}

}
