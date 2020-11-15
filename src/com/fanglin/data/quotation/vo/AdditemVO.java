package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.ConstructionNodeVO;

public class AdditemVO implements Serializable {

	private static final long serialVersionUID = 1892909861596612250L;

	private Long aiid;

	private String name;

	private ConstructionNodeVO  constructionNode;

	private Short status;
	
	private Integer company;
	
	public AdditemVO() {
		super();
	}
	
	public AdditemVO(ConstructionNodeVO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	public Long getAiid() {
		return aiid;
	}

	public void setAiid(Long aiid) {
		this.aiid = aiid;
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
