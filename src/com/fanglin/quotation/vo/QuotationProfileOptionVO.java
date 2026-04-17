package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QuotationProfileOptionVO implements Serializable {

	private static final long serialVersionUID = -489118058107655756L;

	private Long qpoid;

	private Long qpiid;

	private Long qpid;

	private String title;

	private Short checked;

	public QuotationProfileOptionVO() {
		super();
	}

	public Long getQpoid() {
		return qpoid;
	}

	public void setQpoid(Long qpoid) {
		this.qpoid = qpoid;
	}

	public Long getQpiid() {
		return qpiid;
	}

	public void setQpiid(Long qpiid) {
		this.qpiid = qpiid;
	}

	public Long getQpid() {
		return qpid;
	}

	public void setQpid(Long qpid) {
		this.qpid = qpid;
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
