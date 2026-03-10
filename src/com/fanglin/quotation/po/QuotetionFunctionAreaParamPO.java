package com.fanglin.quotation.po;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 模板报价功能区参数 PO
 * 
 * 用途：存储模板报价功能区的参数（周长、面积、举架等） 用于公式计算，自动计算报价项工程量
 * 
 * @author Clawd
 * @since 2026-02-23
 */
@Entity
@Table(name = "quotetionfunctionareaparam", catalog = "quotetion")
public class QuotetionFunctionAreaParamPO implements Serializable {

	private static final long serialVersionUID = 1L;

	/** 功能区参数ID（UUID） */
	private String qfapId;

	/** 功能区ID（关联 quotetion_function_area） */
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

	/** 更新时间 */
	private Date updateTime;

	/** 创建时间 */
	private Date createTime;

	public QuotetionFunctionAreaParamPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "qfapId", length = 50)
	public String getQfapId() {
		return qfapId;
	}

	public void setQfapId(String qfapId) {
		this.qfapId = qfapId;
	}

	@Column(name = "qfaId")
	public Long getQfaId() {
		return qfaId;
	}

	public void setQfaId(Long qfaId) {
		this.qfaId = qfaId;
	}

	@Column(name = "girth", precision = 10, scale = 2)
	public BigDecimal getGirth() {
		return girth;
	}

	public void setGirth(BigDecimal girth) {
		this.girth = girth;
	}

	@Column(name = "area", precision = 10, scale = 2)
	public BigDecimal getArea() {
		return area;
	}

	public void setArea(BigDecimal area) {
		this.area = area;
	}

	@Column(name = "height", precision = 10, scale = 2)
	public BigDecimal getHeight() {
		return height;
	}

	public void setHeight(BigDecimal height) {
		this.height = height;
	}

	@Column(name = "holeLength", precision = 10, scale = 2)
	public BigDecimal getHoleLength() {
		return holeLength;
	}

	public void setHoleLength(BigDecimal holeLength) {
		this.holeLength = holeLength;
	}

	@Column(name = "holeHeight", precision = 10, scale = 2)
	public BigDecimal getHoleHeight() {
		return holeHeight;
	}

	public void setHoleHeight(BigDecimal holeHeight) {
		this.holeHeight = holeHeight;
	}

	@Column(name = "windowLength", precision = 10, scale = 2)
	public BigDecimal getWindowLength() {
		return windowLength;
	}

	public void setWindowLength(BigDecimal windowLength) {
		this.windowLength = windowLength;
	}

	@Column(name = "windowHeight", precision = 10, scale = 2)
	public BigDecimal getWindowHeight() {
		return windowHeight;
	}

	public void setWindowHeight(BigDecimal windowHeight) {
		this.windowHeight = windowHeight;
	}

	@Column(name = "beamLength", precision = 10, scale = 2)
	public BigDecimal getBeamLength() {
		return beamLength;
	}

	public void setBeamLength(BigDecimal beamLength) {
		this.beamLength = beamLength;
	}

	@Column(name = "beamHeight", precision = 10, scale = 2)
	public BigDecimal getBeamHeight() {
		return beamHeight;
	}

	public void setBeamHeight(BigDecimal beamHeight) {
		this.beamHeight = beamHeight;
	}

	@Column(name = "updateTime")
	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "createTime")
	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

}
