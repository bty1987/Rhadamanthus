package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationMidpackVO implements Serializable {

	private static final long serialVersionUID = -3908006385443580348L;

	private Long dmid;

	private DecorationVO decoration;

	private Long psId;

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

}
