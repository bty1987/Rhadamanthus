package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationMidpackVO implements Serializable {

	private static final long serialVersionUID = -3908006385443580348L;

	private Long dmid;

	private DecorationVO decoration;

	private Long psId;
	
	private String name;
	
	private Long materialPrice;
	
	private Long servicePrice;
	
	private Long materialPaidup;
	
	private Short status;

	public DecorationMidpackVO() {
		super();
	}

	public DecorationMidpackVO(DecorationVO decoration) {
		super();
		this.decoration = decoration;
	}

	public Long getDmid() {
		return dmid;
	}

	public void setDmid(Long dmid) {
		this.dmid = dmid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Long getPsId() {
		return psId;
	}

	public void setPsId(Long psId) {
		this.psId = psId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(Long materialPrice) {
		this.materialPrice = materialPrice;
	}

	public Long getServicePrice() {
		return servicePrice;
	}

	public void setServicePrice(Long servicePrice) {
		this.servicePrice = servicePrice;
	}

	public Long getMaterialPaidup() {
		return materialPaidup;
	}

	public void setMaterialPaidup(Long materialPaidup) {
		this.materialPaidup = materialPaidup;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
