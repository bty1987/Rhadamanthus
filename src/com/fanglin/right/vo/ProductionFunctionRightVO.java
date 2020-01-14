package com.fanglin.right.vo;

import com.fanglin.production.vo.ProductionFunctionVO;

public class ProductionFunctionRightVO {

	private Long pfrid;

	private String name;

	private ProductionFunctionVO productionFunction;

	private Integer company;
		
	public ProductionFunctionRightVO() {
		super();
	}

	public ProductionFunctionRightVO(ProductionFunctionVO productionFunction) {
		super();
		this.productionFunction = productionFunction;
	}

	public Long getPfrid() {
		return pfrid;
	}

	public void setPfrid(Long pfrid) {
		this.pfrid = pfrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ProductionFunctionVO getProductionFunction() {
		return productionFunction;
	}

	public void setProductionFunctionVO(ProductionFunctionVO productionFunction) {
		this.productionFunction = productionFunction;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
}
