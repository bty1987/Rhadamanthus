package com.fanglin.report.vo;

import java.io.Serializable;

/**
 * 双线趋势指标点（日期+两个值），用于开工/完工、实际/计划工期等双线对比折线。
 */
public class MetricDualTrendVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private String date; // 日期 yyyy-MM

	private long value1; // 值1（如开工量、实际工期）

	private long value2; // 值2（如完工量、计划工期）

	public MetricDualTrendVO() {
		super();
	}

	public MetricDualTrendVO(String date, long value1, long value2) {
		super();
		this.date = date;
		this.value1 = value1;
		this.value2 = value2;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public long getValue1() {
		return value1;
	}

	public void setValue1(long value1) {
		this.value1 = value1;
	}

	public long getValue2() {
		return value2;
	}

	public void setValue2(long value2) {
		this.value2 = value2;
	}

}
