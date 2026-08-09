package com.fanglin.report.analytics.vo;

import java.io.Serializable;

/**
 * 通用指标点（名称+值），用于漏斗、饼图、柱状等单维度图表。
 *
 * <p>前端 Highcharts 可直接转为 {@code {name, y}} 数据点。
 */
public class MetricPointVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private String name; // 维度名称（如"签约""半包"）

	private long value; // 指标值（数量或金额，视口径而定，金额单位分）

	public MetricPointVO() {
		super();
	}

	public MetricPointVO(String name, long value) {
		super();
		this.name = name;
		this.value = value;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getValue() {
		return value;
	}

	public void setValue(long value) {
		this.value = value;
	}

}
