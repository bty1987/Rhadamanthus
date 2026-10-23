package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.data.common.vo.ConstructionNodeVO;

public class NormriceItemVO implements Serializable {

	private static final long serialVersionUID = 6448253042894853011L;

	private Long npiid;

	private Long qid;

	private Long sid;

	private Long areald;

	private Long quoteld;

	private Long qiid;

	private Short type;

	private Short normtype;

	private Short atttype;

	private ConstructionNodeVO constructionNode;

	private String name;

	private String unit;

	private Integer trannum;

	private Integer salary;

	private Integer num;

	private Short status;

	private String confirmer; // 确认人(userId)

	private Timestamp confirmTime; // 确认时间

	public NormriceItemVO() {
		super();
	}

	public NormriceItemVO(ConstructionNodeVO constructionNode) {

		super();

		this.constructionNode = constructionNode;
	}

	public Long getNpiid() {
		return npiid;
	}

	public void setNpiid(Long npiid) {
		this.npiid = npiid;
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

	public Integer getSalary() {
		return salary;
	}

	public void setSalary(Integer salary) {
		this.salary = salary;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(String confirmer) {
		this.confirmer = confirmer;
	}

	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

}
