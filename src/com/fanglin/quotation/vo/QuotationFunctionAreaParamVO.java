package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QuotationFunctionAreaParamVO implements Serializable {

	private static final long serialVersionUID = 1431132987088853504L;

	private Long qfapid;

	private Long qfaid;

	private Integer girth;

	private Integer area;

	private Integer height;

	private Integer holeLength;

	private Integer holeHeight;

	private Integer windowLength;

	private Integer windowHeight;

	private Integer beamLength;

	private Integer beamHeight;

	public Long getQfapid() {
		return qfapid;
	}

	public void setQfapid(Long qfapid) {
		this.qfapid = qfapid;
	}

	public Long getQfaid() {
		return qfaid;
	}

	public void setQfaid(Long qfaid) {
		this.qfaid = qfaid;
	}

	public Integer getGirth() {
		return girth;
	}

	public void setGirth(Integer girth) {
		this.girth = girth;
	}

	public Integer getArea() {
		return area;
	}

	public void setArea(Integer area) {
		this.area = area;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public Integer getHoleLength() {
		return holeLength;
	}

	public void setHoleLength(Integer holeLength) {
		this.holeLength = holeLength;
	}

	public Integer getHoleHeight() {
		return holeHeight;
	}

	public void setHoleHeight(Integer holeHeight) {
		this.holeHeight = holeHeight;
	}

	public Integer getWindowLength() {
		return windowLength;
	}

	public void setWindowLength(Integer windowLength) {
		this.windowLength = windowLength;
	}

	public Integer getWindowHeight() {
		return windowHeight;
	}

	public void setWindowHeight(Integer windowHeight) {
		this.windowHeight = windowHeight;
	}

	public Integer getBeamLength() {
		return beamLength;
	}

	public void setBeamLength(Integer beamLength) {
		this.beamLength = beamLength;
	}

	public Integer getBeamHeight() {
		return beamHeight;
	}

	public void setBeamHeight(Integer beamHeight) {
		this.beamHeight = beamHeight;
	}

}
