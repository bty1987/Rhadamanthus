package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QeasureOptionVO implements Serializable {

	private static final long serialVersionUID = 7209099471697283305L;

	private Long qmoid;

	private Long qmiid;

	private Long qmfaid;

	private Long qmid;

	private String title;

	private Short checked;

	public QeasureOptionVO() {
		super();
	}

	public Long getQmoid() {
		return qmoid;
	}

	public void setQmoid(Long qmoid) {
		this.qmoid = qmoid;
	}

	public Long getQmiid() {
		return qmiid;
	}

	public void setQmiid(Long qmiid) {
		this.qmiid = qmiid;
	}

	public Long getQmfaid() {
		return qmfaid;
	}

	public void setQmfaid(Long qmfaid) {
		this.qmfaid = qmfaid;
	}

	public Long getQmid() {
		return qmid;
	}

	public void setQmid(Long qmid) {
		this.qmid = qmid;
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
