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

package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class FunctionAreaItemVO implements Serializable {

	private static final long serialVersionUID = 134446416L;

	private Long autoId;
	
	@SerializedName("功能区信息")
	private FunctionAreaVO functionArea;
	
	@SerializedName("报价项信息")
	private QuotationItemVO quotationItem;
	
	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
	}

	public FunctionAreaVO getFunctionArea() {
		return functionArea;
	}

	public void setFunctionArea(FunctionAreaVO functionArea) {
		this.functionArea = functionArea;
	}

	public QuotationItemVO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemVO quotationItem) {
		this.quotationItem = quotationItem;
	}

	
}
