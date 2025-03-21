/**
 * @File Name		: QuotationItemVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class QuotationRtemVO implements Serializable {

	private static final long serialVersionUID = 3616107785340480654L;

	private Long qrid;

	private QuotationItemVO source;

	private QuotationItemVO target;

	private Short type;

	private String formula;

	private String comment;

	public QuotationRtemVO() {
		super();
	}

	public QuotationRtemVO(QuotationItemVO soure, QuotationItemVO target) {
		super();
		this.source = soure;
		this.target = target;
	}

	public Long getQrid() {
		return qrid;
	}

	public void setQrid(Long qrid) {
		this.qrid = qrid;
	}

	public QuotationItemVO getSource() {
		return source;
	}

	public void setSource(QuotationItemVO source) {
		this.source = source;
	}

	public QuotationItemVO getTarget() {
		return target;
	}

	public void setTarget(QuotationItemVO target) {
		this.target = target;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
