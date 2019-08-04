package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.decoration.vo.DecorationFunctionVO;

public class DecorationFunctionRightVO implements Serializable {

	private static final long serialVersionUID = -8786421218396200707L;
	
	private Long dfrid;
	
	private String name;
	
	private DecorationFunctionVO decorationFunction;
	
	private int company;
	
	public DecorationFunctionRightVO() {
		super();
	}
	
	public DecorationFunctionRightVO(DecorationFunctionVO decorationFunction) {
		super();
		this.decorationFunction = decorationFunction;
	}

	public Long getDfrid() {
		return dfrid;
	}

	public void setDfrid(Long dfrid) {
		this.dfrid = dfrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public DecorationFunctionVO getDecorationFunction() {
		return decorationFunction;
	}

	public void setDecorationFunction(DecorationFunctionVO decorationFunction) {
		this.decorationFunction = decorationFunction;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
