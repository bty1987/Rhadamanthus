package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QeasureFunctionAreaVO implements Serializable {

	private static final long serialVersionUID = 4580548424640135089L;

	private Long qmfaid;

	private Long qmid;

	private Long faid;

	private String name;

	public QeasureFunctionAreaVO() {
		super();
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

	public Long getFaid() {
		return faid;
	}

	public void setFaid(Long faid) {
		this.faid = faid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
