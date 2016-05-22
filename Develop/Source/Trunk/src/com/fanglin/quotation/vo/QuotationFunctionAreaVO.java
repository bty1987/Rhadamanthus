package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.util.List;

public class QuotationFunctionAreaVO implements Serializable {

	private static final long serialVersionUID = 793543025071046420L;
	
	private int id; // 配合页面存储信息

	private Long autoId;
	
	private String functionAreaName;
	
	private Integer functionAreaOrder;
	
	private Float sum;
	
	private String functionAreaType;
	
	List<QuotationFunctionAreaItemVO> items;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<QuotationFunctionAreaItemVO> getItems(){
		return items;
	}

	public void setItems(List<QuotationFunctionAreaItemVO> items){
		this.items = items;
	}

	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
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

}
