package com.fanglin.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.common.vo.ConstructionNodeVO;

public class QuotationNormriceItemVO implements Serializable {

	private static final long serialVersionUID = 4349751566782112040L;

	private Long qnpiid;

	private Long qid;

	private Long sid;

	private Long areaId;

	private Long quoteId;

	private Long qiid;

	private Short type;

	private Short normtype;

	private Short atttype;

	private ConstructionNodeVO constructionNode;

	private String nuit;

	private Integer trannum;

	private Integer salary;

	public Long getQnpiid() {
		return qnpiid;
	}

	public void setQnpiid(Long qnpiid) {
		this.qnpiid = qnpiid;
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

	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	public Long getQuoteId() {
		return quoteId;
	}

	public void setQuoteId(Long quoteId) {
		this.quoteId = quoteId;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
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

	public String getNuit() {
		return nuit;
	}

	public void setNuit(String nuit) {
		this.nuit = nuit;
	}

	public Integer getTrannum() {
		return trannum;
	}

	public void setTrannum(Integer trannum) {
		this.trannum = trannum;
	}

	public Integer getSalary() {
		return salary;
	}

	public void setSalary(Integer salary) {
		this.salary = salary;
	}
}
