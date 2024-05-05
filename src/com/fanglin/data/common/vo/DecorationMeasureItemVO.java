package com.fanglin.data.common.vo;

import java.io.Serializable;

public class DecorationMeasureItemVO implements Serializable {

	private static final long serialVersionUID = -95544587782967838L;

	private Long dmiid;

	private Long dmid;

	private Integer company;

	public DecorationMeasureItemVO() {
		super();
	}

	public Long getDmiid() {
		return dmiid;
	}

	public void setDmiid(Long dmiid) {
		this.dmiid = dmiid;
	}

	public Long getDmid() {
		return dmid;
	}

	public void setDmid(Long dmid) {
		this.dmid = dmid;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
