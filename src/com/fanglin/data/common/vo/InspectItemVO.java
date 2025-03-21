package com.fanglin.data.common.vo;

import java.io.Serializable;

public class InspectItemVO implements Serializable {

	private static final long serialVersionUID = 6825257986900447123L;

	private Long iiid;

	private Long iid;

	private String title;

	private Short type;

	private Short isRequire;

	public InspectItemVO() {
		super();
	}

	public InspectItemVO(Long iid) {
		super();
		this.iid = iid;
	}

	public Long getIiid() {
		return iiid;
	}

	public void setIiid(Long iiid) {
		this.iiid = iiid;
	}

	public Long getIid() {
		return iid;
	}

	public void setIid(Long iid) {
		this.iid = iid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Short getIsRequire() {
		return isRequire;
	}

	public void setIsRequire(Short isRequire) {
		this.isRequire = isRequire;
	}

}
