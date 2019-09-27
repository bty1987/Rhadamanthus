package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationInclusiveVO implements Serializable {

	private static final long serialVersionUID = -3908006385443580348L;
	
	private Long diid;
	
	private DecorationVO decoration;
	
	private Long contractPrice;
	
	private Long projectPrice;	
	
	private Long cdiff;
	
	private Long mdiff;	
	
	private Long managePrice;	
	
	private Integer manageRate;	
	
	private Long materialPaidup;	
	
	private Long psId;
	
	public DecorationInclusiveVO() {
		super();
	}

	public DecorationInclusiveVO(DecorationVO decoration) {
		super();
		this.decoration = decoration;
	}

	public Long getDiid() {
		return diid;
	}

	public void setDiid(Long diid) {
		this.diid = diid;
	}
	
	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Long getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(Long contractPrice) {
		this.contractPrice = contractPrice;
	}

	public Long getProjectPrice() {
		return projectPrice;
	}

	public void setProjectPrice(Long projectPrice) {
		this.projectPrice = projectPrice;
	}

	public Long getCdiff() {
		return cdiff;
	}

	public void setCdiff(Long cdiff) {
		this.cdiff = cdiff;
	}

	public Long getMdiff() {
		return mdiff;
	}

	public void setMdiff(Long mdiff) {
		this.mdiff = mdiff;
	}

	public Long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Long managePrice) {
		this.managePrice = managePrice;
	}

	public Integer getManageRate() {
		return manageRate;
	}

	public void setManageRate(Integer manageRate) {
		this.manageRate = manageRate;
	}

	public Long getMaterialPaidup() {
		return materialPaidup;
	}

	public void setMaterialPaidup(Long materialPaidup) {
		this.materialPaidup = materialPaidup;
	}

	public Long getPsId() {
		return psId;
	}

	public void setPsId(Long psId) {
		this.psId = psId;
	}
}
