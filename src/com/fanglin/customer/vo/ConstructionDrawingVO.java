package com.fanglin.customer.vo;

import java.io.Serializable;

public class ConstructionDrawingVO implements Serializable {

	private static final long serialVersionUID = 577499578868280671L;

	private Long cid;

	private String drawingUrl;

	private Short type;

	private Short schedule;

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public String getDrawingUrl() {
		return drawingUrl;
	}

	public void setDrawingUrl(String drawingUrl) {
		this.drawingUrl = drawingUrl;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}
