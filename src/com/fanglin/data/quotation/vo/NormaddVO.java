package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.common.vo.ConstructionNodeVO;

public class NormaddVO implements Serializable {

	private static final long serialVersionUID = 1892909861596612250L;

	private Long naid;

	private String name;

	private ConstructionNodeVO constructionNode;

	private String unit;// 单位

	private Integer price;// 单价

	private Short status;

	private Integer company;

	public NormaddVO() {
		super();
	}

	public NormaddVO(ConstructionNodeVO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	public Long getNaid() {
		return naid;
	}

	public void setNaid(Long naid) {
		this.naid = naid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
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
