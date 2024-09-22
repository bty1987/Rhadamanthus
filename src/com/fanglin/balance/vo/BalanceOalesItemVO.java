package com.fanglin.balance.vo;

import com.fanglin.sales.vo.OalesVO;

public class BalanceOalesItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 3612119069432836582L;

	private Long boiid;

	private Long boid;

	private OalesVO oales;

	public BalanceOalesItemVO() {
		super();
	}

	public BalanceOalesItemVO(OalesVO oales) {
		super();
		this.oales = oales;
	}

	public Long getBoiid() {
		return boiid;
	}

	public void setBoiid(Long boiid) {
		this.boiid = boiid;
	}

	public Long getBoid() {
		return boid;
	}

	public void setBoid(Long boid) {
		this.boid = boid;
	}

	public OalesVO getOales() {
		return oales;
	}

	public void setOales(OalesVO oales) {
		this.oales = oales;
	}

}
