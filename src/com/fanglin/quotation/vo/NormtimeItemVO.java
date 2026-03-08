package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.math.BigDecimal;

import com.fanglin.data.common.vo.ConstructionNodeVO;

public class NormtimeItemVO implements Serializable {

	private static final long serialVersionUID = 6448253042894853012L;

	private Long ntiid;

	private Long qid;

	private Long sid;

	private Long areald;

	private Long quoteld;

	private Long qiid;

	private Long ntid;

	private Short type;

	private Short normtype;

	private Short atttype;

	private ConstructionNodeVO constructionNode;

	private String name;

	private String unit;

	private Integer trannum;

	private BigDecimal workdays;

	private Integer num;

	public NormtimeItemVO() {
		super();
	}

	public NormtimeItemVO(ConstructionNodeVO constructionNode) {

		super();

		this.constructionNode = constructionNode;
	}

	public Long getNtiid() {
		return ntiid;
	}

	public void setNtiid(Long ntiid) {
		this.ntiid = ntiid;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getAreald() {
		return areald;
	}

	public void setAreald(Long areald) {
		this.areald = areald;
	}

	public Long getQuoteld() {
		return quoteld;
	}

	public void setQuoteld(Long quoteld) {
		this.quoteld = quoteld;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
	}

	public Long getNtid() {
		return ntid;
	}

	public void setNtid(Long ntid) {
		this.ntid = ntid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getNormtype() {
		return normtype;
	}

	public void setNormtype(Short normtype) {
		this.normtype = normtype;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

}
