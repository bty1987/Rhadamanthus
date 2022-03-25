package com.fanglin.customer.vo;

import java.io.Serializable;

public class SurveyOptionVO implements Serializable{
	
	private static final long serialVersionUID = -744105538000533256L;

	private Long soid;
	
	private Long siid;
	
	private Long sid;
	
	private String title;
	
	private Short checked;
	
	public SurveyOptionVO() {
		super();
	}

	public Long getSoid() {
		return soid;
	}

	public void setSoid(Long soid) {
		this.soid = soid;
	}

	public Long getSiid() {
		return siid;
	}

	public void setSiid(Long siid) {
		this.siid = siid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
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
