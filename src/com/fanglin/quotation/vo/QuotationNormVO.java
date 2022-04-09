package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QuotationNormVO implements Serializable {

	private static final long serialVersionUID = 8578508128383664267L;

	private Long qnid;

	private Long qid;

	private Long moodTotal;

	private Long mriceTotal;

	private Integer moodPrintNum;

	private Integer mricePriceNum;

	private Short status;

	public QuotationNormVO() {
		super();
	}

	public Long getQnid() {
		return qnid;
	}

	public void setQnid(Long qnid) {
		this.qnid = qnid;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public Long getMoodTotal() {
		return moodTotal;
	}

	public void setMoodTotal(Long moodTotal) {
		this.moodTotal = moodTotal;
	}

	public Long getMriceTotal() {
		return mriceTotal;
	}

	public void setMriceTotal(Long mriceTotal) {
		this.mriceTotal = mriceTotal;
	}

	public Integer getMoodPrintNum() {
		return moodPrintNum;
	}

	public void setMoodPrintNum(Integer moodPrintNum) {
		this.moodPrintNum = moodPrintNum;
	}

	public Integer getMricePriceNum() {
		return mricePriceNum;
	}

	public void setMricePriceNum(Integer mricePriceNum) {
		this.mricePriceNum = mricePriceNum;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
