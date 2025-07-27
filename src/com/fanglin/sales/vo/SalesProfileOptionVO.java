package com.fanglin.sales.vo;

import java.io.Serializable;

public class SalesProfileOptionVO implements Serializable {

	private static final long serialVersionUID = -8562536471340475379L;

	private Long spoid;

	private Long spiid;

	private Long spid;

	private String title;

	private Short checked;

	public SalesProfileOptionVO() {
		super();
	}

	public Long getSpoid() {
		return spoid;
	}

	public void setSpoid(Long spoid) {
		this.spoid = spoid;
	}

	public Long getSpiid() {
		return spiid;
	}

	public void setSpiid(Long spiid) {
		this.spiid = spiid;
	}

	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
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
