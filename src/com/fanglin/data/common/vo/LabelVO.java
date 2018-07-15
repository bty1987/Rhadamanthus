package com.fanglin.data.common.vo;

import java.io.Serializable;

public class LabelVO implements Serializable {

	private static final long serialVersionUID = -6244941175772594861L;
	
	

	private Long lid;
	
	private String name;
	
	private Short scale;
	
	private Short type;
	
	private Short status;
	
	private Short isShow;

	public LabelVO(){
		super();
	}

	public Long getLid() {
		return lid;
	}

	public void setLid(Long lid) {
		this.lid = lid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getScale() {
		return scale;
	}

	public void setScale(Short scale) {
		this.scale = scale;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getIsShow() {
		return isShow;
	}

	public void setIsShow(Short isShow) {
		this.isShow = isShow;
	}

	
	
}
