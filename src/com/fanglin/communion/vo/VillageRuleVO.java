package com.fanglin.communion.vo;

import java.io.Serializable;

public class VillageRuleVO implements Serializable {

	private static final long serialVersionUID = 4766541086924277089L;

	private Long vrid;

	private Long vid;

	private BuildingNameRuleVO rule;

	public VillageRuleVO() {
		super();
	}

	
	public VillageRuleVO(BuildingNameRuleVO rule) {
		super();
		this.rule = rule;
	}


	public Long getVrid() {
		return vrid;
	}

	public void setVrid(Long vrid) {
		this.vrid = vrid;
	}

	public Long getVid() {
		return vid;
	}

	public void setVid(Long vid) {
		this.vid = vid;
	}

	public BuildingNameRuleVO getRule() {
		return rule;
	}

	public void setRule(BuildingNameRuleVO rule) {
		this.rule = rule;
	}

}
