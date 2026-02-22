package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.math.BigDecimal;

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

	/** 周长（米）- 对应公式变量 {a} */
	private BigDecimal girth;

	/** 面积（平方米）- 对应公式变量 {b} */
	private BigDecimal area;

	/** 举架（米）- 对应公式变量 {c} */
	private BigDecimal height;

	/** 洞面长度（米）- 对应公式变量 {d} */
	private BigDecimal holeLength;

	/** 洞面高度（米）- 对应公式变量 {e} */
	private BigDecimal holeHeight;

	/** 窗面长度（米）- 对应公式变量 {f} */
	private BigDecimal windowLength;

	/** 窗面高度（米）- 对应公式变量 {g} */
	private BigDecimal windowHeight;

	/** 梁长（米）- 对应公式变量 {h} */
	private BigDecimal beamLength;

	/** 梁高（米）- 对应公式变量 {i} */
	private BigDecimal beamHeight;

	public QuotetionFunctionAreaParamVO() {
		super();
		// 初始化默认值为 0
		this.girth = BigDecimal.ZERO;
		this.area = BigDecimal.ZERO;
		this.height = BigDecimal.ZERO;
		this.holeLength = BigDecimal.ZERO;
		this.holeHeight = BigDecimal.ZERO;
		this.windowLength = BigDecimal.ZERO;
		this.windowHeight = BigDecimal.ZERO;
		this.beamLength = BigDecimal.ZERO;
		this.beamHeight = BigDecimal.ZERO;
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

	public BigDecimal getGirth() {
		return girth;
	}

	public void setGirth(BigDecimal girth) {
		this.girth = girth;
	}

	public BigDecimal getArea() {
		return area;
	}

	public void setArea(BigDecimal area) {
		this.area = area;
	}

	public BigDecimal getHeight() {
		return height;
	}

	public void setHeight(BigDecimal height) {
		this.height = height;
	}

	public BigDecimal getHoleLength() {
		return holeLength;
	}

	public void setHoleLength(BigDecimal holeLength) {
		this.holeLength = holeLength;
	}

	public BigDecimal getHoleHeight() {
		return holeHeight;
	}

	public void setHoleHeight(BigDecimal holeHeight) {
		this.holeHeight = holeHeight;
	}

	public BigDecimal getWindowLength() {
		return windowLength;
	}

	public void setWindowLength(BigDecimal windowLength) {
		this.windowLength = windowLength;
	}

	public BigDecimal getWindowHeight() {
		return windowHeight;
	}

	public void setWindowHeight(BigDecimal windowHeight) {
		this.windowHeight = windowHeight;
	}

	public BigDecimal getBeamLength() {
		return beamLength;
	}

	public void setBeamLength(BigDecimal beamLength) {
		this.beamLength = beamLength;
	}

	public BigDecimal getBeamHeight() {
		return beamHeight;
	}

	public void setBeamHeight(BigDecimal beamHeight) {
		this.beamHeight = beamHeight;
	}

}
