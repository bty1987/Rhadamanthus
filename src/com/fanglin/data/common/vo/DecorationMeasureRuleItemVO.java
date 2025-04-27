package com.fanglin.data.common.vo;

import java.io.Serializable;

public class DecorationMeasureRuleItemVO implements Serializable {

	private static final long serialVersionUID = -95544587782967838L;

	private Long dmriid;

	private Long dmrid;

	private Integer company;

	public DecorationMeasureRuleItemVO() {
		super();
	}

	public Long getDmriid() {
		return dmriid;
	}

	public void setDmriid(Long dmriid) {
		this.dmriid = dmriid;
	}

	public Long getDmrid() {
		return dmrid;
	}

	public void setDmrid(Long dmrid) {
		this.dmrid = dmrid;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
