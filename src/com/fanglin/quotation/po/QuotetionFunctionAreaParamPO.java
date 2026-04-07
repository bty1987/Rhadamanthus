package com.fanglin.quotation.po;

import java.io.Serializable;
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

	@Column(name = "girth")
	public Integer getGirth() {
		return girth;
	}

	public void setGirth(Integer girth) {
		this.girth = girth;
	}

	@Column(name = "area")
	public Integer getArea() {
		return area;
	}

	public void setArea(Integer area) {
		this.area = area;
	}

	@Column(name = "height")
	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	@Column(name = "holeLength")
	public Integer getHoleLength() {
		return holeLength;
	}

	public void setHoleLength(Integer holeLength) {
		this.holeLength = holeLength;
	}

	@Column(name = "holeHeight")
	public Integer getHoleHeight() {
		return holeHeight;
	}

	public void setHoleHeight(Integer holeHeight) {
		this.holeHeight = holeHeight;
	}

	@Column(name = "windowLength")
	public Integer getWindowLength() {
		return windowLength;
	}

	public void setWindowLength(Integer windowLength) {
		this.windowLength = windowLength;
	}

	@Column(name = "windowHeight")
	public Integer getWindowHeight() {
		return windowHeight;
	}

	public void setWindowHeight(Integer windowHeight) {
		this.windowHeight = windowHeight;
	}

	@Column(name = "beamLength")
	public Integer getBeamLength() {
		return beamLength;
	}

	public void setBeamLength(Integer beamLength) {
		this.beamLength = beamLength;
	}

	@Column(name = "beamHeight")
	public Integer getBeamHeight() {
		return beamHeight;
	}

	public void setBeamHeight(Integer beamHeight) {
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
