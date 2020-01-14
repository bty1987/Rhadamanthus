package com.fanglin.approval.vo;

import java.io.Serializable;

public class ApprovalCustomerOriginVO implements Serializable {

	private static final long serialVersionUID = 5937990438453637182L;

	private Long acoid;

	private Long aid;

	private Long csid;

	public Long getAcoid() {
		return acoid;
	}

	public void setAcoid(Long acoid) {
		this.acoid = acoid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

}
