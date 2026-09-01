package com.fanglin.report.vo;

import java.io.Serializable;

/**
 * 首页排名查询条件。
 *
 * <p>type 区分排名维度：0 设计师签单业绩 / 1 业务员签单业绩 / 2 监理在建工地；
 * month 为 yyyyMM 整月口径，空则取当月。
 */
public class HomeRankVO implements Serializable {

	private static final long serialVersionUID = 6440626332697385366L;

	private Short type;

	private Integer month;

	public HomeRankVO() {
		super();
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getMonth() {
		return month;
	}

	public void setMonth(Integer month) {
		this.month = month;
	}

}
