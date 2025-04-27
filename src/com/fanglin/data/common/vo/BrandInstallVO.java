package com.fanglin.data.common.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.BrandVO;


public class BrandInstallVO implements Serializable {

	private static final long serialVersionUID = -9013712086696950436L;
	
	private Long biid;
	
	private BrandVO brand;
	
	private String name;
	
	private ConstructionNodeVO constructionNode;
	
	private Integer workNum;
	
	private Short status;
	
	private String comment;
	
	public BrandInstallVO() {
		super();
	}

	public BrandInstallVO(BrandVO brand, ConstructionNodeVO constructionNode) {
		super();
		this.brand = brand;
		this.constructionNode = constructionNode;
	}

	public Long getBiid() {
		return biid;
	}

	public void setBiid(Long biid) {
		this.biid = biid;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
		this.brand = brand;
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

	public Integer getWorkNum() {
		return workNum;
	}

	public void setWorkNum(Integer workNum) {
		this.workNum = workNum;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
