package com.fanglin.information.vo;

import java.io.Serializable;

public class NoticeDepartmentVO implements Serializable {

	private static final long serialVersionUID = 7120910110224076414L;

	private Long ndid;

	private Long nid;

	private Integer did;

	public NoticeDepartmentVO() {
		super();
	}

	public Long getNdid() {
		return ndid;
	}

	public void setNdid(Long ndid) {
		this.ndid = ndid;
	}

	public Long getNid() {
		return nid;
	}

	public void setNid(Long nid) {
		this.nid = nid;
	}

	public Integer getDid() {
		return did;
	}

	public void setDid(Integer did) {
		this.did = did;
	}

}
