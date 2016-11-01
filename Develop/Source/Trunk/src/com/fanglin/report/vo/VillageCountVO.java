package com.fanglin.report.vo;

import com.fanglin.data.common.vo.VillageVO;

public class VillageCountVO implements java.io.Serializable {

	private static final long serialVersionUID = 1545209438701473175L;

	private Long vcId;
	
	private VillageVO village;
	
	private Integer newOrderNum;
	
	private Integer signOrderNum;

	public VillageCountVO() {
		super();
	}

	public VillageCountVO(VillageVO village) {
		super();
		this.village = village;
	}

	public Long getVcId() {
		return vcId;
	}

	public void setVcId(Long vcId) {
		this.vcId = vcId;
	}

	public VillageVO getVillage() {
		return village;
	}

	public void setVillage(VillageVO village) {
		this.village = village;
	}

	public Integer getNewOrderNum() {
		return newOrderNum;
	}

	public void setNewOrderNum(Integer newOrderNum) {
		this.newOrderNum = newOrderNum;
	}

	public Integer getSignOrderNum() {
		return signOrderNum;
	}

	public void setSignOrderNum(Integer signOrderNum) {
		this.signOrderNum = signOrderNum;
	}


}