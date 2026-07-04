package com.fanglin.construction.vo;

import java.io.Serializable;

public class DrawlineProfileOptionVO implements Serializable {

	private static final long serialVersionUID = -489118058107655758L;

	private Long dpoid;

	private Long dpiid;

	private Long dpid;

	private String title;

	private Short checked;

	public DrawlineProfileOptionVO() {
		super();
	}

	public Long getDpoid() {
		return dpoid;
	}

	public void setDpoid(Long dpoid) {
		this.dpoid = dpoid;
	}

	public Long getDpiid() {
		return dpiid;
	}

	public void setDpiid(Long dpiid) {
		this.dpiid = dpiid;
	}

	public Long getDpid() {
		return dpid;
	}

	public void setDpid(Long dpid) {
		this.dpid = dpid;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Short getChecked() {
		return checked;
	}

	public void setChecked(Short checked) {
		this.checked = checked;
	}

}
