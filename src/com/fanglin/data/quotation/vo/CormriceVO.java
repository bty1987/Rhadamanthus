package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.common.vo.ConstructionNodeVO;

public class CormriceVO implements Serializable {

	private static final long serialVersionUID = -708477055324736898L;

	private Long cpid;

	private QuotationCtemVO quotationCtem;

	private ConstructionNodeVO constructionNode;

	private String unit;

	private Integer trannum;

	private Integer salary;

	private Short status;

	private Integer company;

	public CormriceVO() {
		super();
	}

	public CormriceVO(QuotationCtemVO quotationCtem, ConstructionNodeVO constructionNode) {
		super();
		this.quotationCtem = quotationCtem;
		this.constructionNode = constructionNode;
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public QuotationCtemVO getQuotationCtem() {
		return quotationCtem;
	}

	public void setQuotationCtem(QuotationCtemVO quotationCtem) {
		this.quotationCtem = quotationCtem;
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

	public Integer getSalary() {
		return salary;
	}

	public void setSalary(Integer salary) {
		this.salary = salary;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
