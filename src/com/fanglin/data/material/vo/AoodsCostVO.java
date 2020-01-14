package com.fanglin.data.material.vo;

import java.io.Serializable;

import com.fanglin.construction.vo.ConstructionCostVO;

public class AoodsCostVO implements Serializable {

	private static final long serialVersionUID = 2478633477987763719L;

	private Long acid;

	private AoodsVO aoods;

	private ConstructionCostVO constructionCost;

	private Integer numLimit;
	
	public AoodsCostVO(){
		super();
	}

	public AoodsCostVO(AoodsVO aoods,ConstructionCostVO constructionCost) {
		super();
		this.aoods = aoods;
		this.constructionCost = constructionCost;
	}

	public Long getAcid() {
		return acid;
	}

	public void setAcid(Long acid) {
		this.acid = acid;
	}

	public AoodsVO getAoods() {
		return aoods;
	}

	public void setAoods(AoodsVO aoods) {
		this.aoods = aoods;
	}

	public ConstructionCostVO getConstructionCost() {
		return constructionCost;
	}

	public void setConstructionCost(ConstructionCostVO constructionCost) {
		this.constructionCost = constructionCost;
	}

	public Integer getNumLimit() {
		return numLimit;
	}

	public void setNumLimit(Integer numLimit) {
		this.numLimit = numLimit;
	}
}
