package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.ConstructionNodeVO;

public class NormriceVO implements Serializable {

	private static final long serialVersionUID = -935031505848098477L;

	private Long npid;// 定额工费id

	private QuotationItemVO quotationItem;// 报价

	private ConstructionNodeVO constructionNode;// 施工节点

	private String unit;

	private Integer trannum;

	private Integer salary;// 工费

	private Short status;

	private Long amount;

	public NormriceVO() {
		super();
	}

	public NormriceVO(ConstructionNodeVO constructionNode, QuotationItemVO quotationItem) {
		super();
		this.quotationItem = quotationItem;
		this.constructionNode = constructionNode;
	}

	public Long getNpid() {
		return npid;
	}

	public void setNpid(Long npid) {
		this.npid = npid;
	}

	public QuotationItemVO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemVO quotationItem) {
		this.quotationItem = quotationItem;
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

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

}