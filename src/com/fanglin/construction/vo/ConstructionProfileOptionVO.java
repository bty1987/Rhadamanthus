package com.fanglin.construction.vo;

import java.io.Serializable;

public class ConstructionProfileOptionVO implements Serializable {

	private static final long serialVersionUID = -489118058107655757L;

	private Long cpoid;

	private Long cpiid;

	private Long cpid;

	private String title;

	private Short checked;

	public ConstructionProfileOptionVO() {
		super();
	}

	public Long getCpoid() {
		return cpoid;
	}

	public void setCpoid(Long cpoid) {
		this.cpoid = cpoid;
	}

	public Long getCpiid() {
		return cpiid;
	}

	public void setCpiid(Long cpiid) {
		this.cpiid = cpiid;
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
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
