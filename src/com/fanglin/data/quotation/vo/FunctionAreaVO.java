/**
 * @File Name		: FunctionAreaVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class FunctionAreaVO implements Serializable {

	private static final long serialVersionUID = -62958203481876631L;

	private Long faid;

	private String no;

	private String name;

	private int functionAreaOrder;

	private String functionAreaType;

	private QuotationVersionVO version;

	private Short type;

	private Long total;

	public FunctionAreaVO() {
		super();
	}

	public FunctionAreaVO(QuotationVersionVO version) {
		super();
		this.version = version;
	}

	public Long getFaid() {
		return faid;
	}

	public void setFaid(Long faid) {
		this.faid = faid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public QuotationVersionVO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionVO version) {
		this.version = version;
	}

	public int getFunctionAreaOrder() {
		return functionAreaOrder;
	}

	public void setFunctionAreaOrder(int functionAreaOrder) {
		this.functionAreaOrder = functionAreaOrder;
	}

	public String getFunctionAreaType() {
		return functionAreaType;
	}

	public void setFunctionAreaType(String functionAreaType) {
		this.functionAreaType = functionAreaType;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

}
