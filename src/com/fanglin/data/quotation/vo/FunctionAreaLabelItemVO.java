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

public class FunctionAreaLabelItemVO implements Serializable {

	private static final long serialVersionUID = -7416059357459141623L;

	private Long faliid;

	private Long faiid;

	private Long qiid;

	private QuotationLabelVO label;

	public Long getFaliid() {
		return faliid;
	}

	public void setFaliid(Long faliid) {
		this.faliid = faliid;
	}

	public Long getFaiid() {
		return faiid;
	}

	public void setFaiid(Long faiid) {
		this.faiid = faiid;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
	}

	public QuotationLabelVO getLabel() {
		return label;
	}

	public void setLabel(QuotationLabelVO label) {
		this.label = label;
	}

}
