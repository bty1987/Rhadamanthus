package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import javax.persistence.Column;

public class FunctionAreaOptionVO implements Serializable {

	private static final long serialVersionUID = 855684955218154344L;

	private Long faoid;

	private Long faiid;

	private Long faid;

	private String title;

	private Short checked;

	public FunctionAreaOptionVO() {
		super();
	}

	public Long getFaoid() {
		return faoid;
	}

	public void setFaoid(Long faoid) {
		this.faoid = faoid;
	}

	public Long getFaiid() {
		return faiid;
	}

	public void setFaiid(Long faiid) {
		this.faiid = faiid;
	}

	public Long getFaid() {
		return faid;
	}

	public void setFaid(Long faid) {
		this.faid = faid;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "checked")
	public Short getChecked() {
		return checked;
	}

	public void setChecked(Short checked) {
		this.checked = checked;
	}

}
