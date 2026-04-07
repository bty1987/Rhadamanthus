package com.fanglin.quotation.vo;

import java.io.Serializable;

/**
 * 模板报价功能区参数 VO
 *
 * 用途：前端交互时传递功能区参数
 *
 * @author Clawd
 * @since 2026-02-23
 */
public class QuotetionFunctionAreaParamVO implements Serializable {

	private static final long serialVersionUID = 1L;

	/** 功能区参数ID（UUID） */
	private String qfapId;

	/** 功能区ID */
	private Long qfaId;

	/** 周长（毫米）- 对应公式变量 {a} */
	private Integer girth;

	/** 面积（平方毫米）- 对应公式变量 {b} */
	private Integer area;

	/** 举架（毫米）- 对应公式变量 {c} */
	private Integer height;

	/** 洞面长度（毫米）- 对应公式变量 {d} */
	private Integer holeLength;

	/** 洞面高度（毫米）- 对应公式变量 {e} */
	private Integer holeHeight;

	/** 窗面长度（毫米）- 对应公式变量 {f} */
	private Integer windowLength;

	/** 窗面高度（毫米）- 对应公式变量 {g} */
	private Integer windowHeight;

	/** 梁长（毫米）- 对应公式变量 {h} */
	private Integer beamLength;

	/** 梁高（毫米）- 对应公式变量 {i} */
	private Integer beamHeight;

	public QuotetionFunctionAreaParamVO() {
		super();
		// 初始化默认值为 0
		this.girth = 0;
		this.area = 0;
		this.height = 0;
		this.holeLength = 0;
		this.holeHeight = 0;
		this.windowLength = 0;
		this.windowHeight = 0;
		this.beamLength = 0;
		this.beamHeight = 0;
	}

	public String getQfapId() {
		return qfapId;
	}

	public void setQfapId(String qfapId) {
		this.qfapId = qfapId;
	}

	public Long getQfaId() {
		return qfaId;
	}

	public void setQfaId(Long qfaId) {
		this.qfaId = qfaId;
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
