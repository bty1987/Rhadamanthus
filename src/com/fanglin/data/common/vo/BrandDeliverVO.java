package com.fanglin.data.common.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.BrandVO;


public class BrandDeliverVO implements Serializable {

	private static final long serialVersionUID = -4904544835339842109L;

	private Long bdid;

	private BrandVO brand;

	private String name;

	private ConstructionNodeVO constructionNode;

	private Integer workNum;

	private Short status;

	private String comment;

	public BrandDeliverVO() {
		super();
	}

	public BrandDeliverVO(BrandVO brand, ConstructionNodeVO constructionNode) {
		super();
		this.brand = brand;
		this.constructionNode = constructionNode;
	}
	
	public Long getBdid() {
		return bdid;
	}

	public void setBdid(Long bdid) {
		this.bdid = bdid;
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
