package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationInclusiveVO implements Serializable {

	private static final long serialVersionUID = -3908006385443580348L;
	
	private Long diid;
	
	private DecorationVO decoration;
	
	private Float contractPrice;
	
	private Float projectPrice;	
	
	private Float cdiff;
	
	private Float mdiff;	
	
	private Float managePrice;	
	
	private Float manageRate;	
	
	private Float materialPaidup;	
	
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

	public Float getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(Float contractPrice) {
		this.contractPrice = contractPrice;
	}

	public Float getProjectPrice() {
		return projectPrice;
	}

	public void setProjectPrice(Float projectPrice) {
		this.projectPrice = projectPrice;
	}

	public Float getCdiff() {
		return cdiff;
	}

	public void setCdiff(Float cdiff) {
		this.cdiff = cdiff;
	}

	public Float getMdiff() {
		return mdiff;
	}

	public void setMdiff(Float mdiff) {
		this.mdiff = mdiff;
	}

	public Float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Float managePrice) {
		this.managePrice = managePrice;
	}

	public Float getManageRate() {
		return manageRate;
	}

	public void setManageRate(Float manageRate) {
		this.manageRate = manageRate;
	}

	public Float getMaterialPaidup() {
		return materialPaidup;
	}

	public void setMaterialPaidup(Float materialPaidup) {
		this.materialPaidup = materialPaidup;
	}

	public Long getPsId() {
		return psId;
	}

	public void setPsId(Long psId) {
		this.psId = psId;
	}

	


}
