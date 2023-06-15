package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.quotation.vo.QuotationFunctionVO;

public class QuotationFunctionRightVO implements Serializable {

	private static final long serialVersionUID = -7624887978560086744L;

	private Long qfrid;

	private String name;

	private QuotationFunctionVO quotationFunction;

	private Short type;

	private int company;

	public QuotationFunctionRightVO() {
		super();
	}

	public QuotationFunctionRightVO(QuotationFunctionVO quotationFunction) {
		super();
		this.quotationFunction = quotationFunction;
	}

	public Long getQfrid() {
		return qfrid;
	}

	public void setQfrid(Long qfrid) {
		this.qfrid = qfrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public QuotationFunctionVO getQuotationFunction() {
		return quotationFunction;
	}

	public void setQuotationFunction(QuotationFunctionVO quotationFunction) {
		this.quotationFunction = quotationFunction;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
