package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.construction.vo.ConstructionFunctionVO;

public class ConstructionFunctionRightVO implements Serializable {

	private static final long serialVersionUID = -878642121839620071L;

	private Long cfrrid;

	private String name;

	private ConstructionFunctionVO constructionFunction;

	private int company;

	public ConstructionFunctionRightVO() {
		super();
	}

	public ConstructionFunctionRightVO(ConstructionFunctionVO constructionFunction) {
		super();
		this.constructionFunction = constructionFunction;
	}

	public Long getCfrrid() {
		return cfrrid;
	}

	public void setCfrrid(Long cfrrid) {
		this.cfrrid = cfrrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ConstructionFunctionVO getConstructionFunction() {
		return constructionFunction;
	}

	public void setConstructionFunction(ConstructionFunctionVO constructionFunction) {
		this.constructionFunction = constructionFunction;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
