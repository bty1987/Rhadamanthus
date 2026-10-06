package com.fanglin.data.quotation.vo;

import java.io.Serializable;
import java.math.BigDecimal;

import com.fanglin.data.common.vo.ConstructionNodeVO;

public class CormtimeVO implements Serializable {

	private static final long serialVersionUID = 6581325512288639782L;

	private Long ctid;

	private Long qfid;

	private ConstructionNodeVO constructionNode;

	private String unit;

	private Integer trannum;

	private BigDecimal workdays;

	private Short status;

	public CormtimeVO() {
		super();
	}

	public CormtimeVO(ConstructionNodeVO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	public Long getCtid() {
		return ctid;
	}

	public void setCtid(Long ctid) {
		this.ctid = ctid;
	}

	public Long getQfid() {
		return qfid;
	}

	public void setQfid(Long qfid) {
		this.qfid = qfid;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Integer getTrannum() {
		return trannum;
	}

	public void setTrannum(Integer trannum) {
		this.trannum = trannum;
	}

	public BigDecimal getWorkdays() {
		return workdays;
	}

	public void setWorkdays(BigDecimal workdays) {
		this.workdays = workdays;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
